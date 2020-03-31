#Importation de fichiers
from server import Server
import argparse
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--ip", help="Adresse IP du serveur de jeu")
    args = parser.parse_args()
    s = Server(args.ip); 
    ''' Démarrage du serveur '''
    s.start(); 


if __name__ == "__main__":
    main()