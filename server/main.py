#Importation de fichiers
from server import Server
import argparse


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--ip", help="Adresse IP du serveur de jeu")
    args = parser.parse_args()
    if(args.ip.find(":") == -1):
        s = Server(args.ip);
    else:
        ind = args.ip.find(":")
        ip = args.ip[:ind]
        port = args.ip[ind+1:]
        s = Server(ip,port);
    ''' Démarrage du serveur '''
    s.start(); 


if __name__ == "__main__":
    main()