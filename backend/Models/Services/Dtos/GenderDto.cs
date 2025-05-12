using backend.Models.Entities;

namespace backend.Models.Services.Dtos;

public class GenderDto
{
    public string DisplayName { get; set; }
    public Gender Gender { get; set; }
}