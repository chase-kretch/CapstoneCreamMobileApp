using System.Security.Claims;
using backend.Models.Services.Dtos;
using backend.Helpers;
using backend.Models.Entities;
using backend.Models.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace backend.Controllers;

[Route("Cream/Me")]
[ApiController]
public class MeController : Controller
{
    private readonly IUserInteractionService _userInteractionService;
    private readonly IUserService _userService;
    private readonly IUserPreferenceService _userPreferenceService;
    private readonly IImageService _imageService;

    public MeController(IUserService userService, IUserInteractionService userInteractionService, IUserPreferenceService userPreferenceService, IImageService imageService)
    {
        _userService = userService;
        _userInteractionService = userInteractionService;
        _userPreferenceService = userPreferenceService;
        _imageService = imageService;
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
    
    // Cream/Me
    [SwaggerOperation(
        Summary = "Get the currently logged in users sensitive information.",
        Description = "Returns more default information than the typical user endpoint."
        )]
    [Authorize(Policy = "UserPolicy")]
    [HttpGet]
    public ActionResult<ServiceResponse<UserSensitiveInfoDto>> GetMe()
    {
        ServiceResponse<UserSensitiveInfoDto> response = _userService.GetUserSensitiveInfo(GetLoggedInId());
        return StatusCode(response.StatusCode, response);
    }
    
    // Cream/Me/Likes
    [SwaggerOperation(
        Summary = "Like another user.",
        Description = "Likes another user. If the user has already liked the other user, it will create a match. If a match is created any likes between the users will be deleted."
        )]
    [Authorize(Policy = "UserPolicy")]
    [HttpPost("Likes")]
    public ActionResult<ServiceResponse<LikeUserResponseDto>> AddLike(LikeUserRequestDto likeUserDto)
    {
        ServiceResponse<LikeUserResponseDto> response = _userInteractionService.LikeUser(GetLoggedInId(), likeUserDto.LikeeId);
        return StatusCode(response.StatusCode, response);
    }

    // Cream/Me/Likes/Given
    [SwaggerOperation(
        Summary = "Get the likes given by the currently logged in user.",
        Description = "Returns a paginated list of likes given by the currently logged in user."
        )]
    [Authorize(Policy = "UserPolicy")]
    [HttpGet("Likes/Given")]
    public ActionResult<ServiceResponse<PaginatedList<LikeDto>>> GetGivenLikes([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        ServiceResponse<PaginatedList<LikeDto>> response = _userService.GetLikesGivenByUserPaginated(GetLoggedInId(), pageNumber, pageSize);
        return StatusCode(response.StatusCode, response);
    }
    // Cream/Me/Likes/Received
    [SwaggerOperation(
        Summary = "Get the likes received by the currently logged in user.",
        Description = "Returns a paginated list of likes received by the currently logged in user."
        )]
    [Authorize(Policy = "UserPolicy")]
    [HttpGet("Likes/Received")]
    public ActionResult<ServiceResponse<IEnumerable<Like>>> GetReceivedLikes([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        ServiceResponse<PaginatedList<LikeDto>> response = _userService.GetLikesReceivedByUserPaginated(GetLoggedInId(), pageNumber, pageSize);
        return StatusCode(response.StatusCode, response);
    }
    
    // Cream/Me/Matches
    [SwaggerOperation(
        Summary = "Get the matches of the currently logged in user.",
        Description = "Returns a paginated list of matches of the currently logged in user."
        )]
    [Authorize(Policy = "UserPolicy")]
    [HttpGet("Matches")]
    public ActionResult<ServiceResponse<IEnumerable<DirectionalMatchDto>>> GetMatches([FromQuery] int pageNumber = 1, [FromQuery] int pageSize = 10)
    {
        ServiceResponse<PaginatedList<DirectionalMatchDto>> response = _userService.GetMatchesByUserPaginated(GetLoggedInId(), pageNumber, pageSize);
        return StatusCode(response.StatusCode, response);
    }

    [SwaggerOperation(
        Summary = "Add a hobby to the currently logged in user.",
        Description = "Adds a hobby to the currently logged in user."
        )]
    [Authorize(Policy="UserPolicy")]
    [HttpPost("Hobbies")]
    public ActionResult<ServiceResponse<HobbyDto>> AddHobby(AddHobbyRequestDto hobby)
    {
     ServiceResponse<HobbyDto> response = _userInteractionService.AddHobbyToUser(GetLoggedInId(), hobby.Name);
     return StatusCode(response.StatusCode, response);
    }
     
    [SwaggerOperation(
        Summary = "Delete a hobby from the currently logged in user.",
        Description = "Deletes a hobby from the currently logged in user."
        )]
    [Authorize(Policy="UserPolicy")]
    [Authorize]
    [HttpDelete("Hobbies/{hobbyId}")]
    public ActionResult<ServiceResponse<string>> DeleteHobby(int hobbyId)
    {
     ServiceResponse<string> response = _userInteractionService.DeleteHobbyFromUser(GetLoggedInId(), hobbyId);
     return StatusCode(response.StatusCode, response);
    }
    
    [SwaggerOperation(
        Summary = "Gets users that bidirectionally match preferences with current user.",
        Description = "Returns a paginated list of candidates for the currently logged in user."
        )]
    [Authorize(Policy="UserPolicy")]
    [HttpGet("Candidates")]
    public ActionResult<ServiceResponse<PaginatedList<UserDto>>> GetCandidates([FromQuery] int page = 1, [FromQuery] int count = 10, [FromQuery] int randomizationToken = 0)
    {
        ServiceResponse<PaginatedList<UserDto>> response = _userPreferenceService.GetCandidatesForUserPaginated(GetLoggedInId(), page, count, randomizationToken);
        return StatusCode(response.StatusCode, response);
    }
    
    [SwaggerOperation(
        Summary = "Add gender preference for the currently logged in user.",
        Description = "Allows the user to add a gender preference for potential matches."
    )]
    [Authorize(Policy="UserPolicy")]
    [HttpPost("Preferences/Gender")]
    public ActionResult<IEnumerable<Gender>> AddGenderPreference(Gender gender)
    {
        ServiceResponse<IEnumerable<Gender>> response = _userPreferenceService.AddGenderPreferenceToUser(GetLoggedInId(), gender);
        return StatusCode(response.StatusCode, response);
    }

    [SwaggerOperation(
        Summary = "Delete gender preference from the currently logged in user.",
        Description = "Removes a specified gender preference from the user's preferences."
    )]
    [Authorize(Policy = "UserPolicy")]
    [HttpDelete("Preferences/Gender/{gender}")]
    public ActionResult<ServiceResponse<IEnumerable<Gender>>> DeleteGenderPreference(Gender gender)
    {
        ServiceResponse<IEnumerable<Gender>> response =
            _userPreferenceService.DeleteGenderPreferenceFromUser(GetLoggedInId(), gender);
        return StatusCode(response.StatusCode, response);
    }
    
    [SwaggerOperation(
        Summary = "Set age preference for the currently logged in user.",
        Description = "Sets a range for the age of potential matches based on user preferences."
    )]
    [Authorize]
    [HttpPut("Preferences/Age")]
    public ActionResult<ServiceResponse<string>> SetAgePreference(AgePreferenceRequestDto agePreference)
    {
        ServiceResponse<string> response = _userPreferenceService.SetAgePreferencesForUser(GetLoggedInId(), agePreference);
        return StatusCode(response.StatusCode, response);
    }

    [SwaggerOperation(
        Summary = "Set maximum distance preference for the currently logged in user.",
        Description = "Sets a maximum distance for finding matches based on the user's location."
    )]
    [Authorize]
    [HttpPut("Preferences/Distance")]
    public ActionResult<ServiceResponse<string>> SetMaxDistancePreference(SetMaxDistancePreferenceRequestDto maxKm)
    {
        ServiceResponse<string> response = _userPreferenceService.SetMaxDistancePreference(GetLoggedInId(), maxKm.MaxKm);
        return StatusCode(response.StatusCode, response);
    }

    [SwaggerOperation(
        Summary = "Edit the bio of the currently logged in user.",
        Description = "Updates the bio of the logged-in user."
    )]
    [Authorize]
    [HttpPut("Bio")]
    public ActionResult<ServiceResponse<UserDto>> EditBio(string bio)
    {
        ServiceResponse<UserDto> response = _userInteractionService.EditBio(GetLoggedInId(), bio);
        return StatusCode(response.StatusCode, response);

    }
    
    [SwaggerOperation(
        Summary = "Set the profile picture for the currently logged in user.",
        Description = "Uploads and sets a profile picture for the user. Deletes the previous profile picture if it exists."
    )]
    [Authorize]
    [HttpPost("Photos/ProfilePicture")]
    public ActionResult<ServiceResponse<PhotoDto>> SetProfilePicture(IFormFile file)
    {
        ServiceResponse<PhotoDto> response = _imageService.SetProfilePicture(GetLoggedInId(), file);
        return StatusCode(response.StatusCode, response);
    }
    
    [SwaggerOperation(
        Summary = "Add a gallery photo for the currently logged in user. Will return 400 if the user has maximum number of photos.",
        Description = "Uploads a new picture to the user's gallery."
    )]
    [Authorize]
    [HttpPost("Photos/Gallery")]
    public ActionResult<ServiceResponse<PhotoDto>> AddPhoto(IFormFile file)
    {
        ServiceResponse<PhotoDto> response = _imageService.AddGalleryPicture(GetLoggedInId(), file);
        return StatusCode(response.StatusCode, response);
    }
    
    [SwaggerOperation(
        Summary = "Delete the profile picture of the currently logged in user.",
        Description = "Deletes the profile picture set by the user."
    )]
    [Authorize]
    [HttpDelete("Photos/ProfilePicture")]
    public ActionResult<ServiceResponse<string>> DeleteProfilePicture()
    {
        ServiceResponse<string> response = _imageService.DeleteProfilePicture(GetLoggedInId());
        return StatusCode(response.StatusCode, response);
    }
    
    [SwaggerOperation(
        Summary = "Delete a gallery photo from the currently logged in user.",
        Description = "Removes a specified photo from the user's gallery."
    )]
    [Authorize]
    [HttpDelete("Photos/Gallery/{photoId}")]
    public ActionResult<ServiceResponse<string>> DeleteGalleryPicture(int photoId)
    {
        ServiceResponse<string> response = _imageService.DeleteGalleryPicture(GetLoggedInId(), photoId);
        return StatusCode(response.StatusCode, response);
    }
    
    [SwaggerOperation(
        Summary = "Get hidden users for the currently logged in user.",
        Description = "Returns a paginated list of users that have been hidden by the logged-in user."
    )]
    [Authorize]
    [HttpGet("Hidden")]
    public ActionResult<ServiceResponse<PaginatedList<HideDto>>> GetHiddenUsers(int page = 1, int count = 10)
    {
        ServiceResponse<PaginatedList<HideDto>> response = _userService.GetHidesByUserPaginated(GetLoggedInId(), page, count);
        return StatusCode(response.StatusCode, response);
    }
    
    [SwaggerOperation(
        Summary = "Hide a user for the currently logged in user. Used to unlike and unmatch as well.",
        Description = "Allows the user to hide another user from appearing in searches or suggestions. Works bidirectionally and will remove and existing likes or matches between the users."
    )]
    [Authorize]
    [HttpPost("Hidden")]
    public ActionResult<ServiceResponse<string>> HideUser(UserIdRequestDto userIdRequest)
    {
        ServiceResponse<string> response = _userInteractionService.HideUser(GetLoggedInId(), userIdRequest.UserId);
        return StatusCode(response.StatusCode, response);
    }
    
    [SwaggerOperation(
        Summary = "Unhide a user for the currently logged in user.",
        Description = "Removes a user from the hidden list of the logged-in user."
    )]
    [Authorize]
    [HttpDelete("Hidden/{hiddenUserId}")]
    public ActionResult<ServiceResponse<string>> UnhideUser(int hiddenUserId)
    {
        ServiceResponse<string> response = _userInteractionService.UnhideUser(GetLoggedInId(), hiddenUserId);
        return StatusCode(response.StatusCode, response);
    }
}