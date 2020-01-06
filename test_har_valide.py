import json

with open("raw_data/Video/YouTube.har", 'r') as f:
        data = json.load(f)

if data['log']:
	print("A priori c'est ok")
else:
	print("Ya surement un soucis")
