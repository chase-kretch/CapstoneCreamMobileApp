using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Authentication;
using backend.Data;
using backend.Models.Services.Dtos;
using backend.Helpers;
using backend.Models.Entities;
using backend.Models.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;


[Route("Cream/Users")]
[ApiController]
public class UserController : Controller
{
    private readonly IUserService _userService;
    private readonly Login _login;
    
    public UserController(IUserService userService, Login login)
    {
        _userService = userService;
        _login = login;
    }
    
    // Helper for rest of functions to get Logged in user
    [NonAction]
    public int GetLoggedInId()
    {
        ClaimsIdentity ci = HttpContext.User.Identities.FirstOrDefault();
        Claim c = ci.FindFirst(ClaimTypes.NameIdentifier);
        string sid = c.Value;
        int id = int.Parse(sid);
        return id;
    }

    // Cream/Users/x
    [Authorize(Policy="UserPolicy")]
    [HttpGet("{id}")]
    public ActionResult<ServiceResponse<UserRelationshipDto>> GetUserById(int id)
    {
        ServiceResponse<UserRelationshipDto> response = _userService.GetUserWithRelationshipStatus(GetLoggedInId(), id);
        return StatusCode(response.StatusCode, response);
    }

    // Cream/Users/Register
    [HttpPost("Register")]
    public ActionResult<ServiceResponse<UserSensitiveInfoDto>> RegisterUser(RegisterUserRequestDto registerUserRequest)
    {
        ServiceResponse<UserSensitiveInfoDto> response = _userService.RegisterUser(registerUserRequest);
        return StatusCode(response.StatusCode, response);
    }

    // Cream/Users/Login
    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] Login.Request request)
    {
        try
        {
            string token = await _login.Handle(request);
            
            
            // COOKIES IS A PAIN IN THE ASS ON MOBILE APPS
            
            /*var cookieOptions = new CookieOptions
            {
                // This is used to prevent XSS but will not work with js... 
                //HttpOnly = true,
                // Enable this when we switch to https
                //Secure = true,
                
                //This may cause errors, idk, Could change to lax. Is on strict to prevent CSRF
                SameSite = SameSiteMode.Lax,
                Expires = DateTime.UtcNow.AddMinutes(30)
            };*/
            
            //Response.Cookies.Append("JWTToken",token, cookieOptions);
            return Ok(new {token = token});
            // if for whatever reason u dont want cookies
            //return Content(token, contentType: "text/plaintext");
        }
        catch (Exception ex)
        {
            return Unauthorized(new { Message = ex.Message });
        }
    }

    // Cream/Users
    [Authorize(Policy="UserPolicy")]
    [HttpGet]
    public ActionResult<ServiceResponse<PaginatedList<UserDto>>> GetUsers([FromQuery] int page = 1, [FromQuery] int count = 10)
    {
        ServiceResponse<PaginatedList<UserDto>> response = _userService.GetUsersPaginated(page, count);
        return StatusCode(response.StatusCode, response);
    }
}