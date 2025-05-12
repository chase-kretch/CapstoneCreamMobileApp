using System.ComponentModel.DataAnnotations;

namespace backend.Models.Services.Dtos;

public class LikeUserRequestDto
{
    [Required] public int LikeeId { get; set; }
}