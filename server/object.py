from rect2 import Rect2
class Object(Rect2):
    def __init__(self,name,id,x,y,h,w):
        super().__init__(x,y,h,w,0,0)
        self.name=name
        self.id = id
        pass
    pass