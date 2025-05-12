using System.ComponentModel.DataAnnotations;

namespace backend.Models.Services.Dtos;

public class UserIdRequestDto
{
    [Required] public int UserId { get; set; }
}