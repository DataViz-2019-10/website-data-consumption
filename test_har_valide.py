import json
import os

export_folder = "exports"

for folder_name in os.listdir(export_folder):
    for file_name in os.listdir(os.path.join(export_folder + "/" + folder_name)):
        if file_name.endswith(".har"):
            file_loc = os.path.join(export_folder + "/" + folder_name, file_name)
            print(file_loc)
            try:
                with open(file_loc, 'r') as f:
                        data = json.load(f)
            except:
                print("c'est mort")
                continue

            if data['log']:
            	print("A priori c'est ok")
            else:
            	print("Ya surement un soucis")
