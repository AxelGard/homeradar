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
    API_KEY = "AIzaSyAaIHU2ZTditFtPL-K05lt4XDtiWMrtaKk" 
    url = f"https://maps.googleapis.com/maps/api/geocode/json?address={address}&key={API_KEY}"
    response = requests.get(url)
    data = response.json()
    print(data)
    location = data["results"][0]["geometry"]["location"]
    sleep(0.5)
    return {
        "lat":location["latitude"],
        "lng":location["longitude"],
        "alt": 0.0
    }

def main():
    
    ws = WebScraper("https://www.booli.se/sok/slutpriser?page=2")
    ws.set_html().set_soup()
    to_df = {
        "street_name": [],
        "area": [],
        "city": [],
        "price": [],
        "size": [],
        "type": [],
        "date": [],
        "lat": [],
        "lng": [],
    }

    for listing_idx, listing in tqdm(enumerate(ws.soup.find_all(class_="object-card-layout__content")[:2])):
        tags = str(listing)
        tags = unicodedata.normalize("NFKD",tags).split(">")
        #pprint(tags)
        for idx, t in enumerate(tags):
            if '<a class="expanded-link no-underline hover:underline" href="' in t:
                to_df["street_name"].append(tags[idx+1].replace("</a", ""))
            elif t == '<span class="object-card__preamble"':
                area = tags[idx+1].replace("</span", "").split(" · ")
                print(area)
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
            elif '<li aria-label="' in t and "m2" in tags[idx+1] and not "tomt" in tags[idx+1] and not "kr" in tags[idx+1]:
                msq = tags[idx+1].replace("m2", "").replace(" ", "").replace(",", ".").replace("</li", "")
                if '+'in msq:
                    msq = sum([float(m) for m in msq.split("+")])
                msq = float(msq)
                to_df["size"].append(msq)

        address = f'{to_df["street_name"][listing_idx]}, {to_df["city"][listing_idx]}'
        location = get_lat_lng(address)
        to_df["lat"].append(location["lat"])
        to_df["lng"].append(location["lng"])
            

    df = pd.DataFrame(to_df)
    print(df)
    #df["alt"] = 0.0
    #df = df.loc[df["lat"] != 0]
    #df.reset_index(inplace=True)
    #print(df)
            



    del ws


if __name__ == "__main__":
    main()