import csv
import random
import requests
import time

URL = "http://localhost:8080/api/films/"
MAX_REQUESTS = 100
 
with open('netflix_titles.csv', newline='') as File:  
    reader = csv.reader(File)
    filmsIDs = []
    
    for row in reader:
        filmsIDs.append(row[0]) # cogemos solo el campo show_id del dataset
    
    for i in range(0, MAX_REQUESTS):
        requests.get(url + random.choice(filmsIDs)) # Realizamos la petición al servidor (simulando usuario)
        time.sleep(random.randint(0, 9)) # Dormimos a el sistema para que no se realicen las peticiones al mismo tiempo