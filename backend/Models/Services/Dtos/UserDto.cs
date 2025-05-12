using System.ComponentModel.DataAnnotations;
using backend.Models.Entities;

namespace backend.Models.Services.Dtos;

public class UserDto
{
    [Required] public required int Id { get; set; }
    [Required] public required string FirstName { get; set; }
    [Required] public required int Age { get; set; }
    [Required] public required GenderDto Gender { get; set; }
    [Required] public required string Bio { get; set; }
    [Required] public required LocationDto Location { get; set; }
    public PhotoDto? ProfilePicture { get; set; }
    [Required] public required ISet<PhotoDto> Photos { get; set; }
    [Required] public required IEnumerable<HobbyDto> Hobbies { get; set; }
}