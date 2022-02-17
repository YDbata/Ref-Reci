from PyQt5.QtWidgets import *
from PyQt5.uic import *
from PyQt5 import QtWidgets
from PyQt5.QtCore import *
import RPi.GPIO as GPIO
from ref_item import RefItem
from recipe_item import ReciItem
from encoder import EncoderThread
from db import DB
import barcode_reader
import voice
import sys
import datetime
import time


## 전역변수
# 유저정보
# USER_ID - 나중에 텍스트로 빼든지 할 것
USER_ID = 0
USER_NAME = ""

# 대분류 튜플
category_list = ('육류', '채소류', '해물류', '달걀/유제품', '가공식품류', '곡류', '밀가루', '건어물류', '버섯류', '향신료/조미료류', '과일류', '소스류', '발효식품', '기타')

# 오늘 날짜
today = datetime.date.today()
print(today)

# GPIO set
LED = 23
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(LED, GPIO.OUT)
GPIO.output(LED, False)

# encoder thread
tm = QTimer()
tm_login = QTimer()
# encoderThread = EncoderThread()


# 0 start
class StartWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        loadUi("h_start.ui", self)
        # self.main()

    # def main(self):
    #     pass

    def clicked_login(self):
        pass


isLogin = 0
def login():
    global isLogin
    if isLogin == 0:
        # QR Login
        global USER_ID
        GPIO.output(LED, True)
        barcode_reader.barcode_recognition()
        f = open("user.txt", "r")
        USER_ID = int(f.read())
        # 나중에 바코드 예외처리 해줄 것
        GPIO.output(LED, False)
        # 유저 정보 불러오기
        global USER_NAME
        USER_NAME = refDB.get_User_Name(USER_ID)
        #self.hide()
        QCoreApplication.instance().quit()
        isLogin = 1
    else:
        tm_login.stop()



