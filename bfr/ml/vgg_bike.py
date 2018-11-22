from keras.applications import VGG16
import keras.backend as k
import tensorflow as tf
import matplotlib.pyplot as plt

#MEMORY STUFF
#----------------------
# TensorFlow wizardry
config = tf.ConfigProto()
 
# Don't pre-allocate memory; allocate as-needed
config.gpu_options.allow_growth = True
 
# Only allow a x% of the GPU memory to be allocated
config.gpu_options.per_process_gpu_memory_fraction = 0.8
 
# Create a session with the above options specified.
k.tensorflow_backend.set_session(tf.Session(config=config))
 
#----------------------


#dirs
train_dir = '../dataset/training2/colors/'
validation_dir = '../dataset/validation/colors/'

#set img training size
image_size = 256

#Load the VGG model
vgg_conv = VGG16(weights='imagenet', include_top=False, input_shape=(image_size, image_size, 3))

# Freeze the layers except the last 4 layers
for layer in vgg_conv.layers[:-4]:
    layer.trainable = False
	
# ----------------------------------

from keras import models
from keras import layers
from keras import optimizers
from keras.preprocessing.image import ImageDataGenerator

# Create the model
model = models.Sequential()
 
# Add the vgg convolutional base model
model.add(vgg_conv)
 
# Add new layers
model.add(layers.Flatten())
model.add(layers.Dense(1024, activation='relu'))
model.add(layers.Dropout(0.5))
model.add(layers.Dense(11, activation='softmax'))
 
# Show a summary of the model. Check the number of trainable parameters
model.summary()


#Autosplit
"""
#Automatic split into validation folder, might be used
data_generator = ImageDataGenerator(rescale=1./255, validation_split=0.33)

train_generator = data_generator.flow_from_directory(train_dir, 
                                                     target_size=(image_size, image_size), 
                                                     shuffle=True, 
                                                     seed=13,
                                                     class_mode='categorical', 
                                                     batch_size=train_batchsize, 
                                                     subset="training")

validation_generator = data_generator.flow_from_directory(train_dir, 
                                                          target_size=(image_size, image_size), 
                                                          shuffle=True, 
                                                          seed=13,
                                                          class_mode='categorical', 
                                                          batch_size=val_batchsize, 
                                                          subset="validation")

"""

# putita stuff
train_datagen = ImageDataGenerator(
      rescale=1./255,
      rotation_range=20,
      zoom_range = 0.2,
      shear_range = 0.2,
      width_shift_range = 0.1,
      height_shift_range = 0.1,
      horizontal_flip=True,
      fill_mode='nearest')
"""
for batch in datagen.flow(img_arr, batch_size=1, save_to_dir='path/to/save', save_prefix='1_param', save_format='jpeg'):
    print(batch[0][0][0])
    pyplot.imshow(batch[0])
    pyplot.show()
    break
"""

 
validation_datagen = ImageDataGenerator(rescale=1./255)
 
# Change the batchsize according to your system RAM
train_batchsize = 15
val_batchsize = 5
 
train_generator = train_datagen.flow_from_directory(
        train_dir,
        target_size=(image_size, image_size),
        batch_size=train_batchsize,
        class_mode='categorical')
 
validation_generator = validation_datagen.flow_from_directory(
        validation_dir,
        target_size=(image_size, image_size),
        batch_size=val_batchsize,
        class_mode='categorical',
        shuffle=False)	

print("train_gen class_indices")
print(train_generator.class_indices)

print("validation_generator class_indices")
print(validation_generator.class_indices)
		
# Compile the model
model.compile(loss='categorical_crossentropy', # (ln(output 1) + ln(output 2) 
              optimizer=optimizers.Adam(lr=1e-4), # Test adam and SGD(prefarable in fine-tuning)
              metrics=['acc']) # like loss function but not used during training
			  
# Train the model
history = model.fit_generator(
      train_generator,
      steps_per_epoch=train_generator.samples/train_generator.batch_size ,
      epochs=5,
      validation_data=validation_generator,
      validation_steps=validation_generator.samples/validation_generator.batch_size,
      verbose=1)
 
# Save the model
model.save('./models/colors/Adam_5_epochs_4layers_colors.h5')

print("klar!")

acc = history.history['acc']
val_acc = history.history['val_acc']
loss = history.history['loss']
val_loss = history.history['val_loss']
 
epochs = range(len(acc))
 
plt.plot(epochs, acc, 'b', label='Training acc')
plt.plot(epochs, val_acc, 'r', label='Validation acc')
plt.title('Training and validation accuracy')
plt.legend()
 
plt.figure()
 
plt.plot(epochs, loss, 'b', label='Training loss')
plt.plot(epochs, val_loss, 'r', label='Validation loss')
plt.title('Training and validation loss')
plt.legend()
 
plt.show()