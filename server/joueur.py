class Joueur:
    ''' Classe spécifique au jeu '''
    '''
    nom;
    energie;
    bois
    nourriture;
    coordonnées;
    vitesse;
    '''
    def __init__(self, nom, client,coordonnees):
        self.nom=nom
        self.client = client;
        self.energie=100
        self.bois=0
        self.nourriture=0
        self.coordonnees=coordonnees
        self.vitesse=[0,0]

    def hello():
        print("hello")
