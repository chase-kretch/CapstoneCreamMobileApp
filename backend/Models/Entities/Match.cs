using System.ComponentModel.DataAnnotations;

namespace backend.Models.Entities;

public class Match
{
    public virtual IReadOnlyList<User> Users { get; }
    
    public Match()
    {
        // Required by EF
    }
    
    public Match(User user1, User user2)
    {
        if (user1 == null || user2 == null)
            throw new ArgumentNullException("Both users must be non-null.");

        if (user1.Equals(user2))
            throw new ArgumentException("The two users must be different.");

        Users = new List<User> { user1, user2 };
        Timestamp = DateTime.UtcNow;
    }

    [Key]
    public int Id { get; set; }

    public DateTime Timestamp { get; private set; }
    
    // The _users field is what is actually stored in the database
    // The purpose of this abstraction is to prevent modification of the set of users, enforcing the 2 user business rule
    // [BackingField(nameof(_users))]
    // public virtual IReadOnlySet<User> Users => _users;
}