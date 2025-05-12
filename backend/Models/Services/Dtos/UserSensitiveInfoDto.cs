using System.ComponentModel.DataAnnotations;
using backend.Models.Entities;

namespace backend.Models.Services.Dtos;

public class UserSensitiveInfoDto: UserDto
{
    [Required] public required string Email { get; set; }
    [Required] public required string LastName { get; set; }
    [Required] public required string PhoneNumber { get; set; }
    [Required] public required DateTime DateOfBirth { get; set; }
    [Required] public required ExactLocationDto ExactLocation { get; set; }
    [Required] public required double MaxDistanceKilometers { get; set; }
    [Required] public required int MinAge { get; set; }
    [Required] public required int MaxAge { get; set; }
    [Required] public required IEnumerable<GenderDto> GenderPreferences { get; set; }
}