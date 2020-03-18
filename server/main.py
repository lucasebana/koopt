#Importation de fichiers
from server import Server,ServeurHandler

def main():
    s = Server(); 
    ''' Démarrage du serveur '''
    s.start(); 


if __name__ == "__main__":
    main()