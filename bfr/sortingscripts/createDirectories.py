"""
Create directories for different bike attributes
"""



from PIL import Image
import os
####
# Create directories
colors = ["blue", "black", "yellow", "red", "green", "white", "purple", "gray", "pink", "orange", "brown", "silver", "gold"] #black, white, red, green, yellow, blue, pink, gray, brown, orange and purple.
basket = ["yes", "no"]
rack = ["yes", "no"]
frame = ["male", "female", "sport", "child", "special"]
mudguard = ["yes", "no"]
net = ["yes", "no"]
chainProtection = ["yes", "no"] 

path = "/Users/adrian/Documents/MjukvaruProjekt/bfr/dataset/"


###
#Create training folder
if not os.path.exists(path + "training"):
    os.makedirs(path + "training")


categories = {"colors": colors, 
              "basket": basket, 
              "rack": rack, 
              "frame": frame, 
              "mudguard": mudguard, 
              "net":net , 
              "chainProtection": chainProtection
              }

for catagory in categories:    
    #print catagory
    newDir = path + "training/" + catagory
    if not os.path.exists(newDir):
        os.makedirs(newDir)
    value = categories[catagory]
    
    for subcat in value:
        #print subcat
        newSubDir = newDir + "/" + subcat
        if not os.path.exists(newSubDir):
            os.makedirs(newSubDir)
    
###
#read img from unsorted imgs
"""
def saveImg(catagory, options, img, savePath, file, Unsortedpath):
    
    alternativeCounter = 1    
    optionString= ""
    for o in options:
        optionString += o + " " + str(alternativeCounter)
        alternativeCounter +=1
    print(optionString)
    
    subcat = raw_input("Choose option")
    
    #Unvalid image for this catagory
    if subcat == 'd':
        #Remove image
        removePath = Unsortedpath + "/" + file
        print removePath
        os.remove(removePath)
        #os.remove(removePath, file, dir_fd=None)
        return
    
    #Unvalid picture for this subcat
    if subcat == 's':
        return
    
    if subcat.isdigit():
        print("converting format")
        subcat == int(subcat)
    print "subcat: " + str(subcat) 
    print "optionLen: " + str(len(options))
    
    for i in range(1, len(options)+1):
        if i == subcat:
            print ("lul")
            savePath = savePath + "/" + options[i-1] +"/"+ file
            img.save(savePath , 'png')
    print (savePath)
    

def sortImg(catagory, options):
    Unsortedpath = "/Users/adrian/Documents/mjukvaruprojekt/images_unsorted/bike_png"
    c = 0
    savePath = path + "training/" + catagory
    for file in os.listdir(Unsortedpath):
        if file == ".DS_Store":
            continue
        print(file)
        img = Image.open(Unsortedpath + "/" + file)
        img.show()
        print(catagory)
        saveImg(catagory, options, img, savePath, file, Unsortedpath)
        img.close()
        
        #prevent big loop
        c = c+1
        if c > 5:
            break
        

print("--------------------")
print("Welcome to Sorting script")
print("-----------------------")
print("first choose a catagory, then press the numbers to sort the bikes into different categories.")
print("press 's' if the picture does not belong to any subcat for this specific category")
print("press 'd' if the picture is useless for any category")



for catagory in categories:
    while(True):
        print ("The catagory that will be sorted is: " + catagory)
        anwser = raw_input("Press 'g' if go or 's' to skipt this catagory")
        if anwser == 's':
            break
        elif anwser == 'g':
            sortImg(catagory, categories[catagory])
            break
        else:
            print("invalid input, try again")




"""
"""
def getSavePaths():
    paths = {"colors": path + "training/colors", 
              "basket": path + "training/basket/", 
              "rack": path + "training/rack", 
              "frame": path +"training/frame", 
              "mudguard": path +"training/mudguard", 
              "net":path + "training/net", 
              "chainProtection": path +"training/chainProtection"
              }
newPath = "/Users/adrian/Documents/mjukvaruprojekt/images_unsorted/bike_png/"

print("lol")
for file in os.listdir(path):
    print(file)
    img = Image.open(path + file)
    new_img = img.resize( (256, 256) )
    new_img.save( newpath + file [:-4] + ".png" , 'png')
   
   
    #imgplot = plt.imshow(img)
    #plt.show()

   
    # your images in an array
    
    imgs = loadImages(path)

    for img in imgs:
        img.show()
        sleep(3)
    


def loadImages(path):
    # return array of images
    imagesList = listdir(path)
    loadedImages = []
    for image in imagesList:
        img = PImage.open(path + image)
        loadedImages.append(img)
    return loadedImages


def displayImg():
    #pylab inline
    img=mpimg.imread('your_image.png')
    imgplot = plt.imshow(img)
    plt.show()
"""
