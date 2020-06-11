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

    changedObjects = []

    gridSize = 20

    


    def __init__(self,src):
        self.grid = [[[] for j in range(self.gridSize)] for i in range(self.gridSize)]
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
                col = Rect2(x,y,h,w)
                self.collisionObjects.append(col)

                indexGridY = y//(self.width//self.gridSize*self.tileh)
                indexGridX = x//(self.height//self.gridSize*self.tilew)
                self.grid[indexGridY][indexGridX].append(col)
        
    def setObjects(self):
        #pour l'instant les seuls objets sont des arbres...
        import json
        with open("../client/static/assets/maps/atlas_sprites.json","r") as f:
            self.dataObjects = json.load(f)
        
        self.objectype["arbre1"] = []
        self.objectype["arbre2"] = []
        for i in range(len(self.objetstiled)):
            for t in ((self.objectype)):
                if t == self.objetstiled[i]["name"]:
                    self.objectype[t].append(i)
                    obj = self.objetstiled[i]
                    datasprite = ds = self.dataObjects["frames"][t]["spriteSourceSize"] #infos relatives à la hitbox
                    hitbox = Object(obj["name"],obj["id"],obj["x"],obj["y"],ds["h"],ds["w"],ds["x"],+ds["y"])
                    self.mapObjects.append(hitbox)

                    indexGridY = obj["y"]//(self.width//self.gridSize*self.tileh)
                    indexGridX = obj["x"]//(self.height//self.gridSize*self.tilew)
                    self.grid[indexGridY][indexGridX].append(hitbox)
    
    def changeObjectTo(self,object,str):
        datasprite = ds = self.dataObjects["frames"][str]["spriteSourceSize"] #infos relatives à la hitbox
        object.__init__(str,object.id,object.x-object.offx,object.y-object.offy,ds["h"],ds["w"],ds["x"],ds["y"])
        self.changedObjects.append(object)
                
                
    def statut_objets(self):
        pass

    def statut_animaux(self):
        pass

