# -*- coding: utf-8 -*-
"""
Created on Thu May 17 11:00:04 2018

@author: dippson2
"""

from keras.models import load_model
import numpy as np
from random import randrange
import os, cv2
import matplotlib.pyplot as plt

import matplotlib.image as mpimg
model = load_model('models/rack/Adam_5_epochs_4layers.h5')

path = '../dataset/testing/rack'
right = 0
total = 0

for dir in os.listdir(path):
    print(dir)
    data_path = path + '/' + dir
    img_list=os.listdir(data_path)
    img_data_list = []
    for img in img_list:
    	
        print(img)
        input_img=cv2.imread(data_path+'/'+img)
        input_img=cv2.cvtColor(input_img, cv2.COLOR_BGR2RGB)
        input_img_resize=cv2.resize(input_img, (256,256))
        img_data_list.append(input_img_resize)
    
    img_data_list = np.array(img_data_list)
    img_data_list = img_data_list.astype('float32')
    img_data_list /= 255
    

    for i in range(0, len(img_data_list)):
        total +=1
        if dir == 'yes':
            if model.predict(img_data_list[i:i+1])[0][1] > 0.5:
                right +=1
                print("found right in dir: "+ dir)
            else:
                print("wrong")
        if dir == 'no':
            if model.predict(img_data_list[i:i+1])[0][0] > 0.5:
                right +=1
                print("found right in dir: "+ dir)
            else:
                print("wrong")
            
        #print(model.predict(img_data_list[i:i+1]))
    #print("Persentage classified right as yes: ") 
    print ("right: " + str(right))
    print ("total: " + str(total))
    print ("percentage right : " + str(right/total*100) + " %")
    
print ("right: " + str(right))
print ("total: " + str(total))
print ("percentage right : " + str(right/total*100) + " %")
    
    #print ("yes: " + str(yes))
