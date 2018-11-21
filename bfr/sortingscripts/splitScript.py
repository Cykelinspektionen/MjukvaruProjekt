"""
Split dataset into training, test and validation data
"""


import os
import shutil
import numpy as np

def split_dataset_into_test_and_train_sets(all_data_dir, training_data_dir, testing_data_dir, validation_data_dir, testing_data_pct, validation_data_pct):
    # Recreate testing, validation and training directories
    print (testing_data_dir.count('/'))
    if os.path.isdir(testing_data_dir):
        shutil.rmtree(testing_data_dir, ignore_errors=False)
        os.makedirs(testing_data_dir)
        print("Successfully cleaned directory " + testing_data_dir)
    else:
        os.makedirs(testing_data_dir)
        print("Refusing to delete testing data directory " + testing_data_dir)

    if os.path.isdir(training_data_dir):
        shutil.rmtree(training_data_dir, ignore_errors=False)
        os.makedirs(training_data_dir)
        print("Successfully cleaned directory " + training_data_dir)
    else:
        print("Refusing to delete testing data directory " + training_data_dir)
        os.makedirs(training_data_dir)

    if os.path.isdir(validation_data_dir):
        shutil.rmtree(validation_data_dir, ignore_errors = False)
        os.makedirs(validation_data_dir)
        print("Successfully cleaned directory " + validation_data_dir)
    else:
        print("Refusing to delete testing data directory " + validation_data_dir)
        os.makedirs(validation_data_dir)


    #split images
    num_validation_files = 0
    num_training_files = 0
    num_testing_files = 0

    for subdir, dirs, files in os.walk(all_data_dir):
        category_name = os.path.basename(subdir)

        # Don't create a subdirectory for the root directory
        print(category_name + " vs " + os.path.basename(all_data_dir))
        if category_name == os.path.basename(all_data_dir):
            continue

        #Create subddirs
        validation_data_category_dir = validation_data_dir + '/' + category_name
        training_data_category_dir = training_data_dir + '/' + category_name
        testing_data_category_dir = testing_data_dir + '/' + category_name

        if not os.path.exists(training_data_category_dir):
            os.mkdir(training_data_category_dir)

        if not os.path.exists(testing_data_category_dir):
            os.mkdir(testing_data_category_dir)

        if not os.path.exists(validation_data_category_dir):
            os.mkdir(validation_data_category_dir)
        
        #Add files
        for file in files:
            input_file = os.path.join(subdir, file)
            rand = np.random.rand(1)

            if rand < testing_data_pct:
                shutil.copy(input_file, testing_data_dir + '/' + category_name + '/' + file)
                num_testing_files += 1
            elif rand >= testing_data_pct and rand < validation_data_pct+testing_data_pct:
                shutil.copy(input_file, validation_data_dir + '/'+ category_name + '/' + file)
                num_validation_files +=1
            else:
                shutil.copy(input_file, training_data_dir + '/' + category_name + '/' + file)
                num_training_files += 1

    print("Processed " + str(num_training_files) + " training files.")
    print("Processed " + str(num_testing_files) + " testing files.")

tpath = 'C://Users/dippson2/MjukvaruProjekt/bfr/dataset/training2'
vpath = 'C://Users/dippson2/MjukvaruProjekt/bfr/dataset/validation'
test_path = 'C://Users/dippson2/MjukvaruProjekt/bfr/dataset/testing'
path = 'C:/Users/dippson2/MjukvaruProjekt/bfr/dataset/training/'
for idir in os.listdir(path):
    
    newSubDir = tpath + "/" + idir
    if not os.path.exists(newSubDir):
        os.makedirs(tpath + "/"+ idir)
    
    newSubDir = vpath + "/" + idir
    if not os.path.exists(newSubDir):
        os.makedirs(vpath +"/" + idir)
    
    split_dataset_into_test_and_train_sets(path +'/'+ idir, tpath +"/" +idir,test_path +'/'+ idir ,vpath +'/'+ idir, 0.1, 0.25)