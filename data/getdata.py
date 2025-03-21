import json
import pprint
import typing
from time import sleep
from bs4 import BeautifulSoup
import random
import pandas as pd 
from tqdm import tqdm
import requests
from geopy.geocoders import Nominatim, GoogleV3
from urllib.parse import quote
from warnings import warn

def download_page(url):
    return requests.get(url).text

def cluster_data(cards):
    cards_data = []
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
            size = float(size) 
            data["street_name"].append(str(card[0].split(">")[2].split("<")[0]))
            data["type"].append(tags[0])
            data["area"].append(tags[1])
            data["city"].append(tags[2])
            data["price"].append(float(price))
            data["size"].append(float(size))
        except: 
            err_cnt += 1 
    return data

def in_sweden(latitude, longitude):
    min_latitude, max_latitude = 55.0, 69.0
    min_longitude, max_longitude = 11.0, 24.0
    return min_latitude <= latitude <= max_latitude and min_longitude <= longitude <= max_longitude 

def get_lat_lng(data:pd.DataFrame):

    data["lat"] = 0.0
    data["lng"] = 0.0
    data["alt"] = 0.0
    data["Full Address"] = ""
    #data['Full Address'] = data[['street_name', 'area', 'city']].apply(lambda x: ', '.join(x), axis=1)
    data['Full Address'] = data['street_name'] + ", " + data['area'] + ", " + data["city"] + ", Sweden"
    API_KEY = "AIzaSyAaIHU2ZTditFtPL-K05lt4XDtiWMrtaKk" 
    for idx, row in data.iterrows():
        address = row["Full Address"]
        url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={API_KEY}"
        response = requests.get(url)
        data = response.json()
        location = data["results"][0]["geometry"]["location"]
        if location and in_sweden(location.latitude, location.longitude):
            data.loc[idx, "lat"] = location.latitude
            data.loc[idx, "lng"] = location.longitude
            data.loc[idx, "alt"] = location.altitude or 0.0
        sleep(0.5)
    return data

def to_heat_map_format(data:pd.DataFrame, path:str):
    dt:typing.List[typing.Dict] = []
    for idx, row in data.iterrows():
        r = {
        "type": "Feature",
        "properties": {
            "id":idx,
            "type": row["type"],
            "price": row["price"],
            "size": row["size"],
        },
        "geometry": {"type": "Point", "coordinates": [row["lat"], row["lng"], row["alt"]]}
        }
        dt.append(r)

    to_file = {
        "type": "FeatureCollection",
        "crs": {
            "type": "name",
            "properties": {
                "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
            }
        },
        "features": dt,
    }
    with open(path, "w") as f: 
        json.dump(to_file, f, indent=4)
    
def translate_home_type(data:pd.DataFrame) -> pd.DataFrame:
    swe_2_eng = {
        "Lägenhet":"Apartment",
        "Villa":"House",
        "Radhus":"TerracedHouse",
        "Kedjehus":"ChainHouse",
        "Gård":"Farm",
        "Fritidshus":"LeisureHouse",
        "Tomt/Mark":"Plot",
        "Parhus":"SemiDetachedHouse",
    }

    data["type"] = data["type"].apply(lambda x: x.replace(" ", ""))
    data["type"] = data["type"].apply(lambda x: swe_2_eng.get(x, x))
    return data 


def find_the_key(data:dict, key:str):
    if not isinstance(data, dict):
        return None
    if key in data.keys():
        return key 
    for k, v in data.items():
        r = find_the_key(v, key)
        if r:
            return f"[{k}][{r}]" 
    return None

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

    #for i in tqdm(range(10)):
    #html = download_page(url + str(i)) 
    html = ""
    with open("booli.html", "r") as f:
        html = f.read()
    soup = BeautifulSoup(html, 'html.parser')
    script_tags = soup.find_all('script', type='application/json')
    data = {}
    for script_tag in script_tags:
        try:
            data[len(data)] = json.loads(script_tag.string)
        except (json.JSONDecodeError, AttributeError):
            continue
    data = dict(data[0])
    data = data["props"]["pageProps"]["__APOLLO_STATE__"]
    print(data)
        #soup = BeautifulSoup(html, 'html.parser')
        #cards = soup.select('[class^=object-card__]')
        #cards = cluster_data(cards)
        #data = set_data(cards, data)
        #df = pd.DataFrame(data)
        #df = translate_home_type(df)
        #df = get_lat_lng(df)
        #df = df.loc[df["lat"] != 0]
        #df.reset_index(inplace=True)
        #df.to_csv("./booli.csv", index=False)
        #to_heat_map_format(df, "./booli.json")
        #sleep(2)
        #sleep(30 + random.randrange(3, 10)) 



if __name__ == "__main__":
    main()
