"""
Loads a model and run every file in datpath trough it.
"""


from keras.models import load_model
import numpy as np
from random import randrange
import os, cv2
import matplotlib.pyplot as plt

import matplotlib.image as mpimg


model = load_model('./models/t1.h5')

data_path = './test'

data_dir_list = os.listdir(data_path)
img_data_list = []
people = []
imgs=[]
datasets=[]

for dataset in data_dir_list:
	img_list=os.listdir(data_path+'/'+dataset)
	for img in img_list:
		imgs.append(img)
		people.append(img.split('_')[0])
		datasets.append(dataset)
		
		input_img=cv2.imread(data_path+'/'+dataset+'/'+img)
		input_img=cv2.cvtColor(input_img, cv2.COLOR_BGR2RGB)
		input_img_resize=cv2.resize(input_img, (256,256))
		img_data_list.append(input_img_resize)


img_data_list = np.array(img_data_list)
img_data_list = img_data_list.astype('float32')
img_data_list /= 255

result = model.predict(img_data_list)
print(result)