# 1 ref_list
class RefListWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        loadUi("h_ref_list.ui", self)
        # USER_NAME의 냉장고 리스트
        self.title.setText("{}의 냉장고".format(USER_NAME))
        # 냉장고 목록 정렬
        self.ref_list_sort_list = ['등록순', '유통기한순', '이름순', '이름역순']
        self.ref_list_sort_index = 0
        # 냉장고 목록 받아올 리스트
        self.ref_list_list = []                         # DB에서 딕셔너리로 받아오는 리스트
        self.ref_item_list = []                         # GUI에서 재료 카드를 담는 리스트
        # 냉장고 리스트 스크롤 영역
        self.scroll = QScrollArea(self)
        # 리스트 모드 -> 0 / 선택 모드 -> 1
        self.mode = 0
        # 선택모드는 숨김
        self.title_recipe.setEnabled(False)
        self.title_back.hide()
        self.title_recipe.hide()
        # 재료 선택 리스트
        self.selected_item = []
        self.selected_item_name = []
        self.selected_item_id = []
        self.selected_scroll = QScrollArea(self)
        self.selected_scroll.setGeometry(16, 192, 1248, 60)
        self.selected_scroll.setStyleSheet("border: 0px;")
        self.selected_scroll.hide()
        # 카테고리 pushbutton 리스트화
        self.title_category_list = (self.category_all, self.category_meat, self.category_vegi, self.category_fish, self.category_egg, self.category_other)
        self.title_category_index = 0
        self.main()
        # encoder signal 연결
        encoderConnectThread.sw_0.connect(self.encoder_sw)
        encoderConnectThread.dir_0.connect(self.encoder_dir)
        self.list_focus_index = 1
        self.focused = 0


    def main(self):
        self.read_ref_list()
    
    # DB에서 사용자의 냉장고 리스트를 불러오기
    def read_ref_list(self):
        self.clear_list()
        # 카테고리 선택에 따른 제품 목록 리스트로 가져오기
        # item_name, item_count, item_createDay, item_category1
        if self.title_category_index == 0:
            # 전체 선택시
            self.ref_list_list = refDB.get_UserProducts(USER_ID)
        elif self.title_category_index == 5:
            # 기타 선택시
            self.ref_list_list = refDB.get_UserProducts_Classifi1_Extra(USER_ID)
        else:
            # 카테고리 선택시
            self.ref_list_list = refDB.get_UserProducts_Classifi1(USER_ID, self.title_category_index)
        #print(self.title_category_index)
        #print("새로 불러온 리스트")
        #print(self.ref_list_list)

        # 정렬
        if self.ref_list_sort_index == 1:
            now = datetime.date(1000, 1, 1)
            for ref_list in self.ref_list_list:
                if ref_list['item_expDay'] == None:
                    ref_list['item_expDay'] = now
            # 유통기한순
            self.ref_list_list = sorted(self.ref_list_list, key=lambda item: (item['item_expDay']))
            for ref_list in self.ref_list_list:
                if ref_list['item_expDay'] == now:
                    ref_list['item_expDay'] = None
        elif self.ref_list_sort_index == 2:
            # 이름순
            self.ref_list_list = sorted(self.ref_list_list, key=lambda item: (item['item_name']))
        elif self.ref_list_sort_index == 3:
            # 이름역순
            self.ref_list_list = sorted(self.ref_list_list, key=lambda item: (item['item_name']), reverse=True)



        #print("정렬 후")
        #print(self.ref_list_list)

        self.count = len(self.ref_list_list)
        self.ref_list_count.setText('총 %d개' % self.count)
        # 리스트가 없다면 빈 화면
        if self.count == 0:
            print("there is no ingredient")
        # 리스트가 있다면 끝까지 그리기
        else:
            self.draw_ref_list()

    # 받아온 리스트를 ui에 그리기
    def draw_ref_list(self):
        print("리스트 그리기")
        # GridLayout 생성 및 조정
        ref_list_layout = QGridLayout()
        ref_list_layout.setContentsMargins(16, 16, 16, 16)
        ref_list_layout.setColumnMinimumWidth(0, 610)
        ref_list_layout.setColumnMinimumWidth(1, 610)
        for i in range(int(self.count / 2) + 1):
            ref_list_layout.setRowMinimumHeight(i, 200)
            # print(i)

        # 위젯 그룹에 리스트 카드 하나씩 넣기
        ref_list_groupBox = QGroupBox("")          # GUI에서 카드를 담는 그룹박스
        for i in range(self.count):
            self.ref_item_list.append(RefItem())
            # 데이터 플로팅
            # print(self.ref_list_list[i]['item_category2'])
            # print("border-image: url(img/category2/%s.jpg)" % self.ref_list_list[i]['item_category2'])
            self.ref_item_list[i].set_upID(self.ref_list_list[i]['upID'])
            self.ref_item_list[i].ref_item_picture.setStyleSheet("border-image: url(img/category2/{}.jpg);\n".format(self.ref_list_list[i]['item_category2']))
            self.ref_item_list[i].set_ref_item_name(self.ref_list_list[i]['item_name'])
            self.ref_item_list[i].set_ref_item_category(self.ref_list_list[i]['item_category1'])

            if self.ref_list_list[i]['item_expDay']:
                self.dday = self.ref_list_list[i]['item_expDay'] - today
                # print(self.dday)
                # print(self.dday.days)
                dday_int = int(self.dday.days)
                if dday_int >= 0:
                    self.ref_item_list[i].set_ref_item_day("D-{}".format(dday_int))
                    self.ref_item_list[i].ref_item_day.setStyleSheet("color: #ffffff;\n"
                                                                     "text-align: center;\n"
                                                                     "width: 120px;\n"
                                                                     "height: 40px;\n"
                                                                     "padding-top: 2px;\n"
                                                                     "background-color: #29C6EF;\n"
                                                                     "border-radius: 15px;")
                else:
                    dday_int *= -1
                    self.ref_item_list[i].set_ref_item_day("D+{}".format(dday_int))
                    self.ref_item_list[i].ref_item_day.setStyleSheet("color: #ffffff;\n"
                                                                     "text-align: center;\n"
                                                                     "width: 120px;\n"
                                                                     "height: 40px;\n"
                                                                     "padding-top: 2px;\n"
                                                                     "background-color: #FE3C25;\n"
                                                                     "border-radius: 15px;")
            else:
                self.dday = today - self.ref_list_list[i]['item_createDay']
                self.ref_item_list[i].set_ref_item_day("D+{}".format(int(self.dday.days)))

            self.ref_item_list[i].set_ref_item_count(str(self.ref_list_list[i]['item_count']))
            # click event slot 추가
            self.ref_item_list[i].ref_item_container.clicked.connect(self.clicked_ref_items)
            self.ref_item_list[i].ref_item_picture.clicked.connect(self.clicked_ref_items)
            self.ref_item_list[i].ref_item_delete.clicked.connect(self.clicked_delete)
            ref_list_layout.addWidget(self.ref_item_list[i])
        ref_list_groupBox.setLayout(ref_list_layout)
        #print("생성된 아이템 카드")
        #print(ref_list_groupBox)
        #print(self.ref_item_list)
        ref_list_groupBox.raise_()

        # Scroll Area 생성하여 리스트 집어넣기
        self.scroll.setGeometry(8, 264, 1260, 472)
        self.scroll.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.scroll.setStyleSheet("border: 0px;")
        self.scroll.setWidget(ref_list_groupBox)
        self.scroll.setWidgetResizable(False)
        # scroll.setFixedWidth(1200)
        # scroll.setFixedHeight(500)

    def clear_list(self):
        #trash = QWidget()
        self.scroll.takeWidget()
        self.ref_list_list = []
        self.ref_item_list = []


    def clicked_category(self):
        selected_category = self.sender()
        # print(selected_category)
        # print(self.category_list.index(selected_category)
        new_title_category_index = self.title_category_list.index(selected_category)
        print(self.title_category_index)
        print(new_title_category_index)

        # style sheet 변경
        self.title_category_list[self.title_category_index].setStyleSheet("font: 24pt \"KoPubWorld돋움체 Medium\";\n"
                                                              "color: #A29D97;\n"
                                                              "background-color: rgba(0,0,0,0);\n"
                                                              "border: 2px solid #A29D97;\n"
                                                              "border-radius: 8px;")
        self.title_category_list[new_title_category_index].setStyleSheet("font: 24pt \"KoPubWorld돋움체 Medium\";\n"
                                                              "color: #F19920;\n"
                                                              "background-color: rgba(0,0,0,0);\n"
                                                              "border: 2px solid #F19920;\n"
                                                              "border-radius: 8px;")

        self.title_category_index = new_title_category_index
        # 표시 변경
        self.read_ref_list()


    # 리스트 모드 - Add 버튼 클릭 시
    def clicked_title_add(self):
        #global encoderThread
        #encoderThread.start()
        mainWidget.setCurrentIndex(mainWidget.currentIndex() + 1)

    # 리스트 모드 - Search 버튼 클릭 시
    def clicked_title_search(self):
        self.mode = 1
        ## 화면설정
        # 기존 위젯 숨김
        self.title_search.hide()
        self.title_add.hide()
        self.ref_list_count.hide()
        self.ref_list_sort.hide()

        # 선택화면 용 위젯 표시
        self.title_back.show()
        self.title_recipe.show()
        self.selected_scroll.show()


    def clicked_sort(self):
        if self.ref_list_sort_index == len(self.ref_list_sort_list) - 1:
            self.ref_list_sort_index = 0
        else:
            self.ref_list_sort_index += 1

        self.ref_list_sort.setText(self.ref_list_sort_list[self.ref_list_sort_index])
        self.read_ref_list()



    def clicked_ref_items(self):
        ## 선택한 재료 표시
        sender = self.sender()
        #print(sender)

        # 리스트 모드 -> 다이얼로 수량 조정 가능


        # 선택 모드 -> 뱃지 생성
        if self.mode == 1:
            # 클릭한 재료가 무엇인지 판별 -> 기존 선택 목록에 없으면 추가
            for i in range(self.count):
                if sender == self.ref_item_list[i].ref_item_container or sender == self.ref_item_list[i].ref_item_picture:
                    if self.ref_list_list[i]['item_category2'] not in self.selected_item_name:
                        self.selected_item_name.append(self.ref_list_list[i]['item_category2'])
                        self.selected_item_id.append(self.ref_list_list[i]['item_category2_id'])
                        break

            # 선택된 재료가 하나 이상일 경우 레시피 검색 버튼 활성화
            if len(self.selected_item_name) != 0:
                self.title_recipe.setEnabled(True)

        self.draw_selected()


    # 클릭 시 만들어진 선택 목록을 그리는 함수
    def draw_selected(self):
        print("선택된 재료")
        print(self.selected_item_name)
        # 레이아웃 생성 및 조정
        selected_layout = QGridLayout()
        selected_layout.setContentsMargins(16, 0, 16, 0)
        selected_layout.setRowMinimumHeight(0, 60)
        # 선택 갯수만큼 열 생성
        for i in range(len(self.selected_item_name)):
            selected_layout.setColumnMinimumWidth(i, 120)

        selected_groupBox = QGroupBox("")
        for i in self.selected_item_name:
            # 버튼 생성
            selected = QPushButton()
            selected.setText(i)
            selected.setMinimumSize(108 + (len(i) * 10), 56)
            selected.setStyleSheet("font: 24pt \"KoPubWorld돋움체 Medium\";\n"
                                   "color: #8DB554;\n"
                                   "background-color: #FFFFFF;\n"
                                   "border: 2px solid #8DB554;\n"
                                   "border-radius: 26px;")
            selected.clicked.connect(self.clicked_selected_item)
            self.selected_item.append(selected)
            selected_layout.addWidget(selected)
        selected_groupBox.setLayout(selected_layout)
        selected_groupBox.raise_()

        # Scroll Area 생성하여 선택 리스트 집어넣기
        self.selected_scroll.setWidget(selected_groupBox)
        self.selected_scroll.setHorizontalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.selected_scroll.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.selected_scroll.setWidgetResizable(False)
        self.selected_scroll.raise_()


    def clicked_selected_item(self):
        sender = self.sender()
        i = self.selected_item_name.index(sender.text())
        self.selected_item_name.remove(sender.text())
        del self.selected_item_id[i]
        self.selected_item = []

        # 선택된 재료가 하나도 없을 때 레시피 버튼 비활성화
        if len(self.selected_item_name) == 0:
            self.title_recipe.setEnabled(False)
        # 선택 재료 리스트 다시 그리기
        self.draw_selected()


    # 선택 모드 - 뒤로가기 클릭 시 =>
    def clicked_back(self):
        self.mode = 0

        # 선택된 재료 리스트 비우기
        self.selected_item = []
        self.selected_item_name = []
        self.selected_item_id = []

        # 선택화면 용 위젯 숨김
        self.title_back.hide()
        self.title_recipe.hide()
        self.selected_scroll.takeWidget()
        self.selected_scroll.hide()

        # 기존 다시 표시
        self.title_search.show()
        self.title_add.show()
        self.ref_list_count.show()
        self.ref_list_sort.show()

    # 선택 모드 - 레시피 클릭 시 => 선택된 재료로 레시피 검색
    def clicked_recipe(self):
        mainWidget.setCurrentIndex(mainWidget.currentIndex() + 2)
        searchWindow.read_recipe_result()

    def clicked_delete(self):
        print("delete")
        sender = self.sender()
        delete_index = -1
        for i in range(len(self.ref_item_list)):
            if self.ref_item_list[i].ref_item_delete == sender:
                print(i)
                delete_index = i
        # print(self.upID)
        refDB.del_UserProducts(self.ref_item_list[delete_index].upID)
        self.read_ref_list()

    def encoder_sw(self):
        print("LIST SW")
        if self.focused == 0:
            self.ref_item_list[self.list_focus_index].ref_item_container.setStyleSheet("background-color: #F2EDE7;\n"
                                                                                       "border: 2px solid #F19920")
            self.focused = 1
        else:
            self.ref_item_list[self.list_focus_index].ref_item_container.setStyleSheet("background-color: #F2EDE7;\n"
                                                                                       "border: 2px solid #CCCCCC")

            self.focused = 0


    def encoder_dir(self, direction):
        print("LIST ROTATE")

        # 0_ semi focus: 제품간 이동
        if self.focused == 0:
            self.ref_item_list[self.list_focus_index].ref_item_container.setStyleSheet("background-color: #F2EDE7;\n"
                                                                                       "border: 0px;")
            if direction == 1:
                if self.list_focus_index == len(self.ref_item_list) - 1:
                    self.list_focus_index = 0
                else:
                    self.list_focus_index += 1
                if self.list_focus_index % 2 == 0:
                    self.scroll.verticalScrollBar().setValue(192 * self.list_focus_index / 2)
            elif direction == -1:
                if self.list_focus_index == 0:
                    self.list_focus_index = len(self.ref_item_list) - 1
                else:
                    self.list_focus_index -= 1
                if self.list_focus_index % 2 == 1:
                    self.scroll.verticalScrollBar().setValue(192 * (self.list_focus_index - 1) / 2)
            self.ref_item_list[self.list_focus_index].ref_item_container.setStyleSheet("background-color: #F2EDE7;\n"
                                                                                       "border: 2px solid #CCCCCC;")

        # 1_ focus: 수량 변경
        if self.focused == 1:
            if direction == 1:
                self.ref_item_list[self.list_focus_index].clicked_plus()
            elif direction == -1:
                self.ref_item_list[self.list_focus_index].clicked_minus()


