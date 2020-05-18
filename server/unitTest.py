import unittest

from joueur import Joueur

class TestUnit(unittest.TestCase):
    def setUp(self,partie):
        self.p=partie

    def test_energie_vide(self,partie,joueur):
        self.assertEqual(joueur.energie,0)

    def test_energie_pleine(self,partie,joueur):
        self.assertEqual(joueur.energie,100)

    def test_energie(self,partie,joueur):
        self.assertNotEqual(joueur.energie,joueur.last_energie)
    
    def test_nourriture_vide(self,partie):
        self.assertEqual(partie.food,0)


    def test_nourriture(self,partie):
        self.assertNotEqual(partie.food_a,partie.food)
  
    
    def test_unique_joueur(self,partie):
        l=len(partie.joueurs)
        if l == 1:
            self.assertEqual(partie.etat,2)
    
    def test_lancer_partie(self,partie):
        self.assertEqual(partie.etat,3)
        
        
    


        

    