namespace backend.Models.Services.Dtos;

public class ExactLocationDto: LocationDto
{
    public double Latitude { get; set; }
    public double Longitude { get; set; }
}