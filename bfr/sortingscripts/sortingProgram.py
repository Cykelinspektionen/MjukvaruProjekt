"""
Basic manual sorting program
"""
import os, sys
import Tkinter
from Tkinter import *
from PIL import Image
from PIL import ImageTk

BULKPATH = "/Users/adrian/Documents/MjukvaruProjekt/bfr/images_unsorted/bike_Formated"
SAVEPATH = "/Users/adrian/Documents/MjukvaruProjekt/bfr/dataset/training/"

"""Set variables"""
colors = ["blue", "black", "yellow", "red", "green", "white", "purple", "gray", "pink", "orange", "brown", "silver", "gold"] #black, white, red, green, yellow, blue, pink, gray, brown, orange and purple.
basket = ["yes", "no"]
rack = ["yes", "no"]
frame = ["male", "female", "sport", "child", "special"]
lamp = ["yes", "no"]

categories = {"colors": colors, 
              "basket": basket, 
              "rack": rack, 
              "frame": frame, 
              #"mudguard": mudguard, 
              #"net":net , 
              #"chainProtection": chainProtection,
              "lamp": lamp
              }
            
"""Methods"""
def saveImg():
    print("inSaveImg")
    for c in categories:
        print c
        value = categories[c]  
        for i in range  (0, len(value)):
            print "option: " + value[i]
            print "mark: " + str(checkbuttonsValues[c][i].get())
            if checkbuttonsValues[c][i].get() == 1:
                savepath = SAVEPATH + c + "/" + value[i]
                imgSavePath = savepath + "/" + f
                print (savepath)
                print f
                print imgSavePath
                image1.save(imgSavePath , 'png')
        
def SelectButton(myopt, mycat):
    def wrapper(opt=myopt, cat=mycat):
        print opt
        print cat
        value = checkbuttons[cat]
        for v in value:
            if v.cget("text") != opt:
                v.deselect()
    return wrapper
    
def next(event):
    colors = checkbuttonsValues["colors"]
    for c in colors:
        print c.get()
    chain =  checkbuttonsValues["chainProtection"]
    for c in chain:
        print c.get()
    saveImg()
    print("lul")

    event.widget.quit() 
    # this will cause mainloop to unblock.
   #tkMessageBox.showinfo( "Hello Python", "Hello World")

def printAlternatives():
    pass



def skip(event):
    event.widget.quit() 
    pass                           
    #print("Shutting down") 
    #import sys; sys.exit() 

"""root and frames """
root = Tkinter.Tk()

root.geometry('{}x{}'.format(6000, 760))
bottomframe = Frame(root)

#print keys[values.index("bar")]
"""Add Bike Data Alternatives""" 
keys=categories.keys()  #in python 3, you'll need `list(i.keys())`
values=categories.values()
checkbuttons = {"colors": [], 
              "basket": [], 
              "rack": [], 
              "frame": [], 
              "mudguard": [], 
              "net":[] , 
              "chainProtection": [],
              "lamp":[]
              }
checkbuttonsValues = {"colors": [], 
              "basket": [], 
              "rack": [], 
              "frame": [], 
              "mudguard": [], 
              "net":[] , 
              "chainProtection": [],
              "lamp":[]
              }
print (keys)

#t1 = Label(root, text = "Delete", font=("Helvetica", 12))


for cat in categories:
    f1 = Frame(root, bg='cyan')
    value = categories[cat]
    t1 = Label(f1, text = cat, font=("Helvetica", 16))
    #t1 = Text (root)
    #t1.insert(INSERT, "T1")
    t1.pack()

    for opt in value: 
        v = IntVar()
        checkbuttonsValues[cat].append(v)
        c = Checkbutton(f1, text=opt, font=("Helvetica", 12), variable=v, command = SelectButton(opt, cat))
        checkbuttons[cat].append(c)
        c.var = v
        c.pack(side = RIGHT)
    f1.pack()


"""Add buttons """

B1 = Button(root, text='Save and next')
B1.pack(side = RIGHT)
B1.bind('<Button-1>', next)

B2 = Button(root, text='Skip')
B2.pack(side = RIGHT)
B2.bind('<Button-1>', skip)


root.title("Bike Sorter")

dirlist = os.listdir(BULKPATH)
old_label_image = None
counter = 1
"""
Load Imagess
"""

for f in dirlist:

    print f
    print "conuter: " + str(counter) 
    counter +=1
    if counter < 760:
        continue
    if f == ".DS_Store":
        continue
    #try:
    image1 = Image.open(BULKPATH +"/"+f)
    #root.geometry('%dx%d' % (image1.size[0]/2,image1.size[1]/2))
    tkpi = ImageTk.PhotoImage(image1)
    label_image = Tkinter.Label(root, image=tkpi)
    label_image.place(x=0,y=195,width=image1.size[0],height=image1.size[1])
    if old_label_image is not None:
        old_label_image.destroy()
    old_label_image = label_image
    root.mainloop() 