# 2 add items
class AddWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        loadUi("h_ref_add.ui", self)

        self.add_item_category2 = ""
        # 추가 화면 초기화
        self.count = int(self.add_item_count.text())
        self.category_index = -1
        self.today_str = today.strftime('%Y-%m-%d')
        self.add_item_createDay.setText(self.today_str)
        # self.add_item_expDay.setText(self.today_str)
        # 소분류 리스트 초기화
        self.name_list = []
        self.name_list_index = 0
        self.main()
        # 수량 단위 버튼 리스트
        self.btn_num_list = (self.add_item_1, self.add_item_10, self.add_item_100)
        self.count_unit = (1, 10, 100)
        self.btn_num_index = 0
        # encoder signal 연결
        encoderConnectThread.sw_1.connect(self.encoder_sw)
        encoderConnectThread.dir_1.connect(self.encoder_dir)
        self.widget_list = [self.add_item_category, self.add_item_name, self.add_item_exp_year, self.add_item_exp_month,
                            self.add_item_exp_day, self.add_item_count, self.add_item_next]
        self.widget_list_index = 0
        self.widget_list[0].setFocus()


    def main(self):
        pass

    # 냉장고 리스트로 돌아가기
    def clicked_back(self):
        self.reset_all()
        refListWindow.read_ref_list()
        mainWidget.setCurrentIndex(mainWidget.currentIndex() - 1)

    # 화면에 표시된 내용을 DB에 추가
    def clicked_next(self):
        # 저장된 내용을 DB에 넣는 쿼리문 추가
        data = dict()
        data['user_id'] = USER_ID
        data['item_name'] = self.add_item_name.text()
        data['item_category1'] = self.add_item_category.text()
        data['item_category2'] = self.add_item_category2
        data['item_expDay'] = "%s-%s-%s" % (self.add_item_exp_year.text(), self.add_item_exp_month.text(), self.add_item_exp_day.text())
        data['item_count'] = int(self.add_item_count.text())
        data['item_image'] = "{}.jpg".format(self.add_item_category2)
        data['item_category1_id'] = self.category_index + 1
        classifi2_idx = refDB.get_Classifi2_id(data['item_category2'])
        data['item_category2_id'] = classifi2_idx
        #print([data])
        refDB.add_UserProducts([data])
        self.reset_all()

    # 음성인식 입력 모드
    def clicked_voice(self):
        print("voice recognition start!!")
        self.voice_btn.setEnabled(False)
        self.barcode_btn.setEnabled(False)
        item_name = voice.run()
        print(item_name)

        # 바코드 API 성공하면
        if item_name != -1:
            self.set_category2(item_name)

        # 바코드 API 실패하면
        else:
            msg = QMessageBox()
            msg.setWindowTitle("알림")
            msg.setText("인식에 실패하였습니다.")
            msg.setStyleSheet("font-size: 24px")
            msg.exec_()

        self.voice_btn.setEnabled(True)
        self.barcode_btn.setEnabled(True)

    # 바코드 입력 모드
    def clicked_barcode(self):
        print("barcode reader start!!")
        self.voice_btn.setEnabled(False)
        self.barcode_btn.setEnabled(False)
        # 바코드 조명 켜기
        GPIO.output(LED, True)
        # 바코드 리더 함수 호출 - 제품명 가져오기
        item_name = barcode_reader.barcode_recognition()
        
        # 바코드 API 성공하면
        if item_name != -1:
            self.set_category2(item_name)
        # 바코드 API 실패하면
        else:
            msg = QMessageBox()
            msg.setWindowTitle("알림")
            msg.setText("등록되지 않은 바코드입니다.")
            msg.setStyleSheet("font-size: 24px")
            msg.exec_()

        self.voice_btn.setEnabled(True)
        self.barcode_btn.setEnabled(True)
        GPIO.output(LED, False)

    def set_category2(self, item_name):
        # 제품명으로 소분류, 대분류 찾기
        result = refDB.get_Product_category(item_name)

        # 소분류 찾기가 성공하면
        if len(result) != 0:
            # print(result[-1])
            self.add_item_name.setText(item_name)
            self.add_item_category.setText(result[-1][0])
            self.add_item_count.setText("1")
            self.add_item_category2 = result[-1][2]
            self.category_index = result[-1][4] - 1
            # self.name_list_index = result[-1][5]
            self.add_item_image.setStyleSheet("border-image: url(img/category2/%s)" % result[-1][3])
        else:
            msg = QMessageBox()
            msg.setWindowTitle("알림")
            msg.setText("등록되지 않은 제품군입니다.")
            msg.setStyleSheet("font-size: 24px")
            msg.exec_()

    # 뒤로가기, 다음 버튼 클릭 시 모든 값 초기화
    def reset_all(self):
        self.add_item_image.setStyleSheet("background-color: #FFFFFF")
        self.add_item_category.setText("제품분류")
        self.add_item_name.setText("제품명")
        self.add_item_createDay.setText(self.today_str)
        self.add_item_expDay.setText(self.today_str)
        self.add_item_exp_year.setText("0000")
        self.add_item_exp_month.setText("00")
        self.add_item_exp_day.setText("00")
        self.add_item_count.setText("0")
        self.category_index = -1
        self.name_list_index = 0
        self.count = 0
        # encoder
        self.widget_list_index = 0

    # 제품분류 클릭시 대분류 이동
    def clicked_category(self):
        if self.category_index == len(category_list) - 1:
            self.category_index = 0
        else:
            self.category_index += 1

        # 대분류 안의 소분류 불러오기
        self.name_list = refDB.get_Classifi1_To_Classifi2(category_list[self.category_index])
        #print(self.name_list)
        # 소분류 인덱스 초기화 - 대분류가 바뀔 때 마다 인덱스 초기화!
        self.name_list_index = 0
        # 대분류 화면에 표시
        self.add_item_category.setText(category_list[self.category_index])

    # 제품명 클릭시 소분류 이동
    def clicked_name(self):
        #print(self.name_list)
        #print(self.name_list_index)
        if self.category_index > -1:
            self.add_item_name.setText(self.name_list[self.name_list_index][1])

        if self.name_list_index == len(self.name_list) - 1:
            self.name_list_index = 0
        else:
            self.name_list_index += 1
        self.add_item_category2 = self.name_list[self.name_list_index - 1][1]
        self.add_item_image.setStyleSheet("border-image: url(img/category2/{});".format(self.name_list[self.name_list_index - 1][2]))

    # 제품 등록일 변경
    def clicked_create(self):
        pass

    # 제품 유통기한 변경
    def clicked_exp(self):
        pass

    def clicked_exp_year(self):
        #print("exp_year")
        if self.add_item_exp_year.text() == "0000":
            self.add_item_exp_year.setText(str(today.year))
        else:
            self.add_item_exp_year.setText(str(int(self.add_item_exp_year.text()) + 1))

    def clicked_exp_month(self):
        #print("exp_month")
        if self.add_item_exp_month.text() == "00":
            self.add_item_exp_month.setText(str(today.month).zfill(2))
        elif self.add_item_exp_month.text() == "12":
            self.add_item_exp_month.setText("01")
        else:
            self.add_item_exp_month.setText(str(int(self.add_item_exp_month.text()) + 1).zfill(2))

    def clicked_exp_day(self):
        #print("exp_day")
        last_day = ""
        if self.add_item_exp_day.text() == "00":
            self.add_item_exp_day.setText(str(today.day).zfill(2))
        else:
            if self.add_item_exp_month.text() in ("01", "03", "05", "07", "08", "10", "12"):
                last_day = "31"
            elif self.add_item_exp_month.text() in ("04", "06", "09", "11"):
                last_day = "30"
            else:
                # 윤년
                if int(self.add_item_exp_year.text()) % 4 == 0:
                    last_day = "29"
                else:
                    last_day = "28"
        if self.add_item_exp_day.text() == last_day:
            self.add_item_exp_day.setText("01")
        else:
            self.add_item_exp_day.setText(str(int(self.add_item_exp_day.text()) + 1).zfill(2))

    # 수량 마이너스 - 선택된 단위에 따라
    def clicked_minus(self):
        self.count -= self.count_unit[self.btn_num_index]
        if self.count < 0:
            self.count = 0
        self.add_item_count.setText(str(self.count))

    # 수량 플러스 - 선택된 단위에 따라
    def clicked_plus(self):
        self.count += self.count_unit[self.btn_num_index]
        if self.count > 1000:
            self.count = 1000
        self.add_item_count.setText(str(self.count))

    # 수량 단위 선택 - 1, 10, 100
    def clicked_num(self):
        btn_num = self.sender()
        # print(btn_num)
        new_btn_num_index = self.btn_num_list.index(btn_num)
        # print(new_btn_num_index)

        # 선택되면 스타일시트 변경
        self.btn_num_list[self.btn_num_index].setStyleSheet("font: 24pt \"KoPubWorld돋움체 Medium\"; \n"
                                                            "color:  #F9BC15;\n"
                                                            "background-color:  #FFFFFF;\n"
                                                            "border: 2px solid #F9BC15;\n"
                                                            "border-radius: 26px;")
        self.btn_num_list[new_btn_num_index].setStyleSheet("font: 24pt \"KoPubWorld돋움체 Medium\"; \n"
                                                            "color:  #FFFFFF;\n"
                                                            "background-color:  #F9BC15;\n"
                                                            "border: 2px solid #F9BC15;\n"
                                                            "border-radius: 26px;")

        self.btn_num_index = new_btn_num_index

    def encoder_sw(self):
        print("ADD SW")
        if self.widget_list_index == len(self.widget_list) - 1:
            self.widget_list_index = 0
        else:
            self.widget_list_index += 1
        self.widget_list[self.widget_list_index].setFocus()


    def encoder_dir(self, direction):
        print("ADD ROTATE")
        # category
        if self.widget_list_index == 0:
            if direction == 1:
                if self.category_index == len(category_list) - 1:
                    self.category_index = 0
                else:
                    self.category_index += 1
            elif direction == -1:
                if self.category_index == 0:
                    self.category_index = len(category_list) - 1
                else:
                    self.category_index -= 1
            # 대분류 안의 소분류 불러오기
            self.name_list = refDB.get_Classifi1_To_Classifi2(category_list[self.category_index])
            # print(self.name_list)
            # 소분류 인덱스 초기화 - 대분류가 바뀔 때 마다 인덱스 초기화!
            self.name_list_index = 0
            # 대분류 화면에 표시
            self.add_item_category.setText(category_list[self.category_index])

        # name
        elif self.widget_list_index == 1:
            if self.category_index > -1:
                self.add_item_name.setText(self.name_list[self.name_list_index][1])
                self.add_item_category2 = self.name_list[self.name_list_index][1]
                self.add_item_image.setStyleSheet(
                    "border-image: url(img/category2/{});".format(self.name_list[self.name_list_index][2]))

            if direction == 1:
                if self.name_list_index == len(self.name_list) - 1:
                    self.name_list_index = 0
                else:
                    self.name_list_index += 1
            elif direction == -1:
                if self.name_list_index == 0:
                    self.name_list_index = len(self.name_list) - 1
                else:
                    self.name_list_index -= 1


        # exp_year
        elif self.widget_list_index == 2:
            if self.add_item_exp_year.text() == "0000":
                self.add_item_exp_year.setText(str(today.year))
            else:
                if direction == 1:
                    self.add_item_exp_year.setText(str(int(self.add_item_exp_year.text()) + 1))
                elif direction == -1:
                    self.add_item_exp_year.setText(str(int(self.add_item_exp_year.text()) - 1))

        # exp_month
        elif self.widget_list_index == 3:
            if self.add_item_exp_month.text() == "00":
                self.add_item_exp_month.setText(str(today.month).zfill(2))
            else:
                if direction == 1:
                    if self.add_item_exp_month.text() == "12":
                        self.add_item_exp_month.setText("01")
                    else:
                        self.add_item_exp_month.setText(str(int(self.add_item_exp_month.text()) + 1).zfill(2))
                elif direction == -1:
                    if self.add_item_exp_month.text() == "01":
                        self.add_item_exp_month.setText("12")
                    else:
                        self.add_item_exp_month.setText(str(int(self.add_item_exp_month.text()) - 1).zfill(2))

        # exp_day
        elif self.widget_list_index == 4:
            last_day = ""
            if self.add_item_exp_day.text() == "00":
                self.add_item_exp_day.setText(str(today.day).zfill(2))
            else:
                if self.add_item_exp_month.text() in ("01", "03", "05", "07", "08", "10", "12"):
                    last_day = "31"
                elif self.add_item_exp_month.text() in ("04", "06", "09", "11"):
                    last_day = "30"
                else:
                    # 윤년
                    if int(self.add_item_exp_year.text()) % 4 == 0:
                        last_day = "29"
                    else:
                        last_day = "28"

                if direction == 1:
                    if self.add_item_exp_day.text() == last_day:
                        self.add_item_exp_day.setText("01")
                    else:
                        self.add_item_exp_day.setText(str(int(self.add_item_exp_day.text()) + 1).zfill(2))
                elif direction == -1:
                    if self.add_item_exp_day.text() == "01":
                        self.add_item_exp_day.setText(last_day)
                    else:
                        self.add_item_exp_day.setText(str(int(self.add_item_exp_day.text()) - 1).zfill(2))

        # count
        elif self.widget_list_index == 5:
            if direction == 1:
                self.clicked_plus()
            elif direction == -1:
                self.clicked_minus()

        # next
        elif self.widget_list_index == 6:
            self.clicked_next()


