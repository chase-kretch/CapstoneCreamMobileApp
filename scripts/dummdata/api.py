import asyncio
import aiohttp
import os
import pathlib
from typing import Dict
from celebs import celeb_users, CelebUser


class CreamAPI:
    def __init__(self):
        self.__session = None
        self.auth: Dict[CelebUser, str] = {}

    @property
    def _session(self):
        if self.__session is None:
            self.__session = aiohttp.ClientSession()
        return self.__session

    async def get_auth(self, user: CelebUser):
        if user not in self.auth:
            await self.login(user)
        return self.auth[user]

    async def register(self, user: CelebUser):
        json_data = {
            'firstName': user.first_name,
            'lastName': user.last_name,
            'password': user.password,
            'phoneNumber': '02102318792',
            'email': user.email,
            'dateOfBirth': user.birthday,
            'gender': user.gender,
            'location': {
                'country': user.country,
                'city': user.city,
                'latitude': user.latitude,
                'longitude': user.longitude
            }
        }

        async with self._session.post('http://localhost:8080/Cream/Users/Register', json=json_data) as response:
            if response.status == 201:
                user.id = (await response.json())['data']['id']
                print(f"Successfully registered {user.first_name} {user.last_name}")
            else:
                raise Exception(f"Failed to register {user.first_name} {user.last_name}")

    async def login(self, user: CelebUser):
        json_data = {
            'email': user.email,
            'password': user.password,
        }

        async with self._session.post('http://localhost:8080/Cream/Users/Login', json=json_data) as response:
            if response.status == 200:
                response_json = await response.json()
                self.auth[user] = response_json['token']
                print(f"Successfully logged in {user.first_name} {user.last_name}")
            else:
                raise Exception(f"Failed to log in {user.first_name} {user.last_name}")

    async def upload_photos(self, user: CelebUser):
        photo_folder = pathlib.Path(f'celeb-pics/{user.first_name} {user.last_name}')
        photos = os.listdir(photo_folder)
        profile_photo_name = photos[0]

        profile_photo = str(pathlib.Path(photo_folder, profile_photo_name))
        gallery_photos = [str(pathlib.Path(photo_folder, photo)) for photo in photos[1:]]

        # Upload profile photo
        data = aiohttp.FormData()
        data.add_field('file',
                       open(profile_photo, 'rb'),
                       filename=profile_photo_name,
                       content_type='image/jpeg')

        async with self._session.post(
            'http://localhost:8080/Cream/Me/Photos/ProfilePicture',
            data=data,
            headers={'Authorization': f'Bearer {await self.get_auth(user)}'}
        ) as response:
            if response.status == 201:
                print(f"Successfully uploaded profile photo for {user.first_name} {user.last_name}")
            else:
                print(await response.text())
                print(response.status)
                raise Exception(f"Failed to upload profile photo for {user.first_name} {user.last_name}")

        # Upload gallery photos
        for photo in gallery_photos:
            data = aiohttp.FormData()
            data.add_field('file',
                           open(photo, 'rb'),
                           filename=os.path.basename(photo),
                           content_type='image/jpeg')

            async with self._session.post(
                'http://localhost:8080/Cream/Me/Photos/Gallery',
                data=data,
                headers={'Authorization': f'Bearer {await self.get_auth(user)}'}
            ) as response:
                if response.status == 201:
                    print(f"Successfully uploaded gallery photo for {user.first_name} {user.last_name}")
                else:
                    print(await response.text())
                    print(response.status)
                    raise Exception(f"Failed to upload gallery photo for {user.first_name} {user.last_name}")

    async def add_hobbies(self, user: CelebUser):
        for hobby in user.hobbies:
            json_data = {'name': hobby}

            async with self._session.post(
                'http://localhost:8080/Cream/Me/Hobbies',
                json=json_data,
                headers={'Authorization': f'Bearer {await self.get_auth(user)}'}
            ) as response:
                if response.status == 201:
                    print(f"Successfully added hobby {hobby} for {user.first_name} {user.last_name}")
                else:
                    print(await response.text())
                    print(response.status)
                    raise Exception(f"Failed to add hobby {hobby} for {user.first_name} {user.last_name}")

    async def add_gender_preferences(self, user: CelebUser):
        for gender in user.gender_preferences:
            async with self._session.post(
                f'http://localhost:8080/Cream/Me/Preferences/Gender?gender={gender}',
                headers={'Authorization': f'Bearer {await self.get_auth(user)}'}
            ) as response:
                if response.status == 201:
                    print(f"Successfully added gender preference {gender} for {user.first_name} {user.last_name}")
                else:
                    print(await response.text())
                    print(response.status)
                    raise Exception(f"Failed to add gender preference {gender} for {user.first_name} {user.last_name}")

    async def set_bio(self, user: CelebUser):
        async with self._session.put(
            f'http://localhost:8080/Cream/Me/Bio?bio={user.bio}',
            headers={'Authorization': f'Bearer {await self.get_auth(user)}'}
        ) as response:
            if response.status == 200:
                print(f"Successfully set bio for {user.first_name} {user.last_name}")
            else:
                print(await response.text())
                print(response.status)
                raise Exception(f"Failed to set bio for {user.first_name} {user.last_name}")

    async def set_age_preferences(self, user: CelebUser):
        json_data = {
            'minAge': user.min_age,
            'maxAge': user.max_age
        }

        async with self._session.put(
            'http://localhost:8080/Cream/Me/Preferences/Age',
            headers={'Authorization': f'Bearer {await self.get_auth(user)}'},
            json=json_data
        ) as response:
            if response.status == 200:
                print(f"Successfully set age preferences for {user.first_name} {user.last_name}")
            else:
                print(await response.text())
                print(response.status)
                raise Exception(f"Failed to set age preferences for {user.first_name} {user.last_name}")

    async def like_user(self, current_user: CelebUser, user: CelebUser):
        json_data = {
            'likeeId': user.id
        }

        async with self._session.post(
            f'http://localhost:8080/Cream/Me/Likes',
            headers={'Authorization': f'Bearer {await self.get_auth(current_user)}'},
            json=json_data
        ) as response:
            if response.status == 200:
                print(f"{current_user.first_name} {current_user.last_name} liked {user.first_name} {user.last_name}")
            elif response.status == 409:
                print(f"{current_user.first_name} {current_user.last_name} already liked {user.first_name} {user.last_name}")
            else:
                print(await response.text())
                print(response.status)
                raise Exception(f"Failed to like {user.first_name} {user.last_name}")

    async def match_users(self, user1: CelebUser, user2: CelebUser):
            await self.like_user(user1, user2)
            await self.like_user(user2, user1)

    async def close(self):
        if self.__session:
            await self.__session.close()