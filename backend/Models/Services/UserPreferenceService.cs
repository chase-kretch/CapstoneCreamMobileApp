using backend.Data;
using backend.Helpers;
using backend.Models.Entities;
using backend.Models.Services.Dtos;

namespace backend.Models.Services;

public class UserPreferenceService: IUserPreferenceService
{
    private readonly ICreamRepo _repo;
    private readonly DtoMapper _dtoMapper;

    public UserPreferenceService(ICreamRepo repo, DtoMapper dtoMapper)
    {
        _repo = repo;
        _dtoMapper = dtoMapper;
    }
    
    public ServiceResponse<IEnumerable<Gender>> AddGenderPreferenceToUser(int userId, Gender gender)
    {
        User? user = _repo.GetUserById(userId);
        
        if (user == null)
        {
            return ServiceResponse<IEnumerable<Gender>>.NotFound($"User with id {userId} not found.");
        }
        
        if (user.GenderPreferences.Contains(gender))
        {
            return ServiceResponse<IEnumerable<Gender>>.Conflict($"User already has preference for gender {gender}.");
        }

        user.GenderPreferences.Add(gender);
        _repo.SaveChanges();

        return ServiceResponse<IEnumerable<Gender>>.Created(user.GenderPreferences);
    }

    public ServiceResponse<IEnumerable<Gender>> DeleteGenderPreferenceFromUser(int userId, Gender gender)
    {
        User? user = _repo.GetUserById(userId);

        if (user == null)
        {
            return ServiceResponse<IEnumerable<Gender>>.NotFound($"User with id {userId} not found.");
        }

        if (!user.GenderPreferences.Contains(gender))
        {
            return ServiceResponse<IEnumerable<Gender>>.BadRequest(
                $"User does not have preference for gender {gender}.");
        }

        user.GenderPreferences.Remove(gender);
        _repo.SaveChanges();

        return ServiceResponse<IEnumerable<Gender>>.Ok(user.GenderPreferences);
    }
    
    public ServiceResponse<string> SetAgePreferencesForUser(int userId, AgePreferenceRequestDto agePreference)
    {
        User? user = _repo.GetUserById(userId);
        
        if (user == null)
        {
            return ServiceResponse<string>.NotFound($"User with id {userId} not found.");
        }
        
        (var isValid, var message) = agePreference.IsValid();
        
        if (!isValid)
        {
            return ServiceResponse<string>.BadRequest(message);
        }
        
        user.MinAge = agePreference.minAge;
        user.MaxAge = agePreference.maxAge;
        
        _repo.SaveChanges();
        
        return ServiceResponse<string>.Ok("Age preferences updated successfully.");
    }
    
    public ServiceResponse<string> SetMaxDistancePreference(int userId, int maxKm)
    {
        User? user = _repo.GetUserById(userId);
        
        if (user == null)
        {
            return ServiceResponse<string>.NotFound($"User with id {userId} not found.");
        }
        
        if (maxKm < ValidationConfig.MinimumAgePreference)
        {
            return ServiceResponse<string>.BadRequest($"Maximum distance must be at least {ValidationConfig.MinDistancePreference}.");
        }
        
        if (maxKm > ValidationConfig.MaximumAgePreference)
        {
            return ServiceResponse<string>.BadRequest($"Maximum distance must be at most {ValidationConfig.MaxDistancePreference}.");
        }
        
        user.MaxDistanceKilometers = maxKm;
        
        _repo.SaveChanges();
        
        return ServiceResponse<string>.Ok("Maximum distance preference updated successfully.");
    }
    
    public ServiceResponse<PaginatedList<UserDto>> GetCandidatesForUserPaginated(int userId, int pageNumber, int pageSize, int randomizationToken=0)
    {
        User? user = _repo.GetUserById(userId);
        
        if (user == null)
        {
            return ServiceResponse<PaginatedList<UserDto>>.NotFound($"User with id {userId} not found.");
        }
        
        // Get a trimmed list of users, only including those that meet basic conditions
        // Age range, correct gender
        // The point of this is to reduce the number of users that need to be filtered in memory
        // This is a performance optimization
        // In the future IsValidCandidate could be converted to be able to be run natively in SQL
        // if performance becomes an issue
        var potentialCandidates = _repo.GetPotentialCandidatesForUser(userId, pageNumber, pageSize);
        // Apply more advanced filtering to the list of potential candidates
        var candidates = potentialCandidates
            .Where(u => user.IsValidCandidate(u))
            .OrderBy(u => (u.Id.ToString() + randomizationToken.ToString()).GetHashCode()) // Stable randomization
            .ToList();
        var paginatedCandidates = PaginatedList<User>.Of(candidates, pageNumber, pageSize);
        var userDtos = paginatedCandidates.Convert(_dtoMapper.UserToUserDto);
        
        if (paginatedCandidates.IsOutOfBounds())
        {
            return ServiceResponse<PaginatedList<UserDto>>.NotFound("Page number out of range.");
        }
        
        return ServiceResponse<PaginatedList<UserDto>>.Ok(userDtos);
    }
}