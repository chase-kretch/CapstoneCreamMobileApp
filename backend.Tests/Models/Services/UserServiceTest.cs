using System;
using System.Collections;
using System.Collections.Generic;
using backend.Data;
using backend.Models;
using backend.Models.Entities;
using backend.Models.Services;
using backend.Models.Services.Dtos;
using Microsoft.EntityFrameworkCore;
using NUnit.Framework;
using Moq;

namespace backend.Tests.Models.Services;

[TestFixture]
[TestOf(typeof(UserService))]
public class UserServiceTest
{
    private Mock<ICreamRepo> _mockRepo;
    private UserService _userService;
    private User _testUser;
    private DtoMapper _dtoMapper;

    [SetUp]
    public void SetUp()
    {
        _mockRepo = new Mock<ICreamRepo>();
        _dtoMapper = new DtoMapper("test");

        _userService = new UserService(_mockRepo.Object, _dtoMapper);

        _testUser = new User
        {
            Id = 1,
            FirstName = "Eli",
            LastName = "Chandler",
            Email = "ec@gmail.com",
            PhoneNumber = "02108577113",
            HashedPassword = "ABCDEFGH123456789",
            DateOfBirth = new DateTime(2003, 5, 28),
            Location = new Location
            {
                City = "Auckland",
                Country = "New Zealand",
                Latitude = 0,
                Longitude = 0
            },
            Gender = Gender.Male,
            GenderPreferences = new List<Gender>(),

        };

    }
    

// ************************************ //

    [Test]
    public void Test_GetUser_ReturnsNotFound()
    {
        _mockRepo.Setup(repo => repo.GetUserById(1)).Returns((User)null);
        var result = _userService.GetUser(1);
        
        Assert.That(result.StatusCode, Is.EqualTo(404));
        Assert.That(result.Data, Is.Null);
        
    }
    [Test]
    public void Test_GetUser_ReturnsOk()
    {
        _mockRepo.Setup(repo => repo.GetUserById(1)).Returns(_testUser);
        var result = _userService.GetUser(1);
        
        
        Assert.That(result.StatusCode, Is.EqualTo(200));
        Assert.That(result.Data.FirstName, Is.EqualTo("Eli"));
        Assert.That(result.Data.GetType(), Is.EqualTo(typeof(UserDto)));
    }
    
// ************************************ //
    
    [Test]
    public void Test_GetUserSensitiveInfo_ReturnsNotFound()
    {
        _mockRepo.Setup(repo => repo.GetUserById(1)).Returns((User)null);
        var result = _userService.GetUserSensitiveInfo(1);

        Assert.That(result.StatusCode, Is.EqualTo(404));
    }
    [Test]
    public void Test_GetUserSensitiveInfo_ReturnsOk()
    {
        _mockRepo.Setup(repo => repo.GetUserById(1)).Returns(_testUser);
        var result = _userService.GetUserSensitiveInfo(1);
        
        Assert.That(result.StatusCode, Is.EqualTo(200));
        Assert.That(result.Data.GetType(), Is.EqualTo(typeof(UserSensitiveInfoDto)));
    }
    
// ************************************ //
    
    [Test]
    public void Test_RegisterUser_ReturnsCreated()
    {
        var requestDto = new RegisterUserRequestDto
        {
            FirstName = "Eli",
            LastName = "Chandler",
            Email = "ec@gmail.com",
            Password = "ABCDEFGH123456789",
            PhoneNumber = "02108577113",
            DateOfBirth = "28/05/2003",
            Location = new Location
            {
                City = "Auckland",
                Country = "New Zealand",
                Latitude = 0,
                Longitude = 0
            },
            Gender = Gender.Male,
        };
        var result = _userService.RegisterUser(requestDto);
        
        Assert.That(result.StatusCode, Is.EqualTo(201));
        Assert.That(result.Data.GetType(), Is.EqualTo(typeof(UserSensitiveInfoDto)));
        
        _mockRepo.Verify(repo => repo.AddUser(It.Is<User>(u => u.FirstName == "Eli")), Times.Once());
    }
    [Test]
    public void Test_RegisterUser_ReturnsBadRequest_BadEmail()
    {
        var requestDto = new RegisterUserRequestDto
        {
            FirstName = "Eli",
            LastName = "Chandler",
            Email = "bademail",
            Password = "ABCDEFGH123456789",
            PhoneNumber = "02108577113",
            DateOfBirth = "28/05/2003",
            Location = new Location
            {
                City = "Auckland",
                Country = "New Zealand",
                Latitude = 0,
                Longitude = 0
            },
            Gender = Gender.Male,
        };
        var result = _userService.RegisterUser(requestDto);
        
        Assert.That(result.StatusCode, Is.EqualTo(400));
        
        _mockRepo.Verify(repo => repo.AddUser(It.IsAny<User>()), Times.Never());
    }
    
