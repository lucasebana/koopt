import json
class Map:
    tileset = None

    tileLayers = []
    collisionLayer = None
    objets = [] # instances (objets)

    def __init__(self,src):
        self.src = src

        self.load(src)
        pass

    def load(self,src):
        with open(src) as f:
            self.dump = json.load(f)

    def statut_objets(self):
        pass

    def statut_animaux(self):
        pass

