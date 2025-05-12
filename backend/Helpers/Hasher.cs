using backend.Models.Entities;
using Microsoft.AspNetCore.Identity;

namespace backend.Helpers;

public class Hasher
{
    private PasswordHasher<User> _passwordHasher;

    public Hasher()
    {
        _passwordHasher = new PasswordHasher<User>();
    }

    public string HashPassword(string password)
    {
        string hashedPassword = _passwordHasher.HashPassword(null, password);
        return hashedPassword;
    }

    public bool Verify(string password, string hashedPassword)
    {
        var result = _passwordHasher.VerifyHashedPassword(null, hashedPassword, password);
        return result == PasswordVerificationResult.Success;
    }
}