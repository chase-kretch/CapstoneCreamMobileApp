from dataclasses import dataclass
from typing import List


@dataclass(eq=True)
class CelebUser:
    first_name: str
    last_name: str
    birthday: str # Format: DD/MM/YYYY
    hobbies: List[str]
    gender: str
    gender_preferences: List[str]
    bio: str
    id: int = None
    max_distance: int = 50
    country: str = "New Zealand"
    city: str = "Auckland"
    latitude: float = -36.8485
    longitude: float = 174.7633
    password: str = 'password'
    min_age: int = 18
    max_age: int = 100

    @property
    def email(self):
        return f'{self.first_name.lower()}.{self.last_name.lower()}@gmail.com'

    def __hash__(self):
        return hash(self.first_name + self.last_name)


# <editor-fold desc="Celebs">
ice_spice = CelebUser(
    first_name='Ice',
    last_name='Spice',
    birthday='01/01/2000',
    hobbies=['Rapping', 'Song-writing', 'Volleyball'],
    gender="Female",
    gender_preferences=["Female", "Male"],
    bio="Munch munch, it's Ice Spice 🧊🌶️ Like my flow? Let's vibe!"
)

jack_black = CelebUser(
    first_name='Jack',
    last_name='Black',
    birthday='28/08/1969',
    hobbies=['Acting', 'Singing', 'Guitar'],
    gender="Male",
    gender_preferences=["Female"],
    bio="Rock star, movie star, and master of the Dad bod. Let's jam!"
)

jenna_ortega = CelebUser(
    first_name='Jenna',
    last_name='Ortega',
    birthday='27/09/2002',
    hobbies=['Acting', 'Dancing', 'Singing'],
    gender="Female",
    gender_preferences=["Male", "Female", "NonBinary"],
    bio="Wednesday every day. Dark humor, bright future. Snap snap �snap�snap"
)

kai_cenat = CelebUser(
    first_name='Kai',
    last_name='Cenat',
    birthday='16/12/2001',
    hobbies=['Live-Streaming', 'Gaming'],
    gender="Male",
    gender_preferences=["Female"],
    bio="Twitch king looking for his queen. Game with me? 🎮👑"
)

madison_beer = CelebUser(
    first_name='Madison',
    last_name='Beer',
    birthday='05/03/1999',
    hobbies=['French', 'Movies', 'Singing', "Live-Streaming"],
    gender="Female",
    gender_preferences=["Male", "Female"],
    bio="Singer, dreamer, and hopeless romantic. Let's make beautiful music together 🎵💖"
)

olivia_rodrigo = CelebUser(
    first_name='Olivia',
    last_name='Rodrigo',
    birthday='20/02/2003',
    hobbies=['Singing', 'Song-writing', 'Acting'],
    gender="Female",
    gender_preferences=["Male", "Female"],
    bio="Drivers license? Check. Good taste in music? You decide. Swipe right, it's brutal out here 🚗🎤"
)

sabrina_carpenter = CelebUser(
    first_name='Sabrina',
    last_name='Carpenter',
    birthday='11/05/1999',
    hobbies=['Singing', 'Dancing', 'Acting'],
    gender="Female",
    gender_preferences=["Male", "Female"],
    bio="Singer, dancer, and your potential rom-com lead. Let's write our own love story 📝💃"
)

timothee_chalamet = CelebUser(
    first_name='Timothee',
    last_name='Chalamet',
    birthday='27/12/1995',
    hobbies=['Acting', 'Fashion', 'Basketball'],
    gender="Male",
    gender_preferences=["Female"],
    bio="Actor with a French twist. Let's discuss films over croissants 🎬🥐"
)

tom_holland = CelebUser(
    first_name='Tom',
    last_name='Holland',
    birthday='01/06/1996',
    hobbies=['Acting', 'Gymnastics', 'Dancing'],
    gender="Male",
    gender_preferences=["Female"],
    bio="Your friendly neighborhood dating app user. Can I swing by? 🕷️"
)

zendaya = CelebUser(
    first_name='Zendaya',
    last_name='Coleman',
    birthday='01/09/1996',
    hobbies=['Acting', 'Dancing', 'Fashion'],
    gender="Female",
    gender_preferences=["Male", "Female", "NonBinary"],
    bio="Actress, fashion icon, and your potential euphoria. Shall we?"
)

chris_hemsworth = CelebUser(
    first_name='Chris',
    last_name='Hemsworth',
    birthday='11/08/1983',
    hobbies=['Surfing', 'Fitness', 'Acting'],
    gender="Male",
    gender_preferences=["Female"],
    bio="God of Thunder looking for electrifying connections. Worthy enough to lift my hammer? ⚡🔨"
)

billie_eilish = CelebUser(
    first_name='Billie',
    last_name='Eilish',
    birthday='18/12/2001',
    hobbies=['Singing', 'Song-writing', 'Skateboarding'],
    gender="Female",
    gender_preferences=["Male", "Female", "NonBinary"],
    bio="Bad guy, duh. Ocean eyes, green hair (sometimes). Let's be happier than ever 🖤"
)

