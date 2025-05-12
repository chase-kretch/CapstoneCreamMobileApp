using System.Globalization;
using backend.Data;
using backend.Helpers;
using backend.Models.Entities;
using backend.Models.Services.Dtos;

namespace backend.Models.Services;

public class UserService: IUserService
{
    private readonly ICreamRepo _repo;
    private readonly Hasher _hasher = new Hasher();
    private readonly DtoMapper _dtoMapper;

    public UserService(ICreamRepo repo, DtoMapper dtoMapper)
    {
        _repo = repo;
        _dtoMapper = dtoMapper;
    }
    
    public ServiceResponse<UserDto> GetUser(int id)
    {
        User? user = _repo.GetUserById(id);
        
        if (user == null)
        {
            return ServiceResponse<UserDto>.NotFound($"User with id {id} not found.");
        }

        return ServiceResponse<UserDto>.Ok(_dtoMapper.UserToUserDto(user));
    }
    
    public ServiceResponse<UserSensitiveInfoDto> GetUserSensitiveInfo(int id)
    {
        User? user = _repo.GetUserById(id);
        
        if (user == null)
        {
            return ServiceResponse<UserSensitiveInfoDto>.NotFound($"User with id {id} not found.");
        }

        return ServiceResponse<UserSensitiveInfoDto>.Ok(_dtoMapper.UserToUserSensitiveInfoDto(user));
    }
    
    public ServiceResponse<UserSensitiveInfoDto> RegisterUser(RegisterUserRequestDto registerUserRequest)
    {
        (bool isValid, string errorMessage) = registerUserRequest.IsValid();
        
        if (!isValid)
        {
            return ServiceResponse<UserSensitiveInfoDto>.BadRequest(errorMessage);
        }
        
        if (_repo.GetUserByEmail(registerUserRequest.Email) != null)
        {
            return ServiceResponse<UserSensitiveInfoDto>.Conflict("User with this email already exists.");
        }
        
        User newUser = new User
        {
            FirstName = registerUserRequest.FirstName,
            LastName = registerUserRequest.LastName,
            PhoneNumber = registerUserRequest.PhoneNumber,
            HashedPassword = _hasher.HashPassword(registerUserRequest.Password),
            Email = registerUserRequest.Email.ToLower(),
            //Bio = registerUserRequest.Bio,
            DateOfBirth = DateTime.ParseExact(registerUserRequest.DateOfBirth, "dd/MM/yyyy", CultureInfo.InvariantCulture),
            Location = registerUserRequest.Location,
            Gender = registerUserRequest.Gender,
        };
        
        _repo.AddUser(newUser);

        return ServiceResponse<UserSensitiveInfoDto>.Created(_dtoMapper.UserToUserSensitiveInfoDto(newUser));
    }
    
    public ServiceResponse<IEnumerable<UserDto>> GetUsers()
    {
        IEnumerable<User> users = _repo.GetAllUsers();
        List<UserDto> userDtos = users.Select(_dtoMapper.UserToUserDto).ToList();
        return ServiceResponse<IEnumerable<UserDto>>.Ok(userDtos);
    }
    
    public ServiceResponse<PaginatedList<UserDto>> GetUsersPaginated(int pageNumber, int pageSize)
    {
        if (pageNumber < 1 || pageSize < 1)
        {
            return ServiceResponse<PaginatedList<UserDto>>.BadRequest("Page number and page size must be greater than 0.");
        }
        
        PaginatedList<User> users = _repo.GetUsersPaginated(pageNumber, pageSize);
        
        if (users.IsOutOfBounds())
        {
            return ServiceResponse<PaginatedList<UserDto>>.NotFound($"Page {users.PageIndex} not found. Biggest page number is {users.TotalPages}");
        }
        
        // Convert the PaginatedList<User> to PaginatedList<UserDto>
        PaginatedList<UserDto> userDtos = users.Convert(_dtoMapper.UserToUserDto);
        return ServiceResponse<PaginatedList<UserDto>>.Ok(users.Convert(_dtoMapper.UserToUserDto));
    }
    
    public ServiceResponse<PaginatedList<LikeDto>> GetLikesGivenByUserPaginated(int userId, int pageNumber, int pageSize)
    {
        User user = _repo.GetUserById(userId);
        
        if (user == null)
        {
            return ServiceResponse<PaginatedList<LikeDto>>.NotFound($"User with id {userId} not found.");
        }
        
        PaginatedList<Like> likes = PaginatedList<Like>.Of(user.LikesGiven, pageNumber, pageSize);
        
        if (likes.IsOutOfBounds())
        {
            return ServiceResponse<PaginatedList<LikeDto>>.NotFound("Page number out of range.");
        }

        return ServiceResponse<PaginatedList<LikeDto>>.Ok(likes.Convert(_dtoMapper.LikeToLikeDto));
    }
    
