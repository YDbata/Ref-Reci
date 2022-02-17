from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5 import QtGui

class ReciItem(QWidget):
    def __init__(self):
        super().__init__()

        self.setObjectName("ref_item_form")
        self.resize(608, 192)

        self.recipe_item_container = QPushButton(self)
        self.recipe_item_container.setGeometry(QRect(0, 0, 1232, 192))
        self.recipe_item_container.setStyleSheet("background-color: #F2EDE7;\n"
                                                 "border: 0px;")
        self.recipe_item_container.setText("")
        self.recipe_item_container.setObjectName("recipe_item_container")

        self.recipe_item_picture = QPushButton(self)
        self.recipe_item_picture.setGeometry(QRect(0, 0, 248, 192))
        self.recipe_item_picture.setStyleSheet("background-color: #FFFFFF;\n"
                                               "border-image: url(img/onion.png);\n"
                                               "border: 0px;")
        self.recipe_item_picture.setText("")
        self.recipe_item_picture.setObjectName("recipe_item_picture")

        self.recipe_item_name = QLabel(self)
        self.recipe_item_name.setGeometry(QRect(272, 16, 512, 41))
        font = QtGui.QFont()
        font.setFamily("KoPubWorld돋움체 Bold")
        font.setWeight(75)
        font.setPointSize(26)
        self.recipe_item_name.setFont(font)
        self.recipe_item_name.setStyleSheet("background-color: rgba(0,0,0,0);\n"
                                            "color: #45423C;")
        self.recipe_item_name.setObjectName("recipe_item_name")

        self.recipe_item_ingre = QLabel(self)
        self.recipe_item_ingre.setGeometry(QRect(272, 64, 936, 33))
        self.recipe_item_ingre.setStyleSheet("font: 20pt \"KoPubWorld돋움체 Medium\";\n"
                                             "color: #45423C;\n"
                                             "background-color: rgba(0,0,0,0);")
        self.recipe_item_ingre.setObjectName("recipe_item_ingre")

        self.recipe_item_time = QLabel(self)
        self.recipe_item_time.setGeometry(QRect(1074, 16, 80, 32))
        self.recipe_item_time.setStyleSheet("font: 18pt \"KoPubWorld돋움체 Bold\";\n"
                                            "color: #ffffff;\n"
                                            "text-align: center;\n"
                                            "padding-top: 2px;\n"
                                            "background-color: #F9BC15;\n"
                                            "border-radius: 18px;")
        self.recipe_item_time.setAlignment(Qt.AlignCenter)
        self.recipe_item_time.setObjectName("recipe_item_time")

        self.recipe_item_intro = QTextBrowser(self)
        self.recipe_item_intro.setGeometry(QRect(272, 112, 936, 65))
        self.recipe_item_intro.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.recipe_item_intro.setStyleSheet("font: 14pt \"KoPubWorld돋움체 Medium\";\n"
                                             "color: #45423C;\n"
                                             "background-color: rgba(0,0,0,0);\n"
                                             "border: 0px;")
        self.recipe_item_intro.setObjectName("recipe_item_text")

        self.retranslateUi()
        # QMetaObject.connectSlotsByName(ref_item_form)

    def retranslateUi(self):
        _translate = QCoreApplication.translate
        self.setWindowTitle(_translate("ref_item_form", "Form"))
        self.recipe_item_name.setText(_translate("ref_item_form", "레시피 이름"))
        self.recipe_item_ingre.setText(_translate("ref_item_form", "재료들"))
        self.recipe_item_time.setText(_translate("ref_item_form", "50분"))
        self.recipe_item_intro.setText(_translate("ref_item_form", "레시피 소개글 레시피 소개글 레시피 소개글 레시피 소개글 레시피 소개글 레시피 소개글 레시피 "))


if __name__ == "__main__":
    import sys
    app = QApplication(sys.argv)
    recipe = ReciItem()
    recipe.show()
    app.exec_()
