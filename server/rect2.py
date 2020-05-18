class Rect2:
    def __init__(self,x,y,h,w,vx=0,vy=0,offx=0,offy=0):

        #positions actuelles
        self.x = x
        self.y = y
        self.h = h
        self.w = w
        self.vx = vx
        self.vy = vy

        self.offx = offx
        self.offy = offy

        #Anciennes positions
        self.xA = None
        self.yA = None
        self.hA = None
        self.wA = None
        self.vxA = None
        self.vyA = None

        #Vitesses demandees
        self.vxr = 0
        self.vyr = 0

        #Buffer des vitesses demandees : 
        self.vxrB = 0
        self.vyrB = 0

    def getInputs(self): # met a jour le buffer pour la nouvelle frame
        self.vxr = self.vxrB
        self.vyr = self.vyrB
    
    def newFrame(self):
        self.xA = self.x
        self.yA = self.y
        self.vxA = self.vx
        self.vyA = self.vy
    
    def changeLast(self):
        if self.x != self.xA or self.y != self.yA or self.vx != self.vxA or self.vy != self.vyA:
            return True
        return False
        



