import sys
from PyQt5.QtWidgets import *
from PyQt5.uic import *
print(sys.path)

class MyApp(QMainWindow):
    def __init__(self):
        super().__init__()
        loadUi("start.ui", self)

app=QApplication(sys.argv)
label=MyApp()
label.show()
app.exec_()