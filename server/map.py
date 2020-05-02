import json
class Map:
    tileset = None

    tileLayers = []
    collisionLayer = None
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
            if calque["name"] == "collision":
                self.collisionLayer = calque
            if calque["name"] == "objets":
                self.objets = calque
            self.tileLayers.append(calque)

    def statut_objets(self):
        pass

    def statut_animaux(self):
        pass

