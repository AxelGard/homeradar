from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By

class WebScraper:
    def __init__(self, url:str) -> None:
        self.url = url
        self.driver = webdriver.Chrome()

    def get_html(self):
        driver = self.driver
        driver.get(self.url)
        elem = driver.find_element("xpath", "//*")
        source_code = elem.get_attribute("outerHTML")
        return source_code

    def get_class(self):
        pass

    def __del__(self):
        self.driver.close()


if __name__ == "__main__":
    ws = WebScraper("https://www.booli.se/sok/slutpriser")
    print(ws.get_html())
    del ws
