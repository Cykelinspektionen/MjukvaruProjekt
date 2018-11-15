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
config.gpu_options.per_process_gpu_memory_fraction = 0.91
 
# Create a session with the above options specified.
k.tensorflow_backend.set_session(tf.Session(config=config))
 
#----------------------


#dirs
train_dir = '../dataset/training/frame/'
validation_dir = '../dataset/validation/frame/'

#set img training size
image_size = 200

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
model.add(layers.Dense(2, activation='softmax'))
 
# Show a summary of the model. Check the number of trainable parameters
model.summary()


# putita stuff
train_datagen = ImageDataGenerator(
      rescale=1./255,
      #rotation_range=0,
      #width_shift_range=0,
      #height_shift_range=0,
      #horizontal_flip=False,
      fill_mode='nearest')
 
validation_datagen = ImageDataGenerator(rescale=1./255)
 
# Change the batchsize according to your system RAM
train_batchsize = 25
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
model.compile(loss='categorical_crossentropy',
              optimizer=optimizers.RMSprop(lr=1e-4),
              metrics=['acc'])
			  
# Train the model
history = model.fit_generator(
      train_generator,
      steps_per_epoch=train_generator.samples/train_generator.batch_size ,
      epochs=5,
      validation_data=validation_generator,
      validation_steps=validation_generator.samples/validation_generator.batch_size,
      verbose=1)
 
# Save the model
model.save('./models/t1.h5')

print("klar!")

# acc = history.history['acc']
# val_acc = history.history['val_acc']
# loss = history.history['loss']
# val_loss = history.history['val_loss']
 
# epochs = range(len(acc))
 
# plt.plot(epochs, acc, 'b', label='Training acc')
# plt.plot(epochs, val_acc, 'r', label='Validation acc')
# plt.title('Training and validation accuracy')
# plt.legend()
 
# plt.figure()
 
# plt.plot(epochs, loss, 'b', label='Training loss')
# plt.plot(epochs, val_loss, 'r', label='Validation loss')
# plt.title('Training and validation loss')
# plt.legend()
 
# plt.show()