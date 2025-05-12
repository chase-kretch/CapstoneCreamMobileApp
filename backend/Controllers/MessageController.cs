using System.Security.Claims;
using backend.Models.Services.Dtos;
using backend.Helpers;
using backend.Models.Entities;
using backend.Models.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[Route("Cream/Messages")]
[ApiController]
public class MessageController : Controller
{
    private readonly IMessageService _messageService;

    public MessageController(IMessageService messageService)
    {
        _messageService = messageService;
    }

    [HttpGet("GetLoggedIn")]
    public ActionResult<int> GGetLoggedIn()
    {
        try
        {
            int userId = GetLoggedInId();
            return Ok(userId);
        }
        catch (Exception ex)
        {
            return Unauthorized(new { message = "User is not authenticated or the ID could not be found.", details = ex.Message });
        }
    }

    private int GetLoggedInId()
    {
        ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
        if (ci == null)
        {
            throw new Exception("No identity found for the current user.");
        }

        Claim c = ci.FindFirst(ClaimTypes.NameIdentifier);
        if (c == null)
        {
            throw new Exception("User claim for NameIdentifier not found.");
        }

        string sid = c.Value;
        if (!int.TryParse(sid, out int id))
        {
            throw new Exception("User ID is not in a valid format.");
        }

        return id;
    }
    
    [HttpGet("History")]
    public ActionResult<IEnumerable<DirectionalMessageDto>> GetChatHistory([FromQuery] int recipientId)
    {
        var response = _messageService.GetChatHistoryBetweenUsers(GetLoggedInId(), recipientId);
        
        return StatusCode(response.StatusCode, response);
    }
}