ryan_reynolds = CelebUser(
    first_name='Ryan',
    last_name='Reynolds',
    birthday='23/10/1976',
    hobbies=['Acting', 'Fitness', 'Aviation'],
    gender="Male",
    gender_preferences=["Female"],
    bio="Deadpool with a heart of gold. Warning: may use sarcasm as a defense mechanism 🗡️😉"
)

selena_gomez = CelebUser(
    first_name='Selena',
    last_name='Gomez',
    birthday='22/07/1992',
    hobbies=['Singing', 'Acting', 'Cooking'],
    gender="Female",
    gender_preferences=["Male", "Female"],
    bio="Singer, actress, chef in training. Let's cook up something special 🍳🎵"
)

neil_patrick_harris = CelebUser(
    first_name='Neil',
    last_name='Patrick Harris',
    birthday='15/06/1973',
    hobbies=['Acting', 'Magic', 'Broadway'],
    gender="Male",
    gender_preferences=["Male"],
    bio="Legen... wait for it... dary! Magic tricks and dad jokes included 🎩✨"
)

elton_john = CelebUser(
    first_name='Elton',
    last_name='John',
    birthday='25/03/1947',
    hobbies=['Singing', 'Piano', 'Song-writing'],
    gender="Male",
    gender_preferences=["Male"],
    bio="Rocket Man seeking Tiny Dancer. Still standing and ready to rock your world 🎹🚀"
)

lil_nas_x = CelebUser(
    first_name='Montero',
    last_name='Hill',  # Lil Nas X's real last name is Hill
    birthday='09/04/1999',
    hobbies=['Rapping', 'Song-writing', 'Fashion'],
    gender="Male",
    gender_preferences=["Male"],
    bio="Old Town Road led me here. Call me by your name, I'll show you that's what I want 🤠🏳️‍🌈"
)

ricky_martin = CelebUser(
    first_name='Ricky',
    last_name='Martin',
    birthday='24/12/1971',
    hobbies=['Singing', 'Dancing', 'Philanthropy'],
    gender="Male",
    gender_preferences=["Male"],
    bio="Livin' la Vida Loca and loving it. Let's shake our bon-bons together 💃🕺"
)

constance_wu = CelebUser(
    first_name='Constance',
    last_name='Wu',
    birthday='22/03/1982',
    hobbies=['Crazy', 'Rich', 'Acting'],
    gender='Female',
    gender_preferences=['Male'],
    bio="Not so crazy, definitely rich in experience. Let's write our own love story 📚🎬"
)

jason_momoa = CelebUser(
    first_name='Jason',
    last_name='Momoa',
    birthday='01/08/1979',
    hobbies=['Surfing', 'Rock Climbing', 'Martial Arts'],
    gender='Male',
    gender_preferences=['Female'],
    bio="Aquaman on screen, adventure man in real life. Ride the waves with me? 🏄‍♂️🌊"
)

lebron_james = CelebUser(
    first_name='LeBron',
    last_name='James',
    birthday='30/12/1984',
    hobbies=['Basketball', 'Business', 'Charity'],
    gender='Male',
    gender_preferences=['Female'],
    bio="King on and off the court. Looking for my queen to rule together 👑🏀"
)

lionel_messi = CelebUser(
    first_name='Lionel',
    last_name='Messi',
    birthday='24/06/1987',
    hobbies=['Soccer', 'Video Games', 'Philanthropy'],
    gender='Male',
    gender_preferences=['Female'],
    bio="Soccer wizard seeking magical connections. Goal: to win your heart ⚽️✨"
)

tyla_seethal = CelebUser(
    first_name='Tyla',
    last_name='Seethal',
    birthday='30/01/2002',  # Assuming a date, as it's not publicly verified
    hobbies=['Singing', 'Dancing', 'Fashion'],
    gender='Female',
    gender_preferences=['Male'],
    bio="South African songstress ready to make you dance. Water the new wave? 💃🎵"
)

central_cee = CelebUser(
    first_name='Central',
    last_name='Cee',
    birthday='26/06/1998',
    hobbies=['Rapping', 'Songwriting', 'Fashion'],
    gender='Male',
    gender_preferences=['Female'],
    bio="West London rapper, straight out the trap. Let's make some noise together 🎤🔥"
)

celeb_users: List[CelebUser] = [
    ice_spice,
    jack_black,
    jenna_ortega,
    kai_cenat,
    madison_beer,
    olivia_rodrigo,
    sabrina_carpenter,
    timothee_chalamet,
    tom_holland,
    zendaya,
    chris_hemsworth,
    billie_eilish,
    ryan_reynolds,
    selena_gomez,
    neil_patrick_harris,
    elton_john,
    lil_nas_x,
    ricky_martin,
    constance_wu,
    jason_momoa,
    lebron_james,
    lionel_messi,
    tyla_seethal,
    central_cee
]