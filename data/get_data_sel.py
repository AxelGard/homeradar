from selenium import webdriver
from pprint import pprint
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from bs4 import BeautifulSoup
import random
import pandas as pd 
from tqdm import tqdm
import unicodedata
import requests
from time import sleep
import typing
import json
from collections import defaultdict


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
            "date": row["date"],
        },
        "geometry": {"type": "Point", "coordinates": [row["lng"], row["lat"], row["alt"]]}
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

class WebScraper:
    def __init__(self, url:str) -> None:
        self.url = url
        self.driver = webdriver.Chrome()
        self.html = ""
        self.soup = BeautifulSoup(self.html, 'html.parser')

    def set_html(self):
        driver = self.driver
        driver.get(self.url)
        elem = driver.find_element("xpath", "//*")
        self.html = elem.get_attribute("outerHTML")
        return self 

    def set_soup(self):
        self.soup = BeautifulSoup(self.html, 'html.parser')
        return self

    def __del__(self):
        self.driver.close()

def get_lat_lng(address:str):
    API_KEY = "AIzaSyCSGDtR0WqTmCdzgAC4bxrN7hliAXZM14M" 
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={API_KEY}"
    response = requests.get(url)
    data = response.json()
    location = data["results"][0]["geometry"]["location"]
    sleep(0.5)
    return {
        "lat":location["lat"],
        "lng":location["lng"],
        "alt": 0.0
    }

def translate_home_type(data:pd.DataFrame) -> pd.DataFrame:
    data["type"] = data["type"].apply(lambda x: unicodedata.normalize("NFC", x)  )
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

def same_len(dic:dict):
    _len = len(list(dic.values())[0])
    for k, v in dic.items():
        if _len != len(v): return False, k
    return True, None

def main():

    
    for page_num in tqdm(range(0,30)):
        to_df = {
            "street_name": [],
            "area": [],
            "city": [],
            "price": [],
            "size": [],
            "type": [],
            "date": [],
        }
        ws = WebScraper(f"https://www.booli.se/sok/slutpriser?page={page_num}")
        ws.set_html().set_soup()
        for listing_idx, listing in enumerate(ws.soup.find_all(class_="object-card-layout__content")):
            tags = str(listing)
            tags = unicodedata.normalize("NFKD",tags).split(">")
            #pprint(tags)
            for idx, t in enumerate(tags):
                if '<a class="expanded-link no-underline hover:underline" href="' in t:
                    to_df["street_name"].append(tags[idx+1].replace("</a", ""))
                elif t == '<span class="object-card__preamble"':
                    area = tags[idx+1].replace("</span", "").split(" · ")
                    to_df["type"].append(area[0])
                    to_df["area"].append(area[1])
                    if len(area) == 3:
                        to_df["city"].append(area[2])
                    else: 
                        to_df["city"].append("")
                elif t == '<span class="object-card__date__logo"':
                    to_df["date"].append(tags[idx+1].replace("</span", ""))
                elif '<span class="object-card__price__logo"' in t:
                    p = tags[idx+1]
                    p = p.replace('kr</span', "").replace(" ", "")
                    p = float(p)
                    to_df["price"].append(p)
                elif '<li aria-label="' in t and "m2" in tags[idx+1] and not ("tomt" in tags[idx+1]) and not ("kr" in tags[idx+1]):
                    msq = tags[idx+1].replace("m2", "").replace(" ", "").replace(",", ".").replace("</li", "")
                    if '+'in msq:
                        msq = sum([float(m) for m in msq.split("+")])
                    msq = float(msq)
                    to_df["size"].append(msq)
            if not same_len(to_df)[0]:
                #pprint(tags)
                key_missing = same_len(to_df)[1]
                for k, v in to_df.items():
                    if len(v) and k != key_missing:
                        to_df[k].pop(-1)
                #pprint([(k,len(v)) for k,v in to_df.items()])

        to_df["lat"] = [] 
        to_df["lng"] = [] 
        for idx in range(len(to_df["street_name"])):
            address = f'{to_df["street_name"][idx]}, {to_df["city"][idx]} sweden'
            location = get_lat_lng(address)
            to_df["lat"].append(location["lat"])
            to_df["lng"].append(location["lng"])

        df = pd.DataFrame(to_df)
        df["alt"] = 0.0
        df = translate_home_type(df)
        df.reset_index(inplace=True)
        df.to_csv("./booli.csv", index=False, mode="a", header=False)
        sleep(2)
        sleep(30 + random.randrange(3, 10)) 
        #pprint([(k,len(v)) for k,v in to_df.items()])
    all_data = pd.read_csv("./booli.csv")
    to_heat_map_format(all_data, "./booli.json")

        





if __name__ == "__main__":
    main()