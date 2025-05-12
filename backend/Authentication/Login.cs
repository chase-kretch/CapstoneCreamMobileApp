using System;
using System.Threading.Tasks;
using backend.Data;
using backend.Helpers;
using backend.Models.Entities;

namespace backend.Authentication;

public sealed class Login(ICreamRepo repo, Hasher hasher, TokenProvider tokenProvider)
{
    
    public sealed record Request(string Email, string Password);

    public async Task<string> Handle(Request request)
    {
        User? user = repo.GetUserByEmail(request.Email.ToLower());

        if (user is null)
        {
            throw new Exception("The user was not found");
        }

        bool verified = hasher.Verify(request.Password, user.HashedPassword);
        if (!verified)
        {
            throw new Exception("The password is incorrect");
        }

        var token = tokenProvider.Create(user);
        return token;

    }
}
