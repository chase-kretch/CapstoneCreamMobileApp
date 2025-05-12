using System.ComponentModel.DataAnnotations;

namespace backend.Models.Services.Dtos;

public class AddHobbyRequestDto
{
    [Required] public string Name { get; set; }
}