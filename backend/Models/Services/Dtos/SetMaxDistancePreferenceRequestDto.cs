using System.ComponentModel.DataAnnotations;

namespace backend.Models.Services.Dtos;

public class SetMaxDistancePreferenceRequestDto
{
    [Required] public int MaxKm { get; set; }
}