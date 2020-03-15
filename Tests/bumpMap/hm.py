from PIL import Image
import sys
import json
if len(sys.argv) < 2: 
    print("erreur : veuillez fournir le nom du fichier en argument")
    exit(-1)

im = Image.open(sys.argv[1]) # Can be many different formats.
pix = im.load()

L = [[pix[j,i][0] for i in range(im.size[1])] for j in range( im.size[0])]

import numpy as np
print(np.matrix(L))

with open(sys.argv[1][:-4]+'.json', 'w') as f:
    json.dump(L, f)