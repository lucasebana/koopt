import time
import random
class Gameplay:
    

    

    def calcul_vie(self):#on ajoutera ici tous les types de dommages
        t=time.time()
        diff=t-self.t0
        if diff>=1:
            for i in range(len(self.joueurs)):
                #self.joueurs[i].last_energie=self.joueurs[i].energie    test energie classique
                #self.joueurs[i].energie=0     test energie vide
                self.joueurs[i].energie=self.joueurs[i].delta_vie(-diff)
                #self.unit.test_energie_vide(self,self.joueurs[i])
                #self.unit.test_energie(self,self.joueurs[i])

            self.t0=t   
    
    def delta_food(self,amount):
        self.food+=amount
        if self.food>self.food_init:
            self.food=self.food_init
        elif self.food<0:
            self.food=0
        return(self.food)
    
    def eatin(self,joueur,data):
        if data==True:
            #self.food=0   #test nourriture vide
            #joueur.energie=100    #unit test energie pleine
            self.food_a=self.food
            if self.food<self.quantite_nourriture:#si plus assez de nourriture

                if joueur.energie+(self.food/self.ratio<joueur.energie_init):
                    self.delta_food(-self.food)
                    joueur.delta_vie(self.food/self.ratio)

            else:

                if joueur.energie+(self.quantite_nourriture/self.ratio)<joueur.energie_init:
                    self.delta_food(-self.quantite_nourriture)
                    joueur.delta_vie(self.quantite_nourriture/self.ratio)
            #self.unit.test_energie_pleine(self,joueur)
            #self.unit.test_nourriture_vide(self)
            #self.unit.test_nourriture(self)
        
    def addWood(self):
        self.wood+=random.randint(self.addwood_min,self.addwood_max)

    def addFood(self):
        self.food+=random.randint(self.addfood_min,self.addfood_max)
        if self.food>self.food_init:
            self.food=self.food_init
        

                    
