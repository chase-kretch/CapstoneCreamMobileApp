using System.Collections;
using System.Collections.Generic;
using System.Linq;
using backend.Models.Services.Dtos;
using backend.Helpers;
using backend.Models.Entities;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using Microsoft.EntityFrameworkCore.Query;

namespace backend.Data;

public class CreamRepo : ICreamRepo
{
    private readonly CreamDbContext _dbContext;

    public CreamRepo(CreamDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    public User AddUser(User user)
    {
        EntityEntry<User> e = _dbContext.Users.Add(user);
        User u = e.Entity;
        _dbContext.SaveChanges();
        return user;
    }

    public User GetUserById(int id)
    {
        User user = _dbContext.Users.FirstOrDefault(u => u.Id == id);
        return user;
    }

    public User GetUserByEmail(string email)
    {
        return _dbContext.Users.FirstOrDefault(u => u.Email == email);
    }

    public IEnumerable<User> GetAllUsers()
    {
        return _dbContext.Users.ToList();
    }
    
    public IQueryable<User> GetAllUsersQueryable()
    {
        return _dbContext.Users;
    }

    public Like AddLikeBetweenUsers(Like like)
    {
        User likee = like.Likee;
        EntityEntry<Like> e = _dbContext.Likes.Add(like);
        Like l = e.Entity;
        _dbContext.SaveChanges();
        return l;
    }

    public bool LikeExistsBetweenUsers(User liker, User likee)
    {
        Like like = _dbContext.Likes.FirstOrDefault(l => l.Likee == likee && l.Liker == liker);
        if (like == null)
        {
            return false;
        }

        return true;
    }

    public Match AddMatch(Match match)
    {
        EntityEntry<Match> e = _dbContext.Matches.Add(match);
        Match m = e.Entity;
        _dbContext.SaveChanges();
        return m;
    }
    
    public PaginatedList<User> GetUsersPaginated(int pageNumber, int pageSize)
    {
        return GetPaginatedList(
            _dbContext.Users,
            pageNumber,
            pageSize
        );
    }
    
    public PaginatedList<Like> GetLikesGivenByUserPaginated(int userId, int pageNumber, int pageSize)
    {
        return GetPaginatedList(
            _dbContext.Likes
                .Where(l => l.Liker.Id == userId)
                .OrderByDescending(l => l.Timestamp),
            pageNumber,
            pageSize
        );
    }
    
    public PaginatedList<Like> GetLikesReceivedByUserPaginated(int userId, int pageNumber, int pageSize)
    {
        return GetPaginatedList(
            _dbContext.Likes
                .Where(l => l.Likee.Id == userId)
                .OrderByDescending(l => l.Timestamp),
            pageNumber,
            pageSize
        );
    }
    
    public PaginatedList<Match> GetMatchesByUserPaginated(int userId, int pageNumber, int pageSize)
    {
       return GetPaginatedList(
           _dbContext.Matches
               .Where(m => m.Users.Any(u => u.Id == userId))
               .OrderByDescending(m => m.Timestamp), 
           pageNumber, 
           pageSize
        );
    }
    
    private PaginatedList<T> GetPaginatedList<T>(IQueryable<T> query, int pageNumber, int pageSize)
    {
        List<T> items = query
            .Skip((pageNumber - 1) * pageSize)
            .Take(pageSize)
            .ToList();
        
        var count = query.Count();
        var totalPages = (int) Math.Ceiling(count / (double) pageSize);
        return new PaginatedList<T>(items, pageNumber, totalPages, count);
    }
    
    public Hobby? GetHobbyByName(string hobby)
    {
        return _dbContext.Hobbies.FirstOrDefault(h => h.Name == hobby);
    }
    
    public Hobby? GetHobbyById(int id)
    {
        return _dbContext.Hobbies.FirstOrDefault(h => h.Id == id);
    }
    
    public Hobby AddHobby(Hobby hobby)
    {
        EntityEntry<Hobby> e = _dbContext.Hobbies.Add(hobby);
        Hobby h = e.Entity;
        _dbContext.SaveChanges();
        return h;
    }

    public IEnumerable<User> GetPotentialCandidatesForUser(int userId, int pageNumber, int pageSize)
    {
        User user = GetUserById(userId);
        if (user == null)
        {
            throw new Exception($"User with id {userId} not found.");
        }

        DateTime today = DateTime.Now;
    
        var candidates = _dbContext.Users
            .Where(u => 
                    u.Id != userId && // Exclude the user itself
                    user.GenderPreferences.Contains(u.Gender) && // Mutual gender preferences
                    u.GenderPreferences.Contains(user.Gender) &&
                    !u.LikedReceived.Any(l => l.Liker == user) &&
                    // user.LikesGiven.Any(l => l.Likee == u) &&
                    (
                        (today.Year - u.DateOfBirth.Year) - 
                        (today.Month < u.DateOfBirth.Month || 
                         (today.Month == u.DateOfBirth.Month && today.Day < u.DateOfBirth.Day) ? 1 : 0) 
                    ) >= user.MinAge && 
                    (
                        (today.Year - u.DateOfBirth.Year) - 
                        (today.Month < u.DateOfBirth.Month || 
                         (today.Month == u.DateOfBirth.Month && today.Day < u.DateOfBirth.Day) ? 1 : 0)
                    ) <= user.MaxAge && // Age compatibility (user's perspective)
                    (
                        (today.Year - user.DateOfBirth.Year) - 
                        (today.Month < user.DateOfBirth.Month || 
                         (today.Month == user.DateOfBirth.Month && today.Day < user.DateOfBirth.Day) ? 1 : 0)
                    ) >= u.MinAge &&
                    (
                        (today.Year - user.DateOfBirth.Year) - 
                        (today.Month < user.DateOfBirth.Month || 
                         (today.Month == user.DateOfBirth.Month && today.Day < user.DateOfBirth.Day) ? 1 : 0)
                    ) <= u.MaxAge // Age compatibility (candidate's perspective)
            )
            .ToList();

        return candidates;
    }
    
    public bool RemovePhoto(int photoId)
    {
        Photo? photo = _dbContext.Photos.FirstOrDefault(p => p.Id == photoId);
        if (photo == null)
        {
            return false;
        }
        
        _dbContext.Photos.Remove(photo);
        _dbContext.SaveChanges();
        return true;
    }
    
    public Hide? GetHideById(int id)
    {
        return _dbContext.Hides.FirstOrDefault(h => h.Id == id);
    }
    
    public Hide? GetHideByHiderAndHidee(int hiderId, int hideeId)
    {
        return _dbContext.Hides.FirstOrDefault(h => h.Hider.Id == hiderId && h.Hidden.Id == hideeId);
    }
    
    public Like? GetLikeBetweenUsersDirectional(int likerId, int likeeId)
    {
        return _dbContext.Likes.FirstOrDefault(l => l.Liker.Id == likerId && l.Likee.Id == likeeId);
    }
    
    public Hide? GetHideBetweenUsersDirectional(int hiderId, int hideeId)
    {
        return _dbContext.Hides.FirstOrDefault(h => h.Hider.Id == hiderId && h.Hidden.Id == hideeId);
    }
    
    public Match? GetMatchBetweenUsers(int userId1, int userId2)
    {
        return _dbContext.Matches.FirstOrDefault(m => m.Users.Any(u => u.Id == userId1) && m.Users.Any(u => u.Id == userId2));
    }
    
    public IList<MessageStore> GetChatHistoryBetweenUsers(int userId, int recipientId)
    {
        return _dbContext.MessageStores
            .Where(m => (m.SenderId == userId && m.ReceiverId == recipientId) ||
                        (m.SenderId == recipientId && m.ReceiverId == userId))
            .OrderBy(m => m.Time)
            .ToList();
    }
    
    public bool RemoveHide(Hide hide)
    {
        _dbContext.Hides.Remove(hide);
        _dbContext.SaveChanges();
        return true;
    }

    public bool RemoveLike(Like like)
    {
        _dbContext.Likes.Remove(like);
        _dbContext.SaveChanges();
        return true;
    }
    
    public bool RemoveMatch(Match match)
    {
        _dbContext.Matches.Remove(match);
        _dbContext.SaveChanges();
        return true;
    }
    
    public void SaveChanges()
    {
        _dbContext.SaveChanges();
    }
}