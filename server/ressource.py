class Ressource:
    def use(self):
        return()
    pass

    def partager_ressource(ressource, joueur1, joueur2):
        joueur2.ressource+=10
        joueur1.ressource-=10

    def acquerir_ressource(ressource, joueur):
        joueur.ressource+=10

    def consommer_ressource(ressource, joueur):
        i=0
        if (ressource==bois):
            joueur.ressource-=10
        elif (ressource==nourriture): #les aliments se mangent 10 par 10 pour simplifier et pas à avoir à indiquer le joueur mange combien de portions à chaque fois
            while joueur.energie<100 and i<=10:
                joueur.nourriture-=1  #moins de nourriture dans le sac mais plus d'énergie
                joueur.energie+= 1    # energie majorée à 100
                i+=1

class Nourriture(Ressource):
    def _init_(self):
        self.quantité=10
    pass

class Bois(Ressource):
    def _init_(self):
        self.quantité=10
    pass

