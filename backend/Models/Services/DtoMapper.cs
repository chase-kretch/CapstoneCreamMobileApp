using backend.Models.Entities;
using backend.Models.Services.Dtos;

namespace backend.Models.Services.Dtos;

public class DtoMapper
{
    private readonly string _cloudfrontDomain;
    
    public DtoMapper(string cloudfrontDomain)
    {
        _cloudfrontDomain = cloudfrontDomain;
    }
    
    public LikeDto LikeToLikeDto(Like like)
    {
        return new LikeDto
        {
            Id = like.Id,
            Liker = UserToUserDto(like.Liker),
            Likee = UserToUserDto(like.Likee),
            Timestamp = like.Timestamp
        };
    }
    
    public MatchDto MatchToMatchDto(Match match)
    {
        return new MatchDto
        {
            Id = match.Id,
            User1 = UserToUserDto(match.Users[0]),
            User2 = UserToUserDto(match.Users[1]),
            Timestamp = match.Timestamp
        };
    }
    
    public DirectionalMatchDto MatchToDirectionalMatchDto(int currentUserId, Match match)
    {
        User otherUser = match.Users[0].Id == currentUserId ? match.Users[1] : match.Users[0];
        
        return new DirectionalMatchDto
        {
            Id = match.Id,
            MatchedUser = UserToUserDto(otherUser),
            Timestamp = match.Timestamp
        };
    }

    public LocationDto LocationToLocationDto(Location location)
    {
        return new LocationDto
        {
            Country = location.Country,
            City = location.City
        };
    }
    
    public UserDto UserToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            Gender = GenderToGenderDto(user.Gender),
            Bio = user.Bio,
            Age = user.AgeInYears,
            Location = LocationToLocationDto(user.Location),
            ProfilePicture = user.ProfilePicture != null ? PhotoToPhotoDto(user.ProfilePicture) : null,
            Photos = user.Photos.Select(PhotoToPhotoDto).ToHashSet(),
            Hobbies = user.Hobbies.Select(HobbyToHobbyDto)
        };
    }
    
    public ExactLocationDto LocationToExactLocationDto(Location location)
    {
        return new ExactLocationDto
        {
            Country = location.Country,
            City = location.City,
            Latitude = location.Latitude,
            Longitude = location.Longitude
        };
    }

    public UserSensitiveInfoDto UserToUserSensitiveInfoDto(User user)
    {
        return new UserSensitiveInfoDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Gender = GenderToGenderDto(user.Gender),
            Bio = user.Bio,
            Age = user.AgeInYears,
            GenderPreferences = user.GenderPreferences.Select(g => GenderToGenderDto(g)),
            Location = LocationToLocationDto(user.Location),
            ProfilePicture = user.ProfilePicture != null ? PhotoToPhotoDto(user.ProfilePicture) : null,
            Photos = user.Photos.Select(PhotoToPhotoDto).ToHashSet(),
            Hobbies = user.Hobbies.Select(HobbyToHobbyDto),
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            DateOfBirth = user.DateOfBirth,
            ExactLocation = LocationToExactLocationDto(user.Location),
            MaxDistanceKilometers = user.MaxDistanceKilometers,
            MinAge = user.MinAge,
            MaxAge = user.MaxAge
        };
    }
    
    public HobbyDto HobbyToHobbyDto(Hobby hobby)
    {
        return new HobbyDto
        {
            Id = hobby.Id,
            Name = hobby.Name
        };
    }
    
    public PhotoDto PhotoToPhotoDto(Photo photo)
    {
        return new PhotoDto
        {
            Id = photo.Id,
            Url = $"https://{_cloudfrontDomain}/{photo.Key}",
            Timestamp = photo.Timestamp
        };
    }

    public GenderDto GenderToGenderDto(Gender gender)
    {
        string displayName = "";
        
        switch (gender)
        {
            case Gender.Male:
                displayName = "Male";
                break;
            case Gender.Female:
                displayName = "Female";
                break;
            case Gender.NonBinary:
                displayName = "Non-binary";
                break;
        };

        return new GenderDto
        {
            Gender = gender,
            DisplayName = displayName
        };
    }
    
    public HideDto HideToHideDto(Hide hide)
    {
        return new HideDto
        {
            Id = hide.Id,
            Hider = UserToUserDto(hide.Hider),
            Hidden = UserToUserDto(hide.Hidden),
            Timestamp = hide.Timestamp
        };
    }
    
    public UserRelationshipDto UserAndRelationshipToUserRelationshipDto(User user, RelationshipStatusDto status)
    {
        return new UserRelationshipDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            Gender = GenderToGenderDto(user.Gender),
            Bio = user.Bio,
            Age = user.AgeInYears,
            Location = LocationToLocationDto(user.Location),
            ProfilePicture = user.ProfilePicture != null ? PhotoToPhotoDto(user.ProfilePicture) : null,
            Photos = user.Photos.Select(PhotoToPhotoDto).ToHashSet(),
            Hobbies = user.Hobbies.Select(HobbyToHobbyDto),
            RelationshipStatus = status
        };
    }
    
    public MessageDto MessageToMessageDto(MessageStore message)
    {
        return new MessageDto
        {
            ReceiverId = message.ReceiverId,
            SenderId = message.SenderId,
            Time = message.Time,
            Body = message.Body
        };
    }
    
    public DirectionalMessageDto MessageToDirectionalMessageDto(MessageStore message, int userId)
    {
        return new DirectionalMessageDto
        {
            ReceiverId = message.ReceiverId,
            SenderId = message.SenderId,
            Time = message.Time,
            Body = message.Body,
            IsFromCurrentUser = message.SenderId == userId
        };
    }
}