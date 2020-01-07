
def print_keys(d, indent='\n'):
    if type(d) == dict:
        for k in d.keys():
            print(indent, k, end='')
            print_keys(d[k], (indent + ' |  '))
    elif type(d) in (str,list):
        print(' <', str(type(d)).split("'")[1], '> (len: ', len(d), end=')', sep='')
    else:
        print(' <', str(type(d)).split("'")[1], '>', end='', sep='')

        
def print_values(d, indent='\n'):
    if type(d) == dict:
        for k in d.keys():
            print(indent, k, end='')
            print_values(d[k], (indent + ' |  '))
    else:
        print(':', d, end='')


def parse_time(s):
    t = s.split(':')
    return float(t[0][-2:])*60 + float(t[1]) + float(t[2][:-1])/60


def retrieve_data(data):
    out = {
        'total': 0,
        'session_length': (parse_time(data['log']['entries'][-1]['startedDateTime'])
                           - parse_time(data['log']['entries'][0]['startedDateTime']))
    }

    d = {}
    
    for e in data['log']['entries']:
        t = e['response']['content']['mimeType'].split('/') # data type (list)
        size = e['response']['_transferSize']

        if not t[0] in d.keys():
            if len(t) > 1:
                d[t[0]] = {}
                d[t[0]][t[1]] = size
            else:
                d[t[0]] = size

        elif len(t) > 1:
            if not t[1] in d[t[0]].keys():
                d[t[0]][t[1]] = size
            else:
                d[t[0]][t[1]] += size            

        else:
            d[t[0]] += size

        out['total'] += size
        
        #print(e['startedDateTime'])
    out['data'] = d
    return out


def dict_to_list(dic):
    liste = []
    for k in dic.keys():
        ob = dic[k]
        ob['type'] = k
        liste.append(ob)
    return liste


def preprocess(js, total_prop = 1000, remove_threshold=10):
    factor = js['session_length']
    total = js['total']
    js['total'] = int(js['total']/js['session_length'])
    js['total_proportion'] = total_prop
    
    to_remove = []
    
    s_val = 0
    s_prop = 0
    
    d = js['data']
    
    for k in d.keys():
        
        if type(d[k]) == dict:
            dict_val = 0
            dict_prop = 0
            for k2 in d[k].keys():
                val = int(d[k][k2]/factor)
                prop = int(d[k][k2]/total*total_prop)
                d[k][k2] = {'val': val, 'prop': prop}
                s_val += val
                s_prop += prop
                dict_val += val
                dict_prop += prop
            d[k]['val'] = dict_val
            d[k]['prop'] = dict_prop
        
        else:
            val = int(d[k]/factor)
            prop = int(d[k]/total*total_prop)
            d[k] = {'val': val, 'prop': prop}
            s_val += val
            s_prop += prop
            
        if remove_threshold > 0:
            if 'prop' in d[k].keys():
                if d[k]['prop'] < remove_threshold:
                    to_remove.append(k)
            else:
                for k2 in d[k].keys():
                    if 'prop' in d[k][k2].keys():
                        if d[k][k2]['prop'] < remove_threshold:
                            to_remove.append((k + '/' + k2))
    
    others = {}
    r_prop = 0
    r_val = 0
    for cat in to_remove:
        keys = cat.split('/')
        
        if len(keys) > 1:
            r_prop += d[keys[0]][keys[1]]['prop']  #super moche mais plus facile 
            r_val += d[keys[0]][keys[1]]['val']
            others[cat] = {'val': d[keys[0]][keys[1]]['val']}
            del d[keys[0]][keys[1]]
            if len(d[keys[0]].keys()) == 0:
                del d[keys[0]]
        else:
            r_prop += d[keys[0]]['prop']  #super moche mais plus facile 
            r_val += d[keys[0]]['val']
            others[cat] = {'val': d[keys[0]]['val']}
            del d[keys[0]]

    js['data']['others'] = others
    js['data']['others']['val'] = js['total'] - s_val + r_val
    js['data']['others']['prop'] = total_prop - s_prop + r_prop
    
    # js['array_data'] = dict_to_list(js['data'])

    return js


def compute_average_site(sites, cat_name):
    avg = {
        'website': ('Average ' + cat_name + ' website'),
        'data': {}
    }
    
    tot_val = 0
    
    # get main datatypes
    datatypes = []
    for site in sites:
        for k in site["data"].keys():
            if k not in datatypes:
                datatypes.append(k)
            
    # computing and saving average
    for t in datatypes:
        s_val = 0
        for site in sites:
            data = site['data'] 
            
            if t in data.keys():
                # test sub categories
                if 'val' not in data[t].keys():
                    for k in data[t].keys():
                        s_val += data[t][k]['val']
                else:
                    s_val += data[t]['val']
                    
        val = int(s_val/len(sites))
        
        tot_val += val
        
        avg['data'][t] = {'val': val}
        
    # computing prop:
    tot_prop = 0
    for t in avg['data'].keys():
        prop = int(avg['data'][t]['val'] * 1000 / tot_val)
        tot_prop += prop
        avg['data'][t]['prop'] = prop
    # adding the leftovers in 'others'
    if 'others' in avg['data'].keys():
        avg['data']['others']['prop'] += 1000 - tot_prop
    else:
        avg['data']['others']['prop'] = 1000 - tot_prop
        
    avg['total'] = tot_val
    avg['total_proportion'] = 1000 #XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX TODO : variable globale (en dessus *2 aussi)
    
    
    return avg 