# 3 search items
class SearchWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        loadUi("h_recipe_list.ui", self)
        self.recipe_result = []         # 레시피 검색 결과 딕셔너리 리스트
        self.recipe_item_list = []      # GUI 검색 결과를 담는 카드 리스트
        # 검색 결과 스크롤 영역
        self.recipe_scroll = QScrollArea(self)
        self.recipe_scroll.setGeometry(24, 176, 1260, 528)
        self.recipe_scroll.setVerticalScrollBarPolicy(Qt.ScrollBarAlwaysOff)
        self.recipe_scroll.setStyleSheet("border: 0px;")
        self.main()

    def main(self):
        pass

    def read_recipe_result(self):
        # 레시피 검색 결과 불러오기
        if len(refListWindow.selected_item_id) == 1:
            self.recipe_result = refDB.get_recipe(refListWindow.selected_item_id[0])
        else:
            self.recipe_result = refDB.get_recipe(tuple(refListWindow.selected_item_id))
        print("레시피 검색 결과")
        # print(self.recipe_result)

        # 총 n개
        self.recipe_count.setText("총 {}개".format(len(self.recipe_result)))

        # 검색 결과 그리기
        self.draw_recipe_result()

    def draw_recipe_result(self):
        print("검색 결과 그리기")
        # GridLayout 생성 및 조정
        recipe_layout = QGridLayout()
        recipe_layout.setContentsMargins(0, 0, 0, 16)
        recipe_layout.setColumnMinimumWidth(0, 1232)
        for i in range(int(len(self.recipe_result))):
            recipe_layout.setRowMinimumHeight(i, 200)
        print("레시피 총 개수")
        # print(len(self.recipe_result))
        # print(len(self.recipe_item_list))
        self.recipe_item_list = []
        # 위젯 그룹에 리스트 카드 하나씩 넣기
        recipe_groupBox = QGroupBox("")
        for i in range(len(self.recipe_result)):
            print(self.recipe_result[i]['recipe_id'])
            ingre = refDB.get_recipe_ingre(self.recipe_result[i]['recipe_id'])
            print(', '.join(ingre))
            if i == 50:
                break
            self.recipe_item_list.append(ReciItem())
            # 데이터 플로팅
            # print(self.recipe_item_list[i],self.recipe_item_list[i].recipe_item_name )
            # print(self.recipe_result[i]['recipe_name'])
            self.recipe_item_list[i].recipe_item_name.setText(self.recipe_result[i]['recipe_name'])
            self.recipe_item_list[i].recipe_item_time.setText(self.recipe_result[i]['recipe_time'].split(' ')[0])
            self.recipe_item_list[i].recipe_item_time.setGeometry(QRect(len(self.recipe_result[i]['recipe_name']) * 28 + 312, 16, 80, 40))
            self.recipe_item_list[i].recipe_item_ingre.setText(', '.join(ingre))
            self.recipe_item_list[i].recipe_item_intro.setText(self.recipe_result[i]['recipe_intro'])
            self.recipe_item_list[i].recipe_item_picture.setStyleSheet("background-color: #FFFFFF;\n"
                                                                       "border-image: url(img/recipe/{});\n"
                                                                       "border: 0px;".format(self.recipe_result[i]['recipe_image']))
            self.recipe_item_list[i].recipe_item_picture.clicked.connect(self.clicked_item)
            self.recipe_item_list[i].recipe_item_container.clicked.connect(self.clicked_item)
            recipe_layout.addWidget(self.recipe_item_list[i])
        recipe_groupBox.setLayout(recipe_layout)
        self.recipe_scroll.setWidget(recipe_groupBox)

        # self.scroll.setWidgetResizable(False)

    def clicked_item(self):
        reci_id = 0
        sender = self.sender()
        print(sender)
        for i in range(len(self.recipe_result)):
            if sender == self.recipe_item_list[i].recipe_item_picture or sender == self.recipe_item_list[i].recipe_item_container:
                reci_id = self.recipe_result[i]['recipe_id']
                break
        print(reci_id)
        mainWidget.setCurrentIndex(mainWidget.currentIndex() + 1)
        detailWindow.draw_detail(reci_id)

    def clear_list(self):
        self.recipe_scroll.takeWidget()
        self.recipe_result = []
        self.recipe_item_list = []

    def clicked_back(self):
        self.clear_list
        mainWidget.setCurrentIndex(mainWidget.currentIndex() - 2)


