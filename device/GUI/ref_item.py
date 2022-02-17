from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
from PyQt5 import QtGui
import db as DB

# 임시용
USER_ID = 1

# DB 클래스 생성
refDB = DB.DB()

class RefItem(QWidget):
    def __init__(self):
        super().__init__()
        self.upID = -1

        self.setObjectName("ref_item")
        self.resize(608, 192)
        self.ref_item_container = QPushButton(self)
        self.ref_item_container.setGeometry(QRect(0, 0, 608, 192))
        self.ref_item_container.setStyleSheet("background-color: #F2EDE7;\n"
                                              "border: 0px;")
        self.ref_item_container.setText("")
        self.ref_item_container.setObjectName("ref_item_container")

        self.ref_item_delete = QPushButton(self)
        self.ref_item_delete.setGeometry(QRect(-8, -8, 72, 72))
        self.ref_item_delete.setStyleSheet("font: 75 18pt \"KoPubWorld돋움체 Bold\";\n"
                                           "color: #45423C;\n"
                                           "background-color: rgba(0,0,0,0);\n"
                                           "border: 0px;")
        self.ref_item_delete.setObjectName("ref_item_delete")

        self.ref_item_picture = QPushButton(self)
        self.ref_item_picture.setGeometry(QRect(0, 0, 248, 192))
        # self.ref_item_picture.setStyleSheet("border-image: url(img/category2/고구마.jpg);\n")
        #self.ref_item_picture.setStyleSheet("background-color: #FFFFFF;\n"
        #                                    "border-image: url(img/category2/고구마.jpg);\n"
        #                                    "border: 0px;")
        self.ref_item_picture.setText("")
        self.ref_item_picture.setObjectName("ref_item_picture")

        self.ref_item_name = QLabel(self)
        self.ref_item_name.setGeometry(QRect(272, 16, 321, 41))
        font = QtGui.QFont()
        font.setFamily("KoPubWorld돋움체 Bold")
        font.setWeight(75)
        font.setPointSize(26)
        self.ref_item_name.setFont(font)
        self.ref_item_name.setStyleSheet("background-color: rgba(0,0,0,0);\n"
                                         "color: #45423C;")
        self.ref_item_name.setObjectName("ref_item_name")

        self.ref_item_category = QLabel(self)
        self.ref_item_category.setGeometry(QRect(272, 56, 137, 33))
        self.ref_item_category.setStyleSheet("font: 20pt \"KoPubWorld돋움체 Medium\";\n"
                                             "color: #45423C;\n"
                                             "background-color: rgba(0,0,0,0);")
        self.ref_item_category.setObjectName("ref_item_category")

        self.ref_item_day = QLabel(self)
        self.ref_item_day.setGeometry(QRect(272, 136, 105, 36))
        font = QtGui.QFont()
        font.setFamily("KoPubWorld돋움체 Bold")
        font.setWeight(75)
        font.setPointSize(20)
        self.ref_item_day.setFont(font)
        self.ref_item_day.setStyleSheet("color: #ffffff;\n"
                                        "text-align: center;\n"
                                        "width: 120px;\n"
                                        "height: 40px;\n"
                                        "padding-top: 2px;\n"
                                        "background-color: #8DB554;\n"
                                        "border-radius: 15px;")
        self.ref_item_day.setAlignment(Qt.AlignCenter)
        self.ref_item_day.setObjectName("ref_item_day")

        self.ref_item_count = QLabel(self)
        self.ref_item_count.setGeometry(QRect(456, 72, 105, 49))
        font = QtGui.QFont()
        font.setFamily("KoPubWorld돋움체 Bold")
        font.setWeight(75)
        font.setPointSize(32)
        self.ref_item_count.setFont(font)
        self.ref_item_count.setStyleSheet("color: #45423C;\n"
                                          "background-color: rgba(0,0,0,0);")
        self.ref_item_count.setAlignment(Qt.AlignCenter)
        self.ref_item_count.setObjectName("ref_item_count")

        self.ref_item_minus = QPushButton(self)
        self.ref_item_minus.setGeometry(QRect(400, 56, 80, 80))
        font = QtGui.QFont()
        font.setFamily("KoPubWorld돋움체 Bold")
        font.setWeight(75)
        font.setPointSize(32)
        self.ref_item_minus.setFont(font)
        self.ref_item_minus.setStyleSheet("color: #F9BC15;\n"
                                          "background-color: rgba(0,0,0,0);\n"
                                          "border: 0px;")
        self.ref_item_minus.setObjectName("ref_item_minus")

        self.ref_item_plus = QPushButton(self)
        self.ref_item_plus.setGeometry(QRect(536, 56, 80, 80))
        font = QtGui.QFont()
        font.setFamily("KoPubWorld돋움체 Bold")
        font.setWeight(75)
        font.setPointSize(32)
        self.ref_item_plus.setFont(font)
        self.ref_item_plus.setStyleSheet("color: #F9BC15;\n"
                                         "background-color: rgba(0,0,0,0);\n"
                                         "border: 0px;")
        self.ref_item_plus.setObjectName("ref_item_plus")

        self.ref_item_container.raise_()
        self.ref_item_picture.raise_()
        self.ref_item_delete.raise_()
        self.ref_item_name.raise_()
        self.ref_item_category.raise_()
        self.ref_item_day.raise_()
        self.ref_item_count.raise_()
        self.ref_item_minus.raise_()
        self.ref_item_plus.raise_()

        # slot connect
        self.ref_item_minus.clicked.connect(self.clicked_minus)
        self.ref_item_plus.clicked.connect(self.clicked_plus)
        self.ref_item_delete.clicked.connect(self.clicked_delete)

        self.retranslateUi()

    def retranslateUi(self):
        _translate = QCoreApplication.translate
        self.setWindowTitle(_translate("ref_item", "Form"))
        self.ref_item_delete.setText(_translate("ref_item", "X"))
        self.ref_item_name.setText(_translate("ref_item", "제품명"))
        self.ref_item_category.setText(_translate("ref_item", "분류"))
        self.ref_item_day.setText(_translate("ref_item", "D-0"))
        self.ref_item_count.setText(_translate("ref_item", "0"))
        self.ref_item_minus.setText(_translate("ref_item", "-"))
        self.ref_item_plus.setText(_translate("ref_item", "+"))

    def set_upID(self, ID):
        self.upID = ID

    def set_ref_item_name(self, name):
        self.ref_item_name.setText(QCoreApplication.translate("ref_item", name))

    def set_ref_item_category(self, name):
        self.ref_item_category.setText(QCoreApplication.translate("ref_item", name))

    def set_ref_item_day(self, day):
        self.ref_item_day.setText(QCoreApplication.translate("ref_item", day))

    def set_ref_item_count(self, count):
        self.ref_item_count.setText(QCoreApplication.translate("ref_item", count))

    def clicked_minus(self):
        count = int(self.ref_item_count.text())
        if count > 0:
            count -= 1
            self.ref_item_count.setText(str(count))

    def clicked_plus(self):
        count = int(self.ref_item_count.text())
        if count < 1000:
            count += 1
            self.ref_item_count.setText(str(count))

    def clicked_delete(self):
        print("delete")
        print(self.upID)
        refDB.del_UserProducts(self.upID)
