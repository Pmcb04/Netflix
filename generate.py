import csv
import random
from random import randint
import requests
import time

URL = "http://localhost:3000/api/films/"
MAX_REQUESTS = 100

print("Generate random films...")

filmsIDs = []
visited = []

with open('netflix_titles.csv', newline='') as File:  
    reader = csv.reader(File)
     
    for row in reader:
        filmsIDs.append(row[0]) # cogemos solo el campo show_id del dataset
    

    i = 0
    while True:
        if(randint(0, 1) >= 0.2 and visited):
            film = random.choice(visited)
            print("repe request of film ", film)
        else:
            film = random.choice(filmsIDs)
            visited.append(film)
            print("new request of film ", film)
        requests.get(URL + film) # Realizamos la petición al servidor (simulando usuario)
        time.sleep(0.5) # Dormimos a el sistema para que no se realicen las peticiones al mismo tiempo

        i += 1