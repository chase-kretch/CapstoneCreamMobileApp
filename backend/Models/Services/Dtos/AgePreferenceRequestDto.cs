namespace backend.Models.Services.Dtos;

public class AgePreferenceRequestDto
{
    public int minAge { get; set; }
    public int maxAge { get; set; }
    
    public (bool isValid, string errorMessage) IsValid()
    {
        if (minAge < ValidationConfig.MinimumAgePreference)
        {
            return (false, "Minimum age must be at least 18.");
        }

        if (maxAge > ValidationConfig.MaximumAgePreference)
        {
            return (false, "Maximum age must be at most 130.");
        }
        
        if (minAge > maxAge)
        {
            return (false, "Minimum age must be less than or equal to maximum age.");
        }

        return (true, "");
    }
}