using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models.Entities;

public class Like
{
    [Key]
    public int Id { get; set; }
    public DateTime Timestamp { get; set; }
    public virtual User Liker { get; set; }
    public virtual User Likee { get; set; }
}