using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models.Entities;

public class Photo
{
    [Key]
    public int Id { get; set; }
    public DateTime Timestamp { get; set; } = DateTime.Now;
    // GUID
    [Required]
    [MaxLength(36)]
    public required string Key { get; set; }
}