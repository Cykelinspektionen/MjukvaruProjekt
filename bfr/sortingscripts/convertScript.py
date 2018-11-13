"""
converts a folder of images to png format
"""


from PIL import Image
# coding: utf8
#!/usr/bin/python
import os

newpath = "/Users/adrian/Documents/mjukvaruprojekt/images_unsorted/bike_png/"
path = "/Users/adrian/Documents/mjukvaruprojekt/images_unsorted/bike/"
print("lol")
for file in os.listdir(path):
    print(file)
    img = Image.open(path + file)
    new_img = img.resize( (256, 256) )
    new_img.save( newpath + file [:-4] + ".png" , 'png')

