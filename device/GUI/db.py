import pymysql
import datetime


# get : read
# set : update
# add : add
# del : remove

class DB:
    def __init__(self):
        try:
            self.db = pymysql.connect(
                user='user',
                passwd='a203!',
                host='i5a203.p.ssafy.io',
                db='refreci',
                charset='utf8',
                port=3306
            )
        except:
            print("DB와 연결이 실패하였습니다.\n잠시 후 다시 시도해 주십시요")
            exit(1)

    def get_Classifi2_id(self, classifi2_name):
        '''
        소분류 이름에서 소분류ID를 받아오는 함수

        :param classifi2_name: 소분류 이름
        :return 소분류 ID
        '''

        cursor = self.db.cursor()
        sql = "SELECT c2.c2ID " \
              "FROM Classification2 c2 " \
              "WHERE c2.classification2Name = %s;"

        cursor.execute(sql, classifi2_name)
        result = cursor.fetchall()
        return result[0][0]

    def get_Classifi1_To_Classifi2(self, classifi1_category):
        '''
        대분류에서 소분류를 받아오는 함수

        :param classifi1_category: 대분류 이름
        :return ((id, 소분류1, 소분류1.jpg), (id2, 소분류2, 소분류2.jpg)...)
        '''

        cursor = self.db.cursor()
        sql = "SELECT c2.c2ID, c2.Classification2Name, c2.Classification2Image " \
              "FROM Classification2 c2, Classification1 c1 " \
              "WHERE c1.classification1Name = %s and c2.Classification2to1 = c1.c1ID;"

        cursor.execute(sql, classifi1_category)
        result = cursor.fetchall()
        return result

    def get_Product_category(self, name):
        '''
        제품의 대분류, 소분류를 가져올 때 사용
        소분류가 2개 이상이면 마지막에 나온 재료로 분류(일단은...상의가 더 필요한 부분)

        :param name: 제품이름
        ex: 해찬들 고추장

        :return cate1Name, cate1Img,  cate2Name, cate2Img, cate1Id, cate2Id
        '''
        cursor = self.db.cursor()

        sql = "select c1.classification1Name, c1.classification1Image, c2.classification2Name, c2.classification2Image, c1.c1ID, c2.c2Id " \
              "from Classification2 c2, Classification1 c1 " \
              "where '{}' like concat('%', c2.classification2Name, '%') and c1.c1ID = c2.Classification2to1;".format(
            name)

        cursor.execute(sql)
        result = cursor.fetchall()
        # print("카테고리 결과")
        # print(result)
        return result

    def add_UserProducts(self, data):
        '''
        제품을 추가 할때 사용 : 카테고리가 있다는 전제
        :param data: 2차원 리스트, 안에는 name, category1, category2, expDay, count가 있는 dict
        ex: [{item_name: 고추장, item_category1: 장류, ...}]
        user_id: 유저 ID
        item_name: 재료이름         item_category1: 대분류
        item_category2: 소분류      item_expDay: 재료 유통기한 (D-day식으로 표기 예정)        item_count: 재료 수량
        item_image: 제품이미지(소분류 이미지)      item_category1_id: 대분류 ID
        item_category2_id: 소분류ID

        :return 1: 성공 0: 실패
        '''
        cursor = self.db.cursor()
        now = datetime.datetime.now()
        now = now.strftime('%Y-%m-%d')

        for d in data:
            print(d)
            if d['item_expDay'] == "0000-00-00":
                sql = "INSERT INTO UserProduct(uID, productName, productCount, createdDate, productClassification1," \
                  " productClassification2, productShelfLife, productImage, isDeleted) " \
                  "VALUES(%s, %s, %s, %s, %s, %s, null, %s, 0);"
                try:
                    print((d['user_id'], d['item_name'], d['item_count'], now, d['item_category1_id'],
                           d['item_category2_id'], d['item_image']))
                    cursor.execute(sql, (d['user_id'],
                                         d['item_name'], d['item_count'], now, d['item_category1_id'],
                                         d['item_category2_id'],
                                         d['item_image']))
                    self.db.commit()
                except:
                    print(d['item_name'] + "를(을) DB에 정상적으로 추가하지 못했습니다.")
                    return 0
            else:
                sql = "INSERT INTO UserProduct(uID, productName, productCount, createdDate, productClassification1," \
                      " productClassification2, productShelfLife, productImage, isDeleted) " \
                      "VALUES(%s, %s, %s, %s, %s, %s, %s, %s, 0);"
                try:
                    print((d['user_id'], d['item_name'], d['item_count'], now, d['item_category1_id'],
                           d['item_category2_id'], d['item_expDay'],d['item_image']))
                    cursor.execute(sql, (d['user_id'],
                    d['item_name'], d['item_count'], now, d['item_category1_id'], d['item_category2_id'], d['item_expDay'],
                    d['item_image']))
                    self.db.commit()
                except:
                    print(d['item_name'] + "를(을) DB에 정상적으로 추가하지 못했습니다.")
                    return 0

        return 1

    def get_UserProducts(self, user_id):
        '''
        제품을 보여줄 때 사용
        :param user_id: user의 id를 받아서 DB에 저장된 제품을 보여준다.

        :return data: 2차원리스트, 리스트 안에는 dict형
        ex: [{item_name: 고추장, item_category1: 장류, ...}...]
        item_name: 재료이름         item_category1: 대분류 이름    item_createDay: 재료 등록일
        item_expDay: 재료 유통기한 (D-day식으로 표기 예정)        item_count: 재료 수량
        item_image: 제품 이미지          item_category2: 소분류 이름
        '''
        data = []
        dict_keys = ['upID', 'item_name', 'item_count', 'item_createDay',
                     'item_category1', 'item_expDay', 'item_image', 'item_category2']
        cursor = self.db.cursor()
        sql = "SELECT upID, productName, productCount, createdDate, " \
              "productClassification1, productShelfLife, productImage, productClassification2 " \
              "FROM UserProduct WHERE uID=%s;"
        cursor.execute(sql, user_id)
        result = cursor.fetchall()
        print(result)

        for r in result:
            tmp = dict()
            for d in range(7):
                if d == 4:
                    sql = "select c1.classification1Name, c2.classification2Name " \
                          "from Classification2 c2, Classification1 c1 " \
                          "where c1.c1ID=c2.Classification2to1 and c2.c2ID=%s;"
                    cursor.execute(sql, r[7])
                    cate = cursor.fetchall()
                    tmp[dict_keys[d]] = cate[0][0]
                    tmp['item_category2'] = cate[0][1]
                    tmp['item_category1_id'] = r[d]
                    tmp['item_category2_id'] = r[7]
                else:
                    tmp[dict_keys[d]] = r[d]

            data.append(tmp)

        return data

    def get_UserProducts_Classifi1(self, user_id, classifi1):
        '''
        제품을 보여줄 때 사용
        :param user_id: user의 id를 받아서 DB에 저장된 제품을 보여준다.
        :param classifi1: user가 가지고 있는 대분류ID를 받아서 필터링해준다.

        :return data: 2차원리스트, 리스트 안에는 dict형
        ex: [{item_name: 고추장, item_category1: 장류, ...}...]
        item_name: 재료이름         item_category1: 대분류     item_createDay: 재료 등록일
        item_expDay: 재료 유통기한 (D-day식으로 표기 예정)        item_count: 재료 수량
        item_image
        '''
        data = []
        dict_keys = ['upID', 'item_name', 'item_count', 'item_createDay',
                     'item_category1', 'item_expDay', 'item_image', 'item_category2']
        cursor = self.db.cursor()
        sql = "SELECT upID, productName, productCount, createdDate, " \
              "productClassification1, productShelfLife, productImage, productClassification2 " \
              "FROM UserProduct WHERE uID=%s and productClassification1=%s;"
        cursor.execute(sql, (user_id, classifi1))
        result = cursor.fetchall()

        for r in result:
            tmp = dict()
            for d in range(7):
                if d == 4:
                    sql = "select c1.classification1Name, c2.classification2Name " \
                          "from Classification2 c2, Classification1 c1 " \
                          "where c1.c1ID=c2.Classification2to1 and c2.c2ID=%s;"
                    cursor.execute(sql, r[7])
                    cate = cursor.fetchall()
                    tmp[dict_keys[d]] = cate[0][0]
                    tmp['item_category2'] = cate[0][1]
                    tmp['item_category1_id'] = r[d]
                    tmp['item_category2_id'] = r[7]
                else:
                    tmp[dict_keys[d]] = r[d]

            data.append(tmp)

        return data

    def get_UserProducts_Classifi1_Extra(self, user_id):
        '''
        대분류 기타의 제품을 보여줄 때 사용
        :param user_id: user의 id를 받아서 DB에 저장된 제품을 보여준다.
        :param classifi1: user가 가지고 있는 대분류ID를 받아서 필터링해준다.

        :return data: 2차원리스트, 리스트 안에는 dict형
        ex: [{item_name: 고추장, item_category1: 장류, ...}...]
        item_name: 재료이름         item_category1: 대분류     item_createDay: 재료 등록일
        item_expDay: 재료 유통기한 (D-day식으로 표기 예정)        item_count: 재료 수량
        item_image
        '''
        data = []
        dict_keys = ['upID', 'item_name', 'item_count', 'item_createDay',
                     'item_category1', 'item_expDay', 'item_image', 'item_category2']
        cursor = self.db.cursor()
        sql = "SELECT upID, productName, productCount, createdDate, " \
              "productClassification1, productShelfLife, productImage, productClassification2 " \
              "FROM UserProduct WHERE uID=%s and productClassification1 not in (1,2,3,4);"
        cursor.execute(sql, user_id)
        result = cursor.fetchall()

        for r in result:
            tmp = dict()
            for d in range(7):
                if d == 4:
                    sql = "select c1.classification1Name, c2.classification2Name " \
                          "from Classification2 c2, Classification1 c1 " \
                          "where c1.c1ID=c2.Classification2to1 and c2.c2ID=%s;"
                    cursor.execute(sql, r[7])
                    cate = cursor.fetchall()
                    tmp[dict_keys[d]] = cate[0][0]
                    tmp['item_category2'] = cate[0][1]
                    tmp['item_category1_id'] = r[d]
                    tmp['item_category2_id'] = r[7]
                else:
                    tmp[dict_keys[d]] = r[d]

            data.append(tmp)

        return data

    def get_UserProducts_NameReverse_sort(self, user_id):
        '''
        제품을 이름 역순으로 보여줄 때 사용
        :param user_id: user의 id를 받아서 DB에 저장된 제품을 보여준다.

        :return data: 2차원리스트, 리스트 안에는 dict형
        ex: [{item_name: 고추장, item_category1: 장류, ...}...]
        item_name: 재료이름         item_category1: 대분류     item_createDay: 재료 등록일
        item_expDay: 재료 유통기한 (D-day식으로 표기 예정)        item_count: 재료 수량
        item_image: 제품 이미지          item_category2: 소분류
        '''
        data = []
        dict_keys = ['upID', 'item_name', 'item_count', 'item_createDay',
                     'item_category1', 'item_expDay', 'item_image', 'item_category2']
        cursor = self.db.cursor()
        sql = "SELECT upID, productName, productCount, createdDate, " \
              "productClassification1, productShelfLife, productImage, productClassification2 " \
              "FROM UserProduct WHERE uID=%s " \
              "ORDER BY productName DESC;"
        cursor.execute(sql, user_id)
        result = cursor.fetchall()

        for r in result:
            tmp = dict()
            for d in range(7):
                if d == 4:
                    sql = "select c1.classification1Name, c2.classification2Name " \
                          "from Classification2 c2, Classification1 c1 " \
                          "where c1.c1ID=c2.Classification2to1 and c2.c2ID=%s;"
                    cursor.execute(sql, r[7])
                    cate = cursor.fetchall()
                    tmp[dict_keys[d]] = cate[0][0]
                    tmp['item_category2'] = cate[0][1]
                    tmp['item_category1_id'] = r[d]
                    tmp['item_category2_id'] = r[7]
                else:
                    tmp[dict_keys[d]] = r[d]
            data.append(tmp)

        return data

    def get_UserProducts_Name_sort(self, user_id):
        '''
        제품을 이름순으로 정렬해서 보여줄 때 사용
        :param user_id: user의 id를 받아서 DB에 저장된 제품을 보여준다.

        :return data: 2차원리스트, 리스트 안에는 dict형
        ex: [{item_name: 고추장, item_category1: 장류, ...}...]
        item_name: 재료이름         item_category1: 대분류     item_createDay: 재료 등록일
        item_expDay: 재료 유통기한 (D-day식으로 표기 예정)        item_count: 재료 수량
        item_image: 제품 이미지          item_category2: 소분류
        '''
        data = []
        dict_keys = ['upID', 'item_name', 'item_count', 'item_createDay',
                     'item_category1', 'item_expDay', 'item_image', 'item_category2']
        cursor = self.db.cursor()
        sql = "SELECT upID, productName, productCount, createdDate, " \
              "productClassification1, productShelfLife, productImage, productClassification2 " \
              "FROM UserProduct WHERE uID=%s " \
              "ORDER BY productName;"
        cursor.execute(sql, user_id)
        result = cursor.fetchall()

        for r in result:
            tmp = dict()
            for d in range(7):
                if d == 4:
                    sql = "select c1.classification1Name, c2.classification2Name " \
                          "from Classification2 c2, Classification1 c1 " \
                          "where c1.c1ID=c2.Classification2to1 and c2.c2ID=%s;"
                    cursor.execute(sql, r[7])
                    cate = cursor.fetchall()
                    tmp[dict_keys[d]] = cate[0][0]
                    tmp['item_category2'] = cate[0][1]
                    tmp['item_category1_id'] = r[d]
                    tmp['item_category2_id'] = r[7]
                else:
                    tmp[dict_keys[d]] = r[d]
            data.append(tmp)

        return data

    def get_UserProducts_ShelfLife_sort(self, user_id):
        '''
        제품을 유통기한 순으로 보여줄 때 사용
        :param user_id: user의 id를 받아서 DB에 저장된 제품을 보여준다.

        :return data: 2차원리스트, 리스트 안에는 dict형
        ex: [{item_name: 고추장, item_category1: 장류, ...}...]
        item_name: 재료이름         item_category1: 대분류     item_createDay: 재료 등록일
        item_expDay: 재료 유통기한 (D-day식으로 표기 예정)        item_count: 재료 수량
        item_image: 제품 이미지          item_category2: 소분류
        '''
        data = []
        dict_keys = ['upID', 'item_name', 'item_count', 'item_createDay',
                     'item_category1', 'item_expDay', 'item_image', 'item_category2']
        cursor = self.db.cursor()
        sql = "SELECT upID, productName, productCount, createdDate, " \
              "productClassification1, productShelfLife, productImage, productClassification2 " \
              "FROM UserProduct WHERE uID=%s " \
              "ORDER BY productShelfLife;"
        cursor.execute(sql, user_id)
        result = cursor.fetchall()

        for r in result:
            tmp = dict()
            for d in range(7):
                if d == 4:
                    sql = "select c1.classification1Name, c2.classification2Name " \
                          "from Classification2 c2, Classification1 c1 " \
                          "where c1.c1ID=c2.Classification2to1 and c2.c2ID=%s;"
                    cursor.execute(sql, r[7])
                    cate = cursor.fetchall()
                    tmp[dict_keys[d]] = cate[0][0]
                    tmp['item_category2'] = cate[0][1]
                    tmp['item_category1_id'] = r[d]
                    tmp['item_category2_id'] = r[7]
                else:
                    tmp[dict_keys[d]] = r[d]
            data.append(tmp)

        return data


    def del_UserProducts(self, id):
        '''
        제품을 삭제함
        :param id: userproduct id

        :return 1:성공 0:실패
        '''
        cursor = self.db.cursor()
        try:
            sql = "DELETE FROM UserProduct WHERE upID=%s"
            cursor.execute(sql, id)
            self.db.commit()
            return 1
        except:
            print("삭제에 실패 하였습니다.")
            return 0

    def set_UserProducts(self, type, data, ProductID):
        '''
        제품의 정보를 바꿔 줌
        :param type: 바꿀 DB column명(정확해야한다.)
        --> productName, productCount, productShelfLife, productClassification1 중에 하나

        :param data: 바뀌는 데이터: int여도 str이어도 상관없다.
        :param ProductID: 바꿀제품 id

        :return 1:성공 0:실패
        '''
        cursor = self.db.cursor()
        try:
            sql = "UPDATE UserProduct SET {}=%s WHERE upID=%s".format(type)
            cursor.execute(sql, (data, ProductID))
            self.db.commit()
            return 1
        except:
            print("변경에 실패 하였습니다.")
            return 0

    def get_User_Name(self, id):
        '''
        유저 정보 반환
        :param: id: userID
        :return: name: string 형
        '''
        cursor = self.db.cursor()
        try:
            sql = "SELECT userName FROM User WHERE uID=%s"
            cursor.execute(sql, id)
            result = cursor.fetchall()
            return result[0][0]
        except:
            print("유저정보를 가져오는데 실패하였습니다.")
            return 0

    def get_recipe(self, classifiID_tuple):
        '''
        :param classifiID_tuple: (id1, id2 ...)
        :return: data: 2차원 list, 리스트 안에는 dict형식

        ex: [{recipe_id: 1, recipe_name: 한방삼계탕, ...}...]
        recipe_id: 레시피 아이디          recipe_name: 레시피 이름         recipe_intro: 레시피 요약설명
        recipe_amount: 레시피 양(단위: 00인분)      recipe_image: 레시피 대표 이미지        recipe_time: 레시피 조리시간(00분)
        '''
        data = []
        cursor = self.db.cursor()
        try:
            if type(classifiID_tuple) == type(1):
                classifiID_tuple = "(" + str(classifiID_tuple) + ")"

            sql = "SELECT r.rID, r.recipeName, r.recipeIntroduce, r.recipeAmount, r.recipeImage, r.recipeTime, rid.count " \
                  "FROM Recipe r, (SELECT DISTINCT ri.rID, count(*) count " \
                  "FROM RecipeIngredient ri, Ingredient i " \
                  "WHERE ri.iID=i.iID and i.ingredientName REGEXP ( " \
                  "SELECT REPLACE(GROUP_CONCAT(a.classification2Name), ',' , '|') AS NAME " \
                  "FROM (SELECT c2.classification2Name FROM Classification2 c2 WHERE c2.c2ID in {}) a) " \
                  "Group by ri.rID) rid " \
                  "WHERE r.rID=rid.rID " \
                  "Order by rid.count DESC;".format(str(classifiID_tuple))

            # print(sql)
            dict_keys = ['recipe_id', 'recipe_name', 'recipe_intro', 'recipe_amount', 'recipe_image', 'recipe_time']
            cursor.execute(sql)
            result = cursor.fetchall()
            for r in result:
                tmp = dict()
                for d in range(6):
                    tmp[dict_keys[d]] = r[d]
                data.append(tmp)
            # print("메롱")
            return data
        except:
            print("레시피 정보를 가져오는데 실패하였습니다.")
            return 0

    def get_recipe_ingre(self, rid):
        '''
        :param rid: 레시피 id

        :return: data: 사용되는 식재료 리스트
        '''
        data = []
        cursor = self.db.cursor()

        ingredient_sql = "SELECT i.ingredientName " \
                         "FROM Recipe r, Ingredient i, RecipeIngredient ri " \
                         "WHERE r.rID=%s and r.rID=ri.rID and ri.iID=i.iID;"
        cursor.execute(ingredient_sql, rid)
        result = cursor.fetchall()
        for d in result:
            data.append(d[0])

        return data

    def get_detail_recipe(self, rid):
        '''
        :param rid: 레시피 id

        :return: data
        recipe_id: 레시피 아이디          recipe_name: 레시피 이름         recipe_intro: 레시피 요약설명
        recipe_amount: 레시피 양(단위: 00인분)      recipe_image: 레시피 대표 이미지        recipe_time: 레시피 조리시간(00분)
        recipe_ingredient: 2차원 list 형식 내부 구조 [{'ingre_id':재료 아이디, 'ingredient_name':재료이름, 'ingredient_amount': 재료양} ...]
        recipe_phase: 2차원 list 형식 내부 구조 [{'phase_id':단계 아이디, 'phase_intro':단계 설명, 'phase_img': 단계 이미지} ...]
        '''
        data = dict()
        recipe_keys = ['recipe_id', 'recipe_name', 'recipe_intro', 'recipe_amount', 'recipe_image', 'recipe_time']
        cursor = self.db.cursor()

        recipe_sql = "SELECT r.rID, r.recipeName, r.recipeIntroduce, r.recipeAmount, r.recipeImage, r.recipeTime " \
                     "FROM Recipe r " \
                     "WHERE r.rID=%s;"

        cursor.execute(recipe_sql, rid)
        result = cursor.fetchall()[0]
        for d in range(6):
            data[recipe_keys[d]] = result[d]

        ingredient_sql = "SELECT i.iID, i.ingredientName, ri.ingredientAmount " \
                         "FROM Recipe r, Ingredient i, RecipeIngredient ri " \
                         "WHERE r.rID=%s and r.rID=ri.rID and ri.iID=i.iID;"
        ingredient_keys = ['ingre_id', 'ingredient_name', 'ingredient_amount']
        cursor.execute(ingredient_sql, rid)
        result = cursor.fetchall()
        data['ingredient'] = []
        for d in result:
            data['ingredient'].append(d)

        phase_sql = "SELECT rp.fdID, rp.recipephaseIntroduce, rp.recipephaseImage FROM RecipePhase rp " \
                    "WHERE rp.rID=%s;"
        phase_keys = ['phase_intro', 'phase_img']
        cursor.execute(phase_sql, rid)
        result = cursor.fetchall()
        for n, r in enumerate(result):
            data[n + 1] = dict()
            for d in range(2):
                data[n + 1][phase_keys[d]] = r[d + 1]

        return data

    def get_favo_reicpe(self, user_id):
        '''
        :param: user_id: 유저 아이디
        :return: data: 2차원 list, 리스트 안에는 dict형식

        ex: [{recipe_id: 1, recipe_name: 한방삼계탕, ...}...]
        recipe_id: 레시피 아이디          recipe_name: 레시피 이름         recipe_intro: 레시피 요약설명
        recipe_amount: 레시피 양(단위: 00인분)      recipe_image: 레시피 대표 이미지        recipe_time: 레시피 조리시간(00분)
       '''
        data = []
        cursor = self.db.cursor()
        try:
            sql = "SELECT r.rID, r.recipeName, r.recipeIntroduce, r.recipeAmount, r.recipeImage, r.recipeTime " \
                  "FROM Favorites f, Recipe r, User u WHERE uID=%s and u.uID=f.uID and r.rID=f.rID;"
            cursor.execute(sql, user_id)
            dict_keys = ['recipe_id', 'recipe_name', 'recipe_intro', 'recipe_amount', 'recipe_image', 'recipe_time']
            result = cursor.fetchall()
            for r in result:
                tmp = dict()
                for d in range(6):
                    tmp[dict_keys[d]] = r[d]
                data.append(tmp)

            return data
        except:
            print("레시피 정보를 가져오는데 실패하였습니다.")
            return 0

    def del_favo_recipe(self):
        '''
        (4)
        :return:
        '''
        pass


#db = DB()
#print(db.get_UserProducts_ShelfLife_sort(1))