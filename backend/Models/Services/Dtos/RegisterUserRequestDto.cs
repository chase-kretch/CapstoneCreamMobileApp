using System.ComponentModel.DataAnnotations;
using System.Globalization;
using System.Net.Mail;
using backend.Models.Entities;
using Microsoft.AspNetCore.Http.HttpResults;

namespace backend.Models.Services.Dtos;

public class RegisterUserRequestDto
{
    [Required] public required string FirstName { get; set; }
    [Required] public required string LastName { get; set; }
    [Required] public required string Password { get; set; }
    [Required] public required string PhoneNumber { get; set; }
    [Required] public required string Email { get; set; }
    [Required] public required string DateOfBirth { get; set; }
    [Required] public Gender Gender { get; set; }
    [Required] public required Location Location { get; set; }

    public (bool isValid, string errorMessage)IsValid()
    {
        try
        {
            var test = new MailAddress(Email).Address;
        }
        catch (FormatException)
        {
            return (false, $"{Email} is not a valid Email address.");
        }
        
        if (this.FirstName.Length > ValidationConfig.FirstName || this.FirstName.Length < 1) { 
            return (false, $"First name is too long. Max length is {ValidationConfig.FirstName}");
        }
        if (this.LastName.Length > ValidationConfig.LastName || this.LastName.Length < 1) { 
            return (false, $"Last name is too long. Max length is {ValidationConfig.LastName}");
        }
        if (this.Email.Length > ValidationConfig.Email) { 
            return (false, $"Email is too long. Max length is {ValidationConfig.Email}");
        }
        if (this.PhoneNumber.Length > ValidationConfig.PhoneNumber) { 
            return (false, $"Phone number is too long. Max length is {ValidationConfig.PhoneNumber}");
        }
        // Check if user is at least 18 years old
        if (DateTime.ParseExact(this.DateOfBirth, "dd/MM/yyyy", CultureInfo.InvariantCulture).AddYears(18) > DateTime.Now)
        {
            return (false, "User must be at least 18 years old.");
        }
        
        return (true, "");
    }
}