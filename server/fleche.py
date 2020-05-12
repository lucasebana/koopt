from rect2 import Rect2
class Fleche(Rect2):
    def __init__(self,id,x,y,h,w,vx=0,vy=0):
        super().__init__(x,y,h,w,vx,vy)
        self.id=id
        self.direction=1
