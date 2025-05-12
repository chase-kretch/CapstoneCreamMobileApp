import random
from randomuser import RandomUser
import aiohttp
import asyncio
import time

API_URL = 'http://localhost:8080/Cream/'
GENDERS = ["Male", "Female", "NonBinary"]


async def create_user(user):
    session = aiohttp.ClientSession()
    dob = user.get_dob()

    year = dob[:4]
    month = dob[5:7]
    day = dob[8:10]

    user_age = user.get_age()
    age_range = min(2, int(random.gauss(10, 4))) # Mean 10, std 4

    min_age = max(user_age - age_range, 18)
    max_age = min(user_age + age_range, 130)

    max_distance = random.randint(10, 400)
    gender = random.choice(GENDERS)
    firstname = user.get_first_name()
    lastname = user.get_last_name()
    formatted_dob = f'{day}/{month}/{year}'
    email = f'{firstname.lower()}.{lastname.lower()}{year}@gmail.com'
    password = 'password'
    location = {
        'country': 'New Zealand',
        'city': random.choice(["Auckland", "Wellington", "Christchurch"]),
        'latitude': -36.848461,
        'longitude': 174.763336
    }

    bio = f'Hello, my name is {firstname} {lastname}, I live in {location["city"]}. I like people between the ages of {min_age} and {max_age} years old.'

    preferred_genders = random.sample(GENDERS, random.randint(1, 3))

    json_data = {
        'firstName': firstname,
        'lastName': lastname,
        'password': password,
        'phoneNumber': user.get_phone(),
        'email': email,
        'dateOfBirth': formatted_dob,
        'gender': gender,
        'location': location
    }

    await session.post(API_URL + 'Users/Register', json=json_data)

    json_data = {
        'email': email,
        'password': password,
    }

    response = await session.post(API_URL + 'Users/Login', json=json_data)

    token = (await response.json())['token']

    await session.put(
        API_URL + 'Me/Preferences/Age',
        headers={'Authorization': 'Bearer ' + token},
        json={
            'minAge': min_age,
            'maxAge': max_age
        }
    )

    for gender in preferred_genders:
        await session.post(
            API_URL + f'Me/Preferences/Gender?gender={gender}',
            headers={'Authorization': 'Bearer ' + token},
        )

    await session.put(
        API_URL + 'Me/Preferences/Distance',
        headers={'Authorization': 'Bearer ' + token},
        json = {
            'maxKm': max_distance
        }
    )

    await session.put(
        API_URL + f"Me/Bio?bio={bio}",
        headers={'Authorization': 'Bearer ' + token}
    )

    await session.close()


async def main():
    tasks = []
    n = int(input('How many? default 50') or 50)
    chunk_size = 500

    print('0% complete')

    for i in range(0, n, chunk_size):
        chunk = min(chunk_size, n - i)
        users = RandomUser.generate_users(chunk)

        for user in users:
            tasks.append(asyncio.create_task(create_user(user)))

        await asyncio.gather(*tasks)
        print(f'{round((i+chunk_size)/n * 100, 2)}% complete')

    print('100% complete')

if __name__ == '__main__':
    asyncio.run(main())