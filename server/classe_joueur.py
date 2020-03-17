class Joueur:
    '''
    nom;
    energie;
    bois
    nourriture;
    coordonnées;
    vitesse;
    '''
    def init(self, nom, coordonnees):
        self.nom=nom
        self.energie=100
        self.bois=0
        self.nourriture=0
        self.coordonnees=[0,0]
        self.vitesse=[0,0]
    def hello():
        print("hello")
