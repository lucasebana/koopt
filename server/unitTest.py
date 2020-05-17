import unittest

from joueur import Joueur

class TestUnit(unittest.TestCase):
    def setUp(self,partie):
        self.p=partie

    def test_deplacements(self,joueur,fc):#ajouter cas où il y a des collisions
        if joueur.alive==True:
            if fc==(None,None):
                self.assertNotEqual((joueur.body.x, joueur.body.y),(joueur.body.xA,joueur.body.yA))
            else:
                self.assertEqual((joueur.body.x, joueur.body.y),(joueur.body.xA,joueur.body.yA))
        if joueur.alive==False:
            self.assertEqual((joueur.body.x, joueur.body.y),(joueur.body.xA,joueur.body.yA))

    #à implémenter dans rejoindrePartie (serveur) lorsque il y a déjà 4 joueurs dans la partie
    def test_trop_joueurs(self,partie,server,joueur):#le joueur passé en argument ne doit pas être inclus dans la partie
        l=len(partie.joueurs)
        if l==4:
            server.rejoindrePartie(joueur.socketid,data)#p-e besoin d'importer serverHandler
            self.assertEqual(l,4)
    
    #à implémenter à la fin de start dans partie
    def test_unique_joueur(self,partie):
        l=len(partie.joueurs)
        if l == 1:
            self.assertEqual(partie.etat,2)
    
    #cas idéal
    def test_lancer_partie(self,partie):
        self.assertEqual(partie.etat,3)
    


        

    