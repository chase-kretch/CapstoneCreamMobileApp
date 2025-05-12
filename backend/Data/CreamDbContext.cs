using backend.Models.Entities;
using Microsoft.EntityFrameworkCore;

namespace backend.Data;

public abstract class CreamDbContext: DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Like> Likes { get; set; }
    public DbSet<Match> Matches { get; set; }
    public DbSet<Photo> Photos { get; set; }
    public DbSet<Hobby> Hobbies { get; set; }
    public DbSet<Hide> Hides { get; set; }
    public DbSet<MessageStore> MessageStores { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        MapUserAggregates(modelBuilder);
        MapMessageStoreAggregates(modelBuilder);
    }

    private void MapUserAggregates(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Like>()
            .HasOne<User>(l => l.Liker)
            .WithMany(u => u.LikesGiven);
        
        modelBuilder.Entity<Like>()
            .HasOne<User>(l => l.Likee)
            .WithMany(u => u.LikedReceived);
        
        modelBuilder.Entity<Match>()
            .HasMany<User>(m => m.Users)
            .WithMany(u => u.Matches);
        
        modelBuilder.Entity<Hide>()
            .HasOne<User>(l => l.Hider)
            .WithMany(u => u.HidesGiven);
        
        modelBuilder.Entity<Hide>()
            .HasOne<User>(l => l.Hidden)
            .WithMany(u => u.HidesReceived);
        
        // Decided not necessary to have a bi-directional relationship between User and Photo
        // Since sometimes a photo is a profile picture, and sometimes it's just a photo
        
        // modelBuilder.Entity<Photo>()
        //     .HasOne<User>(p => p.User)
        //     .WithMany(u => u.Photos);
        
        modelBuilder.Entity<Hobby>()
            .HasMany<User>(h => h.Users)
            .WithMany(u => u.Hobbies);
    }
    
    private void MapMessageStoreAggregates(ModelBuilder modelBuilder)
    {
        // Define the relationships between MessageStore and User
        modelBuilder.Entity<MessageStore>()
            .HasOne(ms => ms.Sender)
            .WithMany()
            .HasForeignKey(ms => ms.SenderId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent cascading deletes

        modelBuilder.Entity<MessageStore>()
            .HasOne(ms => ms.Receiver)
            .WithMany()
            .HasForeignKey(ms => ms.ReceiverId)
            .OnDelete(DeleteBehavior.Restrict); // Prevent cascading deletes
    }
}