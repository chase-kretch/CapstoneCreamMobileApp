using backend.Models.Entities;
using backend.Models.Services.Dtos;

namespace backend.Models.Services;

public interface IImageService
{
    ServiceResponse<PhotoDto> SetProfilePicture(int userId, IFormFile file);
    ServiceResponse<PhotoDto> AddGalleryPicture(int userId, IFormFile file);
    ServiceResponse<string> DeleteProfilePicture(int userId);
    ServiceResponse<string> DeleteGalleryPicture(int userId, int photoId);
    Photo? UploadImage(IFormFile file);
    bool DeleteImage(Photo photo);
}