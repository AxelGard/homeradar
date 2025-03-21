import json
from pprint import pprint
import typing
from time import sleep
from bs4 import BeautifulSoup
import random
import pandas as pd 
from tqdm import tqdm
import requests

def download_page(url):
    return requests.get(url).text


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
    to_df = {
        "street_name": [],
        "area": [],
        "city": [],
        "price": [],
        "size": [],
        "type": [],
        "lat": [],
        "lng": [],
    }

    for i in tqdm(range(10)):
        html = download_page(url + str(i)) 
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
        for d in data:
            if "SoldProperty" in d:
                try:
                    pprint(data[d])
                    to_df["street_name"].append(data[d]["streetAddress"])
                    to_df["area"].append(data[d]["descriptiveAreaName"])
                    to_df["city"].append(data[d]["location"]["region"]["municipalityName"])
                    to_df["price"].append(float(data[d]["soldPrice"]["raw"]))
                    to_df["size"].append(float(data[d]["livingArea"]["formatted"].replace('\xa0', '').replace('m²', '').replace(",", ".").strip()))
                    to_df["type"].append(swe_2_eng[data[d]["objectType"]])
                    to_df["lat"].append(float(data[d]["latitude"]))
                    to_df["lng"].append(float(data[d]["longitude"]))
                except KeyError:
                    pprint(data[d])
                    continue
        df = pd.DataFrame(to_df)
        df["alt"] = 0.0
        df = df.loc[df["lat"] != 0]
        df.reset_index(inplace=True)
        df.to_csv("./booli.csv", index=False)
        to_heat_map_format(df, "./booli.json")
        sleep(2)
        sleep(30 + random.randrange(3, 10)) 



if __name__ == "__main__":
    main()
