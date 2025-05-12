using System.ComponentModel.DataAnnotations;

namespace backend.Models.Entities;

public class Hobby
{
    [Key]
    public int Id { get; set; }
    [Required]
    public virtual ISet<User> Users { get; set; } = new HashSet<User>();
    [Required]
    [MaxLength(30)]
    public required string Name { get; set; }
}