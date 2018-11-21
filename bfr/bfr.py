# -*- coding: utf-8 -*-
"""
Created on Wed Nov 21 13:16:48 2018

@author: dippson2
"""
from keras.models import load_model
from imageai.Detection import ObjectDetection
import os
import numpy as np
import cv2


#Paths
PATH_BIKEDETECTION_MODEL = 'C:/Users/dippson2/MjukvaruProjekt/bfr/ml/models/resnet50_coco_best_v2.0.1.h5'
PATH_RACKDETECTION_MODEL = 'C:/Users/dippson2/MjukvaruProjekt/bfr/ml/models/rack/Adam_5_epochs_4layers_88.59.h5'

#Models
RACKDETECTION_MODEL = load_model(PATH_RACKDETECTION_MODEL)

#ReturnObject
returnObject = {
    "bikefound": False,
    "rack": ""

}


#Detect bike on image
execution_path = os.getcwd()
detector = ObjectDetection()
detector.setModelTypeAsRetinaNet()
detector.setModelPath(PATH_BIKEDETECTION_MODEL)
detector.loadModel()
custom = detector.CustomObjects(bicycle=True)
print("pre-work done")
returned_image, detections, extracted_objects = detector.detectCustomObjectsFromImage(custom_objects=custom, input_image='C:/Users/dippson2/MjukvaruProjekt/bfr/bike_175.png', \
                                                                                      output_type="array", extract_detected_objects=True,  minimum_percentage_probability=30)

if len(detections) != 0:
    returnObject["bikefound"] = True  
    print("Found bike")
else:
    print("Found to many or to few bikes on image")
    print("Bikes found: " + str(len(detections)))
    sys.exit(1)



#Resize and reshape bike image
img_data_list = []
bike_img = extracted_objects[0]
bike_img=cv2.cvtColor(bike_img, cv2.COLOR_BGR2RGB)
bike_img=cv2.resize(bike_img, (256,256))
img_data_list.append(bike_img)

img_data_list = np.array(img_data_list)
img_data_list = img_data_list.astype('float32')
img_data_list /= 255


#Predictions
rack = RACKDETECTION_MODEL.predict(img_data_list)
if rack[0][1] > 0.5:
    returnObject["rack"] = "yes"
    print("yes")
else: 
    returnObject["rack"] = "no"
    print("No")



"""
#Watch bike image
from PIL import Image
im = Image.fromarray(bike_img)
im.save("your_file.png")
"""
print (returnObject)


#for eachObject in detections:
#    print(eachObject["name"] , " : " , eachObject["percentage_probability"] )