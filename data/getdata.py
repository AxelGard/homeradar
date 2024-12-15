from typing import List
import sys
from time import sleep
from bs4 import BeautifulSoup
import random
import pandas as pd 
from tqdm import tqdm
import requests

def download_page(url):
    return requests.get(url).text

def cluster_data(cards):
    cards_data = []
    i = -1
    card = []
    for c in cards:
        if '<div class="object-card__header">' in str(c):
            continue
        if "<h3" in str(c):
            cards_data.append(card)
            card = [] 
        card.append(str(c))
    return cards_data

def set_data(cards, data):
    err_cnt = 0
    for card in cards: 
        try:
            tags = card[2].split(">")[1].split("<")[0].split("·")
            assert len(tags) == 3
            price = card[3].split(">")[1].split("<")[0].split("·")[0].replace('\xa0', ' ').replace(" ", "").replace("kr", "")
            if price == "Utropsprissaknas":
                continue

            size = card[4].split(">")[2].split("<")[0].replace('\xa0', '').replace("m²", "").replace("½", ".5").replace("tomt", "").replace(" ", "")
            data["street_name"].append(str(card[0].split(">")[2].split("<")[0]))
            data["type"].append(tags[0])
            data["area"].append(tags[1])
            data["city"].append(tags[2])
            data["price"].append(float(price))
            data["size"].append(float(size))
        except: 
            err_cnt += 1 
    return data

def main():
    url = "https://www.booli.se/sok/slutpriser?page="
    data = {
        "street_name": [],
        "area": [],
        "city": [],
        "price": [],
        "size": [],
        "type": [],
    }

    for i in tqdm(range(100)):
        html = download_page(url + str(i)) 
        soup = BeautifulSoup(html, 'html.parser')
        cards = soup.select('[class^=object-card__]')
        cards = cluster_data(cards)
        data = set_data(cards, data)
        df = pd.DataFrame(data)
        df.to_csv("./booli.csv")

        sleep(30 + random.randrange(3, 10)) 



if __name__ == "__main__":
    main()