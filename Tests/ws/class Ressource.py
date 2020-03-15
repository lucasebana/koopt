class Ressource:
    def use(self):
        return()
    pass

class Nourriture(Ressource):
    def _init_(self):
        self.nrj=10
    pass

class Bois(Ressource):
    def _init_(self):
        self.quantité=10
    pass