# 4 recipe detail
class RecipeDetailWindow(QMainWindow):
    def __init__(self):
        super().__init__()
        loadUi("h_recipe_detail.ui", self)
        self.main()

    def main(self):
        pass

    def clicked_back(self):
        mainWidget.setCurrentIndex(mainWidget.currentIndex() - 1)

    def draw_detail(self, id):
        recipe_detail = refDB.get_detail_recipe(id)
        # print(recipe_detail)
        self.recipe_picture.setStyleSheet("border-image: url(img/recipe/{})".format(recipe_detail['recipe_image']))
        self.recipe_item_name.setText(recipe_detail['recipe_name'])
        recipe_text = ""
        for i in range(1, len(recipe_detail) - 8):
            recipe_text += "{}. ".format(i) + recipe_detail[i]['phase_intro'] + "\n"
        self.recipe_item_text.setText(recipe_text)
        recipe_ingre = ""
        for i in range(len(recipe_detail['ingredient'])):
            recipe_ingre += recipe_detail['ingredient'][i][1]
            recipe_ingre += ", "
        self.recipe_item_ingre.setText(recipe_ingre)

class EncoderConnectThread(QThread):
    # encoder signals
    sw_0 = pyqtSignal()
    dir_0 = pyqtSignal(int)
    sw_1 = pyqtSignal()
    dir_1 = pyqtSignal(int)
    sw_2 = pyqtSignal()
    dir_2 = pyqtSignal(int)

    def __init__(self):
        super().__init__()
        self.encoder_th = EncoderThread()
        self.encoder_th.sw_detected.connect(self.connect_sw)
        self.encoder_th.dir_detected.connect(self.connect_direction)

    def run(self):
        self.encoder_th.start()

    def connect_sw(self):
        now_page = mainWidget.currentIndex()
        # 0_ RefList
        if now_page == 0:
            self.sw_0.emit()
        # 1_ Add
        elif now_page == 1:
            self.sw_1.emit()
        # 2_ Search
        elif now_page == 2:
            self.sw_2.emit()

        # print(mainWidget.currentIndex())

    def connect_direction(self, direction):
        now_page = mainWidget.currentIndex()
        # 0_ RefList
        if now_page == 0:
            self.dir_0.emit(direction)
        # 1_ Add
        elif now_page == 1:
            self.dir_1.emit(direction)
        # 2_ Search
        elif now_page == 2:
            self.dir_2.emit(direction)

        # print(mainWidget.currentIndex())
        # print(direction)

