"""
Create directories for different bike attributes
"""

from PIL import Image
import os
# Create directories
colors = ["blue", "black", "yellow", "red", "green", "white", "purple", "gray", "pink", "orange", "brown", "silver", "gold"] #black, white, red, green, yellow, blue, pink, gray, brown, orange and purple.
basket = ["yes", "no"]
rack = ["yes", "no"]
frame = ["male", "female", "sport", "child", "special"]
mudguard = ["yes", "no"]
net = ["yes", "no"]
chainProtection = ["yes", "no"] 

path = "/Users/adrian/Documents/MjukvaruProjekt/bfr/dataset/"

###
#Create training folder
if not os.path.exists(path + "training"):
    os.makedirs(path + "training")

categories = {"colors": colors, 
              "basket": basket, 
              "rack": rack, 
              "frame": frame, 
              "mudguard": mudguard, 
              "net":net , 
              "chainProtection": chainProtection
              }

for catagory in categories:    
    #print catagory
    newDir = path + "training/" + catagory
    if not os.path.exists(newDir):
        os.makedirs(newDir)
    value = categories[catagory]
    
    for subcat in value:
        #print subcat
        newSubDir = newDir + "/" + subcat
        if not os.path.exists(newSubDir):
            os.makedirs(newSubDir)
    

