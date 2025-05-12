using System.ComponentModel.DataAnnotations;

namespace backend.Models.Entities;

public enum Gender
{
    [Display(Name = "Male")]
    Male,
    [Display(Name = "Female")]
    Female,
    [Display(Name = "Non-binary")]
    NonBinary
}