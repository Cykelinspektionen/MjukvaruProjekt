from imageai.Detection import ObjectDetection
import os

execution_path = os.getcwd()
detector = ObjectDetection()
detector.setModelTypeAsRetinaNet()
#detector.setModelPath( os.path.join(execution_path , "resnet50_coco_best_v2.0.1.h5"))
detector.setModelPath("./models/resnet50_coco_best_v2.0.1.h5")
detector.loadModel()
custom = detector.CustomObjects(bicycle=True)
#detections = detector.detectObjectsFromImage(input_image=os.path.join(execution_path , "bike_028.png"), output_image_path=os.path.join(execution_path , "imagenew.jpg"))
detections, extracted_images = detector.detectCustomObjectsFromImage(custom_objects=custom,input_image=os.path.join(execution_path , "bike_028.png"), output_image_path=os.path.join(execution_path , "imagenew.jpg"), extract_detected_objects=True)
#detections = detector.detectCustomObjectsFromImage( custom_objects=custom, input_image=os.path.join(execution_path , "image3.jpg"), output_image_path=os.path.join(execution_path , "image3new-custom.jpg"), minimum_percentage_probability=30)

for eachObject in detections:
    print(eachObject["name"] , " : " , eachObject["percentage_probability"] )