    [Test]
    public void Test_RegisterUser_ReturnsBadRequest_BadFirstName()
    {
        var requestDto = new RegisterUserRequestDto
        {
            FirstName = new string('E', ValidationConfig.FirstName + 1),
            LastName = "Chandler",
            Email = "ec@gmail.com",
            Password = "ABCDEFGH123456789",
            PhoneNumber = "02108577113",
            DateOfBirth = "28/05/2003",
            Location = new Location
            {
                City = "Auckland",
                Country = "New Zealand",
                Latitude = 0,
                Longitude = 0
            },
            Gender = Gender.Male,
        };
        var result = _userService.RegisterUser(requestDto);
        
        Assert.That(result.StatusCode, Is.EqualTo(400));
        
        _mockRepo.Verify(repo => repo.AddUser(It.IsAny<User>()), Times.Never());
    }
    
    [Test]
    public void Test_RegisterUser_ReturnsBadRequest_BadLastName()
    {
        var requestDto = new RegisterUserRequestDto
        {
            FirstName = "Eli",
            LastName = new string('C', ValidationConfig.LastName + 1),
            Email = "ec@gmail.com",
            Password = "ABCDEFGH123456789",
            PhoneNumber = "02108577113",
            DateOfBirth = "28/05/2003",
            Location = new Location
            {
                City = "Auckland",
                Country = "New Zealand",
                Latitude = 0,
                Longitude = 0
            },
            Gender = Gender.Male,
        };
        var result = _userService.RegisterUser(requestDto);
        
        Assert.That(result.StatusCode, Is.EqualTo(400));
        
        _mockRepo.Verify(repo => repo.AddUser(It.IsAny<User>()), Times.Never());
    }
    
    [Test]
    public void Test_RegisterUser_ReturnsBadRequest_BadPhoneNumber()
    {
        var requestDto = new RegisterUserRequestDto
        {
            FirstName = "Eli",
            LastName = "Chandler",
            Email = "ec@gmail.com",
            Password = "ABCDEFGH123456789",
            PhoneNumber = new string('1', ValidationConfig.PhoneNumber + 1),
            DateOfBirth = "28/05/2003",
            Location = new Location
            {
                City = "Auckland",
                Country = "New Zealand",
                Latitude = 0,
                Longitude = 0
            },
            Gender = Gender.Male,
        };
        var result = _userService.RegisterUser(requestDto);
        
        Assert.That(result.StatusCode, Is.EqualTo(400));
        
        _mockRepo.Verify(repo => repo.AddUser(It.IsAny<User>()), Times.Never());
    }
    
    [Test]
    public void Test_RegisterUser_ReturnsBadRequest_BadDOB()
    {
        var requestDto = new RegisterUserRequestDto
        {
            FirstName = "Eli",
            LastName = "Chandler",
            Email = "ec@gmail.com",
            Password = "ABCDEFGH123456789",
            PhoneNumber = "02108577113",
            DateOfBirth = DateTime.Now.AddYears(-17).ToString("dd/MM/yyyy"),
            Location = new Location
            {
                City = "Auckland",
                Country = "New Zealand",
                Latitude = 0,
                Longitude = 0
            },
            Gender = Gender.Male,
        };
        var result = _userService.RegisterUser(requestDto);
        
        Assert.That(result.StatusCode, Is.EqualTo(400));
        
        _mockRepo.Verify(repo => repo.AddUser(It.IsAny<User>()), Times.Never());
    }
    
// ************************************ //
    
    [Test]
    public void Test_GetUsers_ReturnsOk()
    {
        IEnumerable<User> test = new List<User>();
        _mockRepo.Setup(repo => repo.GetAllUsers()).Returns((IEnumerable<User>)test);
        var result = _userService.GetUsers();
        Assert.That(result.StatusCode, Is.EqualTo(200));
    }
    
// ************************************ //
    
    [Test]
    public void Test_GetUsersPaginated_ReturnsOk()
    {
        throw new NotImplementedException();
    }
    [Test]
    public void Test_GetUsersPaginated_ReturnsBadRequest()
    {
        throw new NotImplementedException();
    }
    
// ************************************ //    
    
    [Test]
    public void Test_GetLikesGivenByUserPaginated_ReturnsOk()
    {
        throw new NotImplementedException();
    }
    [Test]
    public void Test_GetLikesGivenByUserPaginated_ReturnsNotFound_InvalidUserId()
    {
        throw new NotImplementedException();
    }
    [Test]
    public void Test_GetLikesGivenByUserPaginated_ReturnsNotFound_PageNumberOutOfRange()
    {
        throw new NotImplementedException();
    }
    
// ************************************ //

    [Test]
    public void Test_GetLikesReceivedByUserPaginated_ReturnsOk()
    {
        throw new NotImplementedException();
    }
    [Test]
    public void Test_GetLikesReceivedByUserPaginated_ReturnsNotFound_InvalidUserId()
    {
        throw new NotImplementedException();
    }
    [Test]
    public void Test_GetLikesReceivedByUserPaginated_ReturnsNotFound_PageNumberOutOfRange()
    {
        throw new NotImplementedException();
    }

// ************************************ //
    
    [Test]
    public void Test_GetMatchesByUserPaginated_ReturnsNotFound_InvalidUserId()
    {
        throw new NotImplementedException();
    }
    [Test]
    public void Test_GetMatchesByUserPaginated_ReturnsNotFound_PageNumberOutOfRange()
    {
        throw new NotImplementedException();
    }
    [Test]
    public void Test_GetMatchesByUserPagined_ReturnsOk()
    {
        throw new NotImplementedException();
    }
    
// ************************************ //
    
}