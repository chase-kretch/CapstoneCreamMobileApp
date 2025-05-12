
using System.Collections.Generic;
using backend.Models.Services.Dtos;
using backend.Helpers;
using backend.Models.Entities;

namespace backend.Data;

public interface ICreamRepo
{
    public User AddUser(User user);
    public User? GetUserById(int id);
    public User? GetUserByEmail(string email);
    public IEnumerable<User> GetAllUsers();
    public Like AddLikeBetweenUsers(Like like);
    public bool LikeExistsBetweenUsers(User liker, User likee);
    public Match AddMatch(Match match);
    public PaginatedList<User> GetUsersPaginated(int pageNumber, int pageSize);
    public IEnumerable<User> GetPotentialCandidatesForUser(int userId, int pageNumber, int pageSize);
    public PaginatedList<Like> GetLikesGivenByUserPaginated(int userId, int pageNumber, int pageSize);
    public PaginatedList<Like> GetLikesReceivedByUserPaginated(int userId, int pageNumber, int pageSize);
    public PaginatedList<Match> GetMatchesByUserPaginated(int userId, int pageNumber, int pageSize);
    public Hobby? GetHobbyByName(string hobby);
    public Hobby? GetHobbyById(int id);
    public Hobby AddHobby(Hobby hobby);
    public void SaveChanges();
    public bool RemovePhoto(int photoId);
    public Hide? GetHideById(int id);
    public Hide? GetHideByHiderAndHidee(int hiderId, int hideeId);
    public Like? GetLikeBetweenUsersDirectional(int likerId, int likeeId);
    public Hide? GetHideBetweenUsersDirectional(int hiderId, int hideeId);
    public Match? GetMatchBetweenUsers(int userId1, int userId2);
    public bool RemoveLike(Like like);
    public bool RemoveMatch(Match match);
    public IList<MessageStore> GetChatHistoryBetweenUsers(int userId, int recipientId);
    public bool RemoveHide(Hide hide);
}