import json
from rect2 import Rect2
from object import Object

class Map:
    tileset = None

    tileLayers = []
    collisionLayer = None
    collisionObjects = []
    objetstiled = [] 
    objectype = dict()
    mapObjects = [] # instances (objets)

    height = None
    width = None
    tileh = None
    tilew = None


    def __init__(self,src):
        self.src = src

        self.load(src)
        pass

    def load(self,src):
        with open(src) as f:
            self.dump = json.load(f)
        
        self.height = self.dump["height"]
        self.width = self.dump["width"]
        self.tileh = self.dump["tileheight"]
        self.tilew = self.dump["tilewidth"]
        
        for calque in self.dump["layers"]:
            if calque["name"] == "collisions":
                self.collisionLayer = calque["data"]
            elif calque["name"] == "objets":
                self.objetstiled = calque["objects"]
            else :
                self.tileLayers.append(calque["data"])

        self.setCollisions()
        self.setObjects()
    
    def setCollisions(self):
        for i in range(len(self.collisionLayer)):
            if  (self.collisionLayer[i] == 8250):
                y = (i // self.width)*self.tilew
                x = (i % self.width)*self.tileh
                h = self.tileh
                w = self.tilew
                self.collisionObjects.append(Rect2(x,y,h,w))
        
    def setObjects(self):
        #pour l'instant les seuls objets sont des arbres...
        import json
        with open("../client/static/assets/maps/atlas_sprites.json","r") as f:
            data = json.load(f)
        
        self.objectype["arbre1"] = []
        self.objectype["arbre2"] = []
        for i in range(len(self.objetstiled)):
            for t in ((self.objectype)):
                if t == self.objetstiled[i]["name"]:
                    self.objectype[t].append(i)
                    obj = self.objetstiled[i]
                    datasprite = ds = data["frames"][t]["spriteSourceSize"]
                    self.mapObjects.append(Object(obj["name"],obj["id"],obj["x"],obj["y"],ds["h"],ds["w"]))

                
                
    def statut_objets(self):
        pass

    def statut_animaux(self):
        pass

