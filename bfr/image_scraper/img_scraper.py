"""
scarpe images of bikes. Python version = 3.*
"""
import urllib.request
from time import *
from selenium import webdriver 
from selenium.webdriver.common.by import By 
from selenium.webdriver.support.ui import WebDriverWait 
from selenium.webdriver.support import expected_conditions as EC 
from selenium.common.exceptions import TimeoutException
SAVEPATH = "/Users/adrian/Documents/MjukvaruProjekt/bfr/images_unsorted/bike_scraped"

#Use incognito mode
option = webdriver.ChromeOptions()
option.add_argument("--incognito")


driver = webdriver.Chrome(chrome_options=option, executable_path='./chromedriver') 

#load website
driver.get("X")

#Set opener
opener=urllib.request.build_opener()
opener.addheaders=[('User-Agent','Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/36.0.1941.0 Safari/537.36')]
urllib.request.install_opener(opener)

#download the images
pageAmount = 104
for pageNumber in range (6, pageAmount):
    driver.get("X" + str(pageNumber))
    images = driver.find_elements_by_tag_name('img')
    imageNumber = 0
    for image in images:
        try:
            src = (image.get_attribute('src'))
            print(src)
            if ".jpg" in src:
                local= SAVEPATH + "/bike_"+  str(pageNumber) + "_" + str(imageNumber)+ ".png"
                
                urllib.request.urlretrieve(src,local)
                imageNumber +=1
        except:
            pass

driver.quit()