    public ServiceResponse<PaginatedList<LikeDto>> GetLikesReceivedByUserPaginated(int userId, int pageNumber, int pageSize)
    {
        User user = _repo.GetUserById(userId);
        
        if (user == null)
        {
            return ServiceResponse<PaginatedList<LikeDto>>.NotFound($"User with id {userId} not found.");
        }
        
        PaginatedList<Like> likes = PaginatedList<Like>.Of(user.LikedReceived, pageNumber, pageSize);
        
        if (likes.IsOutOfBounds())
        {
            return ServiceResponse<PaginatedList<LikeDto>>.NotFound("Page number out of range.");
        }
        
        return ServiceResponse<PaginatedList<LikeDto>>.Ok(likes.Convert(_dtoMapper.LikeToLikeDto));
    }
    
    public ServiceResponse<PaginatedList<DirectionalMatchDto>> GetMatchesByUserPaginated(int userId, int pageNumber, int pageSize)
    {
        User? user = _repo.GetUserById(userId);
        
        if (user == null)
        {
            return ServiceResponse<PaginatedList<DirectionalMatchDto>>.NotFound($"User with id {userId} not found.");
        }
        
        PaginatedList<Match> matches = _repo.GetMatchesByUserPaginated(userId, pageNumber, pageSize);
        
        if (matches.IsOutOfBounds())
        {
            return ServiceResponse<PaginatedList<DirectionalMatchDto>>.NotFound("Page number out of range.");
        }
        
        return ServiceResponse<PaginatedList<DirectionalMatchDto>>.Ok(matches.Convert(m => _dtoMapper.MatchToDirectionalMatchDto(userId, m)));
    }
    
    public ServiceResponse<PaginatedList<HideDto>> GetHidesByUserPaginated(int userId, int pageNumber, int pageSize)
    {
        var user = _repo.GetUserById(userId);
        
        if (user == null)
        {
            return ServiceResponse<PaginatedList<HideDto>>.NotFound($"User with id {userId} not found.");
        }
        
        PaginatedList<Hide> hides = PaginatedList<Hide>.Of(user.HidesGiven.OrderByDescending(h => h.Timestamp), pageNumber, pageSize);
        
        if (hides.IsOutOfBounds())
        {
            return ServiceResponse<PaginatedList<HideDto>>.NotFound("Page number out of range.");
        }
        
        return ServiceResponse<PaginatedList<HideDto>>.Ok(hides.Convert(_dtoMapper.HideToHideDto));
    }

    public ServiceResponse<UserRelationshipDto> GetUserWithRelationshipStatus(int currentUserId, int otherUserId)
    {
        User? currentUser = _repo.GetUserById(currentUserId);
        User? otherUser = _repo.GetUserById(otherUserId);

        if (currentUser == null)
        {
            return ServiceResponse<UserRelationshipDto>.NotFound($"User with id {currentUserId} not found.");
        }

        RelationshipStatusDto relationshipStatus;

        if (otherUser == null)
        {
            return ServiceResponse<UserRelationshipDto>.NotFound($"User with id {otherUserId} not found.");
        }

        if (_repo.GetMatchBetweenUsers(currentUserId, otherUserId) != null)
        {
            relationshipStatus = RelationshipStatusDto.Matched;
        }
        else if (_repo.GetLikeBetweenUsersDirectional(currentUserId, otherUserId) != null)
        {
            relationshipStatus = RelationshipStatusDto.CurrentUserHasLiked;
        }
        else if (_repo.GetLikeBetweenUsersDirectional(otherUserId, currentUserId) != null)
        {
            relationshipStatus = RelationshipStatusDto.OtherUserHasLiked;
        }
        else if (_repo.GetHideBetweenUsersDirectional(currentUserId, otherUserId) != null)
        {
            relationshipStatus = RelationshipStatusDto.CurrentUserHasHidden;
        }
        else
        {
            relationshipStatus = RelationshipStatusDto.Unrelated;
        }

        var userRelationshipDto = _dtoMapper.UserAndRelationshipToUserRelationshipDto(otherUser, relationshipStatus);
        return ServiceResponse<UserRelationshipDto>.Ok(userRelationshipDto);
    }
}