encoderConnectThread = EncoderConnectThread()
isStarted = 0
def welcome():
    global isStarted
    # global USER_NAME
    # msg = QMessageBox()
    # msg.setWindowTitle("Welcome")
    # msg.setText("어서오세요, {}님!".format(USER_NAME))
    # msg.exec_()
    if isStarted == 0:
        encoderConnectThread.start()
        isStarted = 1
    else:
        tm.stop()


# main
if __name__ == "__main__":
    # DB connect
    refDB = DB()

    # main class
    app = QApplication(sys.argv)
    startWindow = StartWindow()
    startWindow.move(0, -24)
    startWindow.show()
    tm_login.setInterval(100)
    tm_login.timeout.connect(login)
    tm_login.start()
    app.exec()

    mainWidget = QtWidgets.QStackedWidget()

    # sizing main widget
    mainWidget.setFixedWidth(1280)
    mainWidget.setFixedHeight(720)
    mainWidget.move(0, -24)

    # create page instances
    refListWindow = RefListWindow()
    addWindow = AddWindow()
    searchWindow = SearchWindow()
    detailWindow = RecipeDetailWindow()

    # add pages to main widget stack
    #mainWidget.addWidget(startWindow)
    mainWidget.addWidget(refListWindow)
    mainWidget.addWidget(addWindow)
    mainWidget.addWidget(searchWindow)
    mainWidget.addWidget(detailWindow)

    mainWidget.show()
    startWindow.hide()

    tm.setInterval(10)
    tm.timeout.connect(welcome)
    tm.start()

    app.exec()