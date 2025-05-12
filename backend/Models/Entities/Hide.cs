using System.ComponentModel.DataAnnotations;

namespace backend.Models.Entities;

public class Hide
{
    [Key]
    public int Id { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.Now;
    public virtual required User Hider { get; set; }
    public virtual required User Hidden { get; set; }
}