import time
class Gameplay:
    


    def calcul_vie(self):#on ajoutera ici tous les types de dommages
        t=time.time()
        diff=t-self.t0
        if diff>=1:
            for i in range(len(self.joueurs)):
                self.joueurs[i].energie=self.joueurs[i].delta_vie(-diff*0.1)
            self.t0=t   
    
    def delta_food(self,amount):
        self.food+=amount
        if self.food>100*5:
            self.food=100*5
        elif self.food<0:
            self.food=0
        return(self.food)
    
    def eatin(self,joueur,data):
        if data==True:
            self.food_a=self.food
            if self.food<self.quantite_nourriture:#si plus assez de nourriture

                if joueur.energie+(self.food/self.ratio<joueur.energie_init):
                    self.delta_food(-self.food)
                    joueur.delta_vie(self.food/self.ratio)

            else:

                if joueur.energie+(self.quantite_nourriture/self.ratio)<joueur.energie_init:
                    self.delta_food(-self.quantite_nourriture)
                    joueur.delta_vie(self.quantite_nourriture/self.ratio)
                    
