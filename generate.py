import csv
import random
import requests
import time

URL = "http://localhost:8080/api/films/"
MAX_REQUESTS = 100

print("Generate random films...")

filmsIDs = []
visited = []

with open('netflix_titles.csv', newline='') as File:  
    reader = csv.reader(File)
     
    for row in reader:
        filmsIDs.append(row[0]) # cogemos solo el campo show_id del dataset
    
    i = 0

    while i < MAX_REQUESTS:
        if(i < 30): 
            film = random.choice(filmsIDs)
            visited.append(film)
        else: 
            film = random.choice(visited)
            print("repe")
        requests.get(URL + film) # Realizamos la petición al servidor (simulando usuario)
        print(film)
        time.sleep(random.randint(0, 1)) # Dormimos a el sistema para que no se realicen las peticiones al mismo tiempo

        i += 1