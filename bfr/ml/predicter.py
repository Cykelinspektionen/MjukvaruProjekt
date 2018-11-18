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
"""
for dataset in data_dir_list:
	img_list=os.listdir(data_path+'/'+dataset)
	randindex = randrange(0, len(img_list)-1)
	img = img_list[randindex]
	
	people.append(img.split('_')[0])
	
	#    uncomment for plots
	#image = mpimg.imread(data_path+'/'+dataset+'/'+img)
	#plt.imshow(image)
	#plt.show()
	
	
	input_img=cv2.imread(data_path+'/'+dataset+'/'+img)
	input_img=cv2.cvtColor(input_img, cv2.COLOR_BGR2RGB)
	input_img_resize=cv2.resize(input_img, (200,200))
	img_data_list.append(input_img_resize)
"""
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
"""
#construct list of age medians of age groups
age_medians = []
curr_val = 2

for i in range(0,19):
	age_medians.append(curr_val)
	curr_val = curr_val + 5

#multiply
print()
print()
print()
ages = []
for i in range(0,len(result)):
	age = 0
	for j in range(0,19):
		product = result[i][j]*age_medians[j]
		age+=product
		
	#print('actual: ' +str(people[i])+'       predicted: ' + str(age))
	ages.append(age)
	
print()
print()
print()

i = 0

errors = []
for r in ages:
	errors.append(abs( r-int(people[i] )))
	# if abs( r-int(people[i] )) >= 10:
		# print("DÅLIG")
		# image = mpimg.imread(data_path+'\\'+datasets[i]+'\\'+imgs[i])
		# plt.imshow(image)
		# plt.show()
	# if abs( r-int(people[i] )) <= 1:
		# print("BRA")
		# image = mpimg.imread(data_path+'\\'+datasets[i]+'\\'+imgs[i])
		# plt.imshow(image)
		# plt.show()
	
	#print('actual:' + str(people[i]) + '     prediction: ' + str(r))
	i+=1
print('ERROR')
print(np.mean(np.array(errors)))
"""