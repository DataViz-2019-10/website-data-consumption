import json

from os import listdir
from os.path import isfile, join, isdir

from utils import preprocess, compute_average_site, dict_to_list, retrieve_data

# Path to data
path = 'raw_data'

# Preprocessing
categories = [d for d in listdir(path) if isdir(join(path, d))]
out = {
    'categories': []
}
print('Processing categories :')
for c in categories:
    print(' -', c)
    cat_dir = join(path, c)
    sites = []
    files = [f for f in listdir(cat_dir) if isfile(join(cat_dir, f))]

    for filename in files:
        print('    -', filename)
        with open(join(cat_dir, filename), 'r') as f:
            try:
                data = json.load(f)
            except:
                print('/ ! \ Error in file', filename)
            else:
                data = retrieve_data(data)
                data = preprocess(data)
                data['website'] = filename.split('/')[-1][:-4]
                sites.append(data)

    d = {
        'cat_name': c,
        'sites': sites,
        'average': compute_average_site(sites, c)
    }

    out['categories'].append(d)

# Saving
with open('data.json', 'w') as f:
    json.dump(out, f)

print('Done.')
