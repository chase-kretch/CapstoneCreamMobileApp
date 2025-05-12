using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.WebSockets;
using System.Security.Claims;
using System.Text;
using backend.Data;
using backend.Models.Entities;
using backend.Models.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;

namespace backend.Helpers
{
    public class WebSocketManager
    {
        private Dictionary<int, WebSocket> connectedUsers = new();  // Store users by their ID
        private readonly IServiceProvider _serviceProvider;
        private readonly IConfiguration _configuration;

        public WebSocketManager(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _configuration = configuration;
        }

        private int? GetUserIdFromToken(string token)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            
            var key = Encoding.UTF8.GetBytes(_configuration["JWT_SECRET"]);

            try
            {
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                
                var userId = jwtToken.Claims.First(x => x.Type == "sub").Value;
                
                if (string.IsNullOrEmpty(userId))
                {
                    return null;
                }
                
                return int.Parse(userId); 
            }
            catch (Exception e)
            {
                Console.WriteLine(e.Message);
                // Token validation failed
                return null;
            }
        }

        public async Task HandleWebSocketAsync(HttpContext context)
        {
            if (context.WebSockets.IsWebSocketRequest)
            {
                var token = context.Request.Query["token"];
                
                Console.WriteLine(token);
                
                if (string.IsNullOrEmpty(token))
                {
                    Console.WriteLine("No token provided.");
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return;
                }
                
                var nullableUserId = GetUserIdFromToken(token);

                if (nullableUserId == null)
                {
                    Console.WriteLine("Invalid token provided.");
                    context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
                    return;
                }

                var userId = nullableUserId.Value;
                
                using (var scope = _serviceProvider.CreateScope())
                {
                    var userService = scope.ServiceProvider.GetRequiredService<IUserService>();

                    // Retrieve all users and ensure the current user exists
                    var userResponse = userService.GetUsers();
                    var senderUser = userResponse.Data?.FirstOrDefault(u => u.Id == userId);

                    if (senderUser == null)
                    {
                        Console.WriteLine($"User ID {userId} not found in the database.");
                        context.Response.StatusCode = (int)HttpStatusCode.Forbidden;
                        return;
                    }

                    // Accept the WebSocket connection for the user
                    using var ws = await context.WebSockets.AcceptWebSocketAsync();
                    connectedUsers[userId] = ws;  // Add to the connected users

                    Console.WriteLine($"User {senderUser.FirstName} (ID: {userId}) connected");

                    await ReceiveMessage(ws, userId, senderUser.FirstName);
                }
            }
            else
            {
                Console.WriteLine("Bad WebSocket request");
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            }
        }

        private async Task ReceiveMessage(WebSocket socket, int senderId, string senderName)
        {
            var buffer = new byte[1024 * 4];
            while (socket.State == WebSocketState.Open)
            {
                var result = await socket.ReceiveAsync(new ArraySegment<byte>(buffer), CancellationToken.None);

                if (result.MessageType == WebSocketMessageType.Text)
                {
                    string message = Encoding.UTF8.GetString(buffer, 0, result.Count);

                    // Assume the message is in the format: "recipientId|message"
                    var parts = message.Split('|');
                    if (parts.Length != 2 || !int.TryParse(parts[0], out int recipientId))
                    {
                        Console.WriteLine("Invalid message format.");
                        continue;
                    }

                    string content = parts[1];
                    Console.WriteLine($"Received message from {senderName} (ID: {senderId}) to {recipientId}: {content}");

                    // Save message to database before broadcasting
                    await SaveMessageToDatabase(senderId, recipientId, content);

                    // Broadcast only to the intended recipient
                    await Broadcast(senderId, senderName, recipientId, content);
                }
                else if (result.MessageType == WebSocketMessageType.Close)
                {
                    connectedUsers.Remove(senderId);
                    Console.WriteLine($"User {senderId} disconnected.");
                    await socket.CloseAsync(result.CloseStatus.Value, result.CloseStatusDescription, CancellationToken.None);
                }
            }
        }

        // Method to save message to the database
        private async Task SaveMessageToDatabase(int senderId, int recipientId, string messageContent)
        {
            using (var scope = _serviceProvider.CreateScope())
            {
                var dbContext = scope.ServiceProvider.GetRequiredService<CreamDbContext>();

                var message = new MessageStore
                {
                    SenderId = senderId,
                    ReceiverId = recipientId,
                    Time = DateTime.Now, // Set the timestamp
                    Body = messageContent
                };

                dbContext.MessageStores.Add(message);
                await dbContext.SaveChangesAsync(); // Save to the database
                Console.WriteLine($"Saved message to database: {messageContent} from User {senderId} to User {recipientId}");
            }
        }

        // Broadcast only to the specific recipient
        private async Task Broadcast(int senderId, string senderName, int recipientId, string message)
        {
            if (connectedUsers.ContainsKey(recipientId))
            {
                var recipientSocket = connectedUsers[recipientId];

                if (recipientSocket.State == WebSocketState.Open)
                {
                    // Message to the recipient
                    var fullMessage = $"{senderName}: {message}";
                    var bytes = Encoding.UTF8.GetBytes(fullMessage);
                    var arraySegment = new ArraySegment<byte>(bytes, 0, bytes.Length);
                    await recipientSocket.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);

                    Console.WriteLine($"Message sent from {senderName} (ID: {senderId}) to {recipientId}: {message}");
                }
            }

            // Send confirmation to the sender with "Me" label
            if (connectedUsers.ContainsKey(senderId))
            {
                var senderSocket = connectedUsers[senderId];
                if (senderSocket.State == WebSocketState.Open)
                {
                    var senderMessage = $"Me ({senderName}): {message}";
                    var bytes = Encoding.UTF8.GetBytes(senderMessage);
                    var arraySegment = new ArraySegment<byte>(bytes, 0, bytes.Length);
                    await senderSocket.SendAsync(arraySegment, WebSocketMessageType.Text, true, CancellationToken.None);
                }
            }
        }
    }
}