import json
from rect2 import Rect2

class Map:
    tileset = None

    tileLayers = []
    collisionLayer = None
    collisionObjects = []
    objets = [] # instances (objets)

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
                self.objets = calque
            else :
                self.tileLayers.append(calque["data"])

        self.setCollisions()
    
    def setCollisions(self):
        for i in range(len(self.collisionLayer)):
            if  (self.collisionLayer[i] == 8250):
                y = (i // self.width)*self.tilew
                x = (i % self.width)*self.tileh
                h = self.tileh
                w = self.tilew
                self.collisionObjects.append(Rect2(x,y,h,w))
        

    def statut_objets(self):
        pass

    def statut_animaux(self):
        pass

