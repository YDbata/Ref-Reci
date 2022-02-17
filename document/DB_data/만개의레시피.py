import time
from bs4 import BeautifulSoup
# from konlpy.tag import Twitter
from PIL import Image
import os
import pymysql
from selenium import webdriver
from math import floor
import pandas as pd
from selenium.webdriver.common.keys import Keys


class recipe_craw():
    def __init__(self, detail_ingre=True, step_image=False):
        self.detail_ingre = detail_ingre
        self.step_image = step_image
        self.recipe_list = dict()
        self.img_num = 0
        self.db = pymysql.connect(
            user='user',
            passwd='a203!',
            host='i5a203.p.ssafy.io',
            db='tmp_refreci',
            charset='utf8',
            port=3306
        )

    def Add_recipe(self, element, count):
        self.img_num += 1
        image_num = str(self.img_num)
        while len(image_num) != 4:
            image_num = "0" + image_num
        # title로 dict생성 및 클릭
        title = element.text
        print(title)
        self.recipe_list[title] = dict()
        # 대표 이미지 url저장
        # noti:--> url 말고 다운 받는걸로 갈까요? DB에 저장하기에 편한게 url일거같아서 이렇게 했는데 다른 의견주시면 그대로 하겠습니다.
        self.recipe_list[title]['title_image'] = driver.find_element_by_css_selector(
            '#stepimg{} > img'.format(count)).get_attribute('src')

        element.click()

        # 재료 부분 (옵션으로 재료 세부사항 저장 가능함)
        self.recipe_list[title]['ingredient'] = dict()

        tmp = driver.find_elements_by_css_selector('#divConfirmedMaterialArea > ul')
        if self.detail_ingre:
            self.recipe_list[title]['ingredient']['필수재료'] = dict()
            self.recipe_list[title]['ingredient']['선택재료'] = dict()

        for t in tmp:
            d_ingre_title = t.find_element_by_css_selector('b').text

            de_ingre = []
            try:
                de_ingre += t.find_elements_by_css_selector('li')
            except:
                pass

            try:
                de_ingre += t.find_elements_by_css_selector('a > li')
            except:
                pass

            if self.detail_ingre:  # 구조 : 재료 :{필수재료:{닭:2마리, 대파:1대...}, 선택재료:{...}}
                if d_ingre_title[1:-1] == '필수 재료' or '필수' in d_ingre_title[1:-1]:
                    cate = '필수재료'
                else:
                    cate = '선택재료'

                for d in de_ingre:
                    dl = d.text.split('\n')
                    self.recipe_list[title]['ingredient'][cate][dl[0]] = dl[1]

            else:  # 구조 재료 : {닭:2마리, 대파:1대, 마늘:3개...}
                for d in de_ingre:
                    dl = d.text.split('\n')
                    self.recipe_list[title]['ingredient'][dl[0]] = dl[1]

        # servings(0인분), time(걸리는 시간)
        summary = driver.find_elements_by_css_selector(
            '#contents_area > div.view2_summary.st3 > div.view2_summary_info > span')
        self.recipe_list[title]['servings'] = summary[0].text[:-2]
        self.recipe_list[title]['time'] = summary[1].text
        self.recipe_list[title]['sub_title'] = driver.find_element_by_css_selector('#recipeIntro').text[:-16]

        # 단계 (옵션으로 단계별 이미지 url 저장할 수 있음)
        if self.step_image:
            self.recipe_list[title]['step'] = dict()  # 구조 step: {1:["~~한다.", url1], 2:["~~한다.", url2], ...}
            steps = 1
            while True:
                try:
                    tmp = driver.find_element_by_css_selector('#stepdescr{}'.format(steps))
                    step_str = tmp.text
                    self.recipe_list[title]['step'][steps] = [step_str]


                    # 이미지 저장
                    try:
                        phase_img = driver.find_element_by_css_selector('#stepimg{} > img'.format(steps)).get_attribute(
                            'src')
                        image_name = "images/{}.jpg".format(image_num + "_" + str(steps))
                        os.system("curl " + phase_img + " > " + image_name)
                    except:
                        self.recipe_list[title]['step'][steps].append("")
                        steps += 1
                        continue

                    im = Image.open(image_name)  # 이미지 불러오기
                    x_size = 250 * 3
                    y_size = 141 * 3
                    im = im.resize((x_size, y_size))
                    # print(steps, int(x_size * 0.07), 0, int(x_size * 0.87), int(y_size * 0.9), x_size, y_size)
                    im = im.crop((int(x_size * 0.07), 0, int(x_size * 0.87), int(y_size * 0.9)))
                    im.save(image_name)  # 이미지 다른 이름으로 저장
                    print(image_name)
                    self.recipe_list[title]['step'][steps].append(image_name.split("/")[1])
                    steps += 1
                except:
                    break
        else:
            self.recipe_list[title]['step'] = []  # 구조 step: ["~~한다.", "~~한다.", ...]
            steps = 1
            while True:
                try:
                    tmp = driver.find_element_by_css_selector('#stepdescr{}'.format(steps))
                    step_str = tmp.text
                    self.recipe_list[title]['step'].append(step_str)

                    steps += 1
                except:
                    break

        # 이미지 저장
        image_name = "images/{}.jpg".format(image_num)
        os.system("curl " + self.recipe_list[title]['title_image'] + " > " + image_name)

        im = Image.open(image_name)  # 이미지 불러오기
        x_size = 250*4
        y_size = 140*4
        im.resize((x_size, y_size))
        im = im.crop((int(x_size*0.07), 0, int(x_size*0.87), int(y_size*0.9)))
        im.save(image_name)  # 이미지 다른 이름으로 저장
        # im.show()  # 이미지 보여주기
        print(self.recipe_list[title]['title_image'])
        print(self.recipe_list[title]['ingredient'])
        print(self.recipe_list[title]['step'])
        self.change_save_sql(title, image_num)
        print("DB완료")

        return element

    def change_save_sql(self, title, image_num):

        cursor = self.db.cursor()
        title_sql = "SELECT recipeName FROM Recipe WHERE recipeName=%s;"
        cursor.execute(title_sql, title)
        result = cursor.fetchall()
        try:
            if title == result[0][0]:
                print("DB exist")
                return 0
        except:
            print("DB insert start")
        # 레시피 기본 DB입력
        self.recipe_list[title]['sub_title'] = self.recipe_list[title]['sub_title'].replace("\n", "")
        recipe_sql = "INSERT INTO Recipe(recipeName, recipeIntroduce, recipeAmount, recipeImage, recipeTime) " \
                     "VALUES(%s, %s, %s, %s, %s);"

        cursor.execute(recipe_sql, (title, self.recipe_list[title]['sub_title'],
                                    int(self.recipe_list[title]['servings']), image_num+".jpg",
                                    self.recipe_list[title]['time']))
        self.db.commit()

        recipeID_sql = "SELECT rID FROM Recipe WHERE recipeName=%s;"
        cursor.execute(recipeID_sql, title)

        result = cursor.fetchall()
        print("sql rID", result)
        recipeID = int(result[0][0])

        # 레시피 단계 DB입력
        steps = 1
        while True:
            try:
                self.recipe_list[title]['step'][steps][0].replace("\n", "")
                phase_sql = ("INSERT INTO RecipePhase(rID, recipephaseIntroduce, recipephaseImage) " +
                             "VALUES({}, '{}', '{}');".format(recipeID, self.recipe_list[title]['step'][steps][0],
                                                              self.recipe_list[title]['step'][steps][1]))
                cursor.execute(phase_sql)
                self.db.commit()
                steps += 1
            except:
                print("단계가 안들어가", steps)
                break

        # ingredient_sql = "SELECT iID FROM `ingredient` WHERE ingredientName={};".format(title)
        for k, v in self.recipe_list[title]['ingredient']['필수재료'].items():
            print(k,v)
            # 재료에 이미 있는지 확인
            ingredient_check = "SELECT COUNT(*) FROM Ingredient WHERE ingredientName='{}';".format(k)
            cursor.execute(ingredient_check)

            if cursor.fetchall()[0][0] == 0:
                ingredient_add = "INSERT INTO Ingredient(ingredientName) VALUES('{}');".format(k)
                cursor.execute(ingredient_add)
                self.db.commit()

            # 재료 iID검색
            ingredient_sql = "SELECT iID FROM Ingredient WHERE ingredientName='{}';".format(k)
            cursor.execute(ingredient_sql)
            ingredient_id = cursor.fetchall()[0][0]

            cursor.execute("INSERT INTO RecipeIngredient(rID, iID, ingredientAmount) VALUES({}, {}, '{}');"
                           .format(recipeID, ingredient_id, v))
            self.db.commit()

        for k, v in self.recipe_list[title]['ingredient']['선택재료'].items():
            # 재료에 이미 있는지 확인
            ingredient_check = "SELECT COUNT(*) FROM Ingredient WHERE ingredientName='{}';".format(k)
            cursor.execute(ingredient_check)

            if cursor.fetchall()[0][0] == 0:
                ingredient_add = "INSERT INTO Ingredient(ingredientName) VALUES('{}');".format(k)
                cursor.execute(ingredient_add)
                self.db.commit()

            # 재료 iID검색
            ingredient_sql = "SELECT iID FROM Ingredient WHERE ingredientName='{}';".format(k)
            cursor.execute(ingredient_sql)
            ingredient_id = cursor.fetchall()[0][0]

            cursor.execute("INSERT INTO RecipeIngredient(rID, iID, ingredientAmount) VALUES({}, {}, '{}');"
                           .format(recipeID, ingredient_id, v))
        self.db.commit()


