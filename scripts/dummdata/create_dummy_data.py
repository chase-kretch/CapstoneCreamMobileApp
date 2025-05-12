from typing import List
import aiohttp
import asyncio
import celebs
from api import CreamAPI

cream_api = CreamAPI()


async def create_celeb(celeb: celebs.CelebUser):
    try:
        await cream_api.register(celeb)
        await cream_api.login(celeb)

        await asyncio.gather(
            cream_api.upload_photos(celeb),
            cream_api.add_hobbies(celeb),
            cream_api.add_gender_preferences(celeb),
            cream_api.set_bio(celeb),
            cream_api.set_age_preferences(celeb)
        )
        print(f"Successfully created {celeb.first_name} {celeb.last_name}")
    except Exception as e:
        print(f"Error processing {celeb.first_name} {celeb.last_name}: {e}")

async def create_all_celebs():
    tasks = [create_celeb(celeb) for celeb in celebs.celeb_users]
    await asyncio.gather(*tasks)


async def create_user_with_matches():
    match_user = celebs.CelebUser(
        first_name='match',
        last_name='test',
        birthday='01/01/2000',
        hobbies=['Matching'],
        gender='Male',
        gender_preferences=['Male', 'Female', 'NonBinary'],
        bio='I like to match with people',
    )

    await cream_api.register(match_user)

    for user in celebs.celeb_users:
        await cream_api.match_users(user, match_user)


async def main():
    await create_all_celebs()
    await cream_api.match_users(celebs.tom_holland, celebs.zendaya)
    await create_user_with_matches()
    await cream_api.close()


if __name__ == "__main__":
    asyncio.run(main())
