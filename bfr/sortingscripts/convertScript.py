"""
converts a folder of images to png format
"""


from PIL import Image
# coding: utf8
#!/usr/bin/python
import os

newpath = "/Users/adrian/Documents/MjukvaruProjekt/bfr/images_unsorted/bike_Formated/"
path = "/Users/adrian/Documents/MjukvaruProjekt/bfr/images_unsorted/bike/"
print("lol")
for file in os.listdir(path):
    if ".DS_Store" in file:
        continue
    print(file)
    img = Image.open(path + file)
    new_img = img.resize( (512, 512) )
    #new_img.save( newpath + file, 'png')
    new_img.save( newpath + file [:-4] + ".png" , 'png')

