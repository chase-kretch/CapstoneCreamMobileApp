using backend.Helpers;
using backend.Models.Entities;
using backend.Models.Services.Dtos;

namespace backend.Models.Services;

public interface IUserPreferenceService
{
    ServiceResponse<IEnumerable<Gender>> AddGenderPreferenceToUser(int userId, Gender gender);
    ServiceResponse<IEnumerable<Gender>> DeleteGenderPreferenceFromUser(int userId, Gender gender);
    ServiceResponse<string> SetAgePreferencesForUser(int userId, AgePreferenceRequestDto agePreference);
    ServiceResponse<string> SetMaxDistancePreference(int userId, int maxKm);
    ServiceResponse<PaginatedList<UserDto>> GetCandidatesForUserPaginated(int userId, int pageNumber, int pageSize, int randomizationToken=0);
}