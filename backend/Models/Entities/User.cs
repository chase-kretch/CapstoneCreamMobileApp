using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace backend.Models.Entities;

public class User
{
    [Key]
    public int Id { get; set; }
    [Required, MaxLength(ValidationConfig.FirstName)] public required string FirstName { get; set; }
    [Required, MaxLength(ValidationConfig.LastName)] public required string LastName { get; set; }
    [Required, MaxLength(ValidationConfig.Email)] public required string Email { get; set; }
    [Required, MaxLength(ValidationConfig.PhoneNumber)] public required string PhoneNumber { get; set; }
    [Required, MaxLength(1000)] public required string HashedPassword { get; set; }
    [Required] public required DateTime DateOfBirth { get; set; }
    [Required] public required Location Location { get; set; }
    [Required] public required Gender Gender { get; set; }
    [Required] public double MaxDistanceKilometers { get; set; } = 50;
    [Required] public int MinAge { get; set; } = 18;
    [Required] public int MaxAge { get; set; } = 100;
    [Required] public List<Gender> GenderPreferences { get; set; } = new List<Gender>();
    [MaxLength(ValidationConfig.Bio)] public string? Bio { get; set; }

    public virtual Photo? ProfilePicture { get; set; }
    public virtual ISet<Photo> Photos { get; set; } = new HashSet<Photo>();
    public virtual ISet<Like> LikesGiven { get; set; } = new HashSet<Like>();
    public virtual ISet<Like> LikedReceived { get; set; } = new HashSet<Like>();
    public virtual ISet<Hide> HidesGiven { get; set; } = new HashSet<Hide>();
    public virtual ISet<Hide> HidesReceived { get; set; } = new HashSet<Hide>();
    public virtual ISet<Match> Matches { get; set; } = new HashSet<Match>();
    public virtual IList<Hobby> Hobbies { get; set; } = new List<Hobby>();
    
    [NotMapped]
    public int AgeInYears => (int)(DateTime.Now - DateOfBirth).TotalDays / 365;
    
    private bool IsWithinDistance(User other)
    {
        return Location.CalculateDistanceInKilometers(other.Location) <= MaxDistanceKilometers;
    }

    public bool IsValidCandidate(User potentialMatch, bool bidrectional = true)
    {
        if (!GenderPreferences.Contains(potentialMatch.Gender))
        {
            return false;
        }
        
        if (!IsWithinDistance(potentialMatch))
        {
            return false;
        }
        
        if (potentialMatch.AgeInYears < MinAge || potentialMatch.AgeInYears > MaxAge)
        {
            return false;
        }

        if (HidesGiven.Any(h => h.Hidden.Id == potentialMatch.Id))
        {
            return false;
        }
        
        if (Matches.Any(m => m.Users.Contains(potentialMatch)))
        {
            return false;
        }
        
        if (bidrectional)
        {
            return potentialMatch.IsValidCandidate(this, false);
        }
        
        return true;
    }
}