if __name__ == '__main__':
    # 파일 초기화
    f = open('recipe_sql.txt', 'w')
    f.close()

    # 크롤링할 url 주소
    bookname = "레시피"
    url = "https://www.10000recipe.com/index.html/"
    # 다운로드 받은 driver 주소
    DRIVER_DIR = 'C:/Ddrive/chromedriver/chromedriver'
    # 크롬 드라이버를 이용해 임의로 크롬 브라우저를 실행시켜 조작한다.
    driver = webdriver.Chrome(DRIVER_DIR)
    # 암묵적으로 웹 자원을 (최대) 5초 기다리기
    driver.implicitly_wait(2)
    # 크롬 브라우저가 실행되며 해당 url로 이동한다.
    driver.get(url)

    # 하이퍼 파라미터 정의
    # min_page : 시작 페이지     max_page : 끝 페이지(크롤링 범위) 적어도 2이상
    min_page = 1
    max_page = 8

    # 들어갈려는 카테고리
    cate = driver.find_element_by_css_selector('#CarrouselBox2 > dt > h3 > a').text
    print("test:", cate)

    # 더보기 들어가기
    driver.find_element_by_css_selector('#CarrouselBox2 > dt > div > a').click()

    recipes = recipe_craw(detail_ingre=True, step_image=True)
    # noti: 이거 지우면 기존 코드
    # driver.get("https://www.10000recipe.com/issue/view.html?cid=9999scrap&types=issue")
    # time.sleep(3)
    for i in range(min_page, max_page + 1):
        cur_url = driver.current_url
        if i != 1:
            # #contents_area_full > div.chef_cont > div > div > nav > ul > li:nth-child(2) > a
            next_page = '#contents_area_full > div.chef_cont > div > div > nav > ul > li:nth-child({}) > a'.format(i)
            driver.find_element_by_css_selector(next_page).click()
        # tmp_list = driver.find_elements_by_css_selector('#contents_area_full > div.chef_cont > div > div > a')
        # #contents_area_full > div.chef_cont > div > div > a:nth-child(2)
        for big in range(1, 21):
            t = driver.find_element_by_css_selector(
                '#contents_area_full > div.chef_cont > div > div > a:nth-child({})'.format(big))
            t.click()
            cur_detail_url = driver.current_url
            count = 1
            while True:
                try:
                    element = driver.find_element_by_css_selector('#stepdescr{} > p > a'.format(count))
                    element = recipes.Add_recipe(element, count)

                    driver.get(cur_detail_url)
                    print("back",cur_detail_url)
                    time.sleep(3)
                    count += 1
                except Exception:
                    print(Exception)
                    break

            driver.get(cur_url+"&page=" + str(i))
            print(cur_url+"&page=" + str(i))
            time.sleep(3)
            print("ok")


    recipes.db.close()
    print("완성")
    # 드라이버를 종료한다.
    driver.close()
    # file1.close()
