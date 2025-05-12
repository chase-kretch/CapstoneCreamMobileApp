using System.Security.Claims;
using System.Text;
using System.Text.Json.Serialization;
using Amazon;
using Amazon.Runtime;
using Amazon.S3;
using Amazon.S3.Model;
using backend.Authentication;
using backend.Data;
using backend.Helpers;
using backend.Models.Services;
using backend.Models.Services.Dtos;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Configuration
builder.Configuration.AddEnvironmentVariables(prefix: "CREAM_");

// Database Configuration
ConfigureDatabase(builder);

// Services Configuration
ConfigureServices(builder);

// Authentication and Authorization
ConfigureAuthnAndAuthz(builder);

// CORS Configuration
ConfigureCors(builder);

// Swagger Configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(
    c =>
    {
        c.EnableAnnotations();
        c.SwaggerDoc("v1", new OpenApiInfo { Title = "Cream API", Version = "v1" });
    }
);
builder.Services.AddSwaggerGenWithAuth();
builder.Services.AddHttpLogging(o => { });

var app = builder.Build();

// Application Configuration
ConfigureApp(app);

app.Run();

// Helper Methods
void ConfigureDatabase(WebApplicationBuilder builder)
{
    if (builder.Environment.IsProduction())
    {
        builder.Services.AddDbContext<CreamPostgresDbContext>();
        var db = builder.Services.BuildServiceProvider().GetService<CreamPostgresDbContext>();
        Console.WriteLine("Running Postgres migrations");
        db.Database.Migrate();
        builder.Services.AddScoped<CreamDbContext, CreamPostgresDbContext>();
    }
    else
    {
        builder.Services.AddDbContext<CreamSqliteDbContext>();
        var db = builder.Services.BuildServiceProvider().GetService<CreamSqliteDbContext>();
        Console.WriteLine("Running Sqlite migrations");
        db.Database.Migrate();
        builder.Services.AddScoped<CreamDbContext, CreamSqliteDbContext>();
    }
}


void ConfigureServices(WebApplicationBuilder builder)
{
    builder.Services.AddScoped<ICreamRepo, CreamRepo>();

    ConfigureAWSServices(builder);

    builder.Services.AddLogging();
    builder.Services.AddSingleton<TokenProvider>();
    builder.Services.AddSingleton<Hasher>();
    builder.Services.AddScoped<IUserService, UserService>();
    builder.Services.AddScoped<IUserInteractionService, UserInteractionService>();
    builder.Services.AddScoped<IImageService, ImageService>();
    builder.Services.AddScoped<IUserPreferenceService, UserPreferenceService>();
    builder.Services.AddScoped<IMessageService, MessageService>();
    builder.Services.AddTransient<Login>();
    builder.Services.AddSingleton<DtoMapper>(
        new DtoMapper(builder.Configuration["AWS:CloudFrontDomain"])
    );
    builder.Services.AddSingleton<backend.Helpers.WebSocketManager>();
    
    builder.Services.AddControllers()
        .AddJsonOptions(option=>
        {
            option.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
        });;
    
    // For now there are no circular references in the DTOs
    // builder.Services.AddControllers().AddJsonOptions(options =>
    // {
    //     options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.Preserve;
    // });
}

void ConfigureAWSServices(WebApplicationBuilder builder)
{
    // I originally used AddAWSService<IAmazonS3>() but it would take like 20 seconds to load, this is much faster
    builder.Services.AddSingleton<IAmazonS3>(
        new AmazonS3Client(
            new BasicAWSCredentials(
                builder.Configuration["AWS:AccessKey"],
                builder.Configuration["AWS:SecretKey"]
            ),
            RegionEndpoint.GetBySystemName(builder.Configuration["AWS:Region"])
            )
        );

    builder.Services.AddSingleton(new S3Bucket { BucketName = builder.Configuration["AWS:BucketName"] });
    
    Console.WriteLine($"S3 bucket name: {builder.Configuration["AWS:BucketName"]}");
    Console.WriteLine($"S3 region: {builder.Configuration["AWS:Region"]}");
    Console.WriteLine($"S3 access key: {builder.Configuration["AWS:AccessKey"]}");
}

void ConfigureAuthnAndAuthz(WebApplicationBuilder builder)
{
    builder.Services.AddAuthorization(options =>
    {
        options.AddPolicy("UserPolicy", policy => policy.RequireClaim(ClaimTypes.NameIdentifier));
    });

    var jwtSecret = builder.Configuration.GetValue<string>("JWT_SECRET");

    builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        .AddJwtBearer(o =>
        {
            o.RequireHttpsMetadata = false;
            o.TokenValidationParameters = new TokenValidationParameters
            {
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret)),
                ValidIssuer = builder.Configuration["Jwt:Issuer"],
                ValidAudience = builder.Configuration["Jwt:Audience"],
                ClockSkew = TimeSpan.Zero
            };
            o.Events = new JwtBearerEvents
            {
                OnMessageReceived = context =>
                {
                    context.Token = context.Request.Cookies["JWTToken"];
                    return Task.CompletedTask;
                }
            };
        });
}

void ConfigureCors(WebApplicationBuilder builder)
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("AllowSpecificOrigin",
            policy =>
            {
                policy.SetIsOriginAllowedToAllowWildcardSubdomains();
                policy.WithOrigins("http://localhost:8081", "http://localhost:8080", "https://*.exp.direct", "http://localhost:63342")
                    .AllowCredentials()
                    .AllowAnyHeader()
                    .AllowAnyMethod();
            });
    });
}

void ConfigureApp(WebApplication app)
{
    app.UseCors("AllowSpecificOrigin");
    app.UseSwagger();
    app.UseSwaggerUI();
    app.UseHttpsRedirection();
    app.MapControllers();
    app.UseAuthentication();
    app.UseAuthorization();
    
    app.UseWebSockets();
    
    app.Map("/ws", async context =>
    {
        var wsManager = context.RequestServices.GetRequiredService<backend.Helpers.WebSocketManager>();
        await wsManager.HandleWebSocketAsync(context);
    });
    
    if (app.Environment.IsDevelopment())
    {
        app.UseHttpLogging();
    }
}