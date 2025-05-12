using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models.Entities;

public class MessageStore
{
    [Key]
    public int MessageId { get; set; } // Primary key

    [Required]
    [ForeignKey("User")]
    public int SenderId { get; set; } // Foreign key to User (sender)

    [Required]
    [ForeignKey("User")]
    public int ReceiverId { get; set; } // Foreign key to User (receiver)

    [Required]
    public DateTime Time { get; set; } // Timestamp of the message

    [Required]
    [MaxLength(1000)] // Adjust length as needed
    public string Body { get; set; } // Message content

    // Navigation properties
    public virtual User Sender { get; set; }
    public virtual User Receiver { get; set; }
}
