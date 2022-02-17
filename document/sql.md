사용자 계정추가

```sql
INSERT INTO `project`.`user`
(`userName`, `userID`, `userPW`, `createdDate`, `isDeleted`) 
values ('사용자명', '사용자이메일', '비밀번호(int)', now(), '0 : defeult');
```

냉장고에 집어넣기 

```sql
INSERT INTO `project`.`userproduct`
(`uID`,`productName`, `productCount`, `createdDate`, `productClassification1`, `productClassification2`, `productShelfLife`, `isDeleted`) 
values ('유저id : int', '재료명', '개수 : int', now(), '대분류 : int', '소분류 : int', now(),'0');
```

//uID, 대분류, 소분류는 외래키

web에서 특정상품 추가

```sql
INSERT INTO `project`.`userproduct`
(`uID`,`productName`, `productCount`, `createdDate`, `productClassification1`, `productClassification2`, `productShelfLife`, `isDeleted`) 
values ('유저id : int', '재료명', '개수 : int', now(), '대분류 : int', '소분류 : int', now(),'0');
```

web에서 재료 수정 전체 정보 다받아서 수정 혹은 바뀐 컬럼 보내준다.

```sql
UPDATE `project`.`userproduct`
SET `productName` = '재료명', `productCount` = '개수 : int', `productClassification1` = '대분류' , `productClassification2` = '소분류', `productShelfLife` = '유통기한 : date' 
WHERE `upID` = '재료번호 : int';
```

냉장고의 소분류 이미지를 보여준다. *리스트로 담아와서 리스트 순서대로 쿼리문 돌릴지*

```sql
SELECT b.classificationImage as '이미지경로', b.ingredientNameas '소분류'
FROM `project`.`Ingredient` as b
LEFT JOIN `project`.`UserProduct` as a
WHERE a.`productClassification2` = b.`iID` and a.`upID` = '상품의 upID';
```

캘린더를 클릭하면 해당 날에 유통기한 마감인 제품을 보여준다. (web)

```sql
SELECT `productName` FROM `project`.`userproduct`
WHERE `productShelfLife` = '해당일';
```

냉장고에 들어있는 제품의 이름, 개수, 유통기한, 이미지(대분류에 따른 이미지)를 보여준다. (대분류 소분류에 따른 분류기능을 **'갖고 있는 제품에 대해서만'** 제공한다)(iot, web)

냉장고 제품 정보 제공

```sql
SELECT * FROM `project`.`userproduct`
WHERE `uID` = '사용자 id(자동부여된 사용자번호)';
```

대분류

```sql
SELECT DISTINCT(`productClassification1`) as '대분류'
FROM `project`.`UserProduct`
WHERE `productCount` > 0 and `uID` = '사용자 번호'
ORDER BY productClassification1(ASC);
```

대분류에 따른 냉장고 정보제공

```sql
SELECT * FROM `project`.`userproduct`
FROM `project`.`UserProduct`
WHERE `productClassification1` = '현재 선택된 대분류' and `uID` = '사용자 번호'
ORDER BY `productName`(ASC)
```

소분류

```sql
SELECT DISTINCT(`productClassification2`) as '소분류'
FROM `project`.`UserProduct`
WHERE `productCount` > 0
ORDER BY ASC;
```

### 레시피 + 즐겨찾기 부분 추가

1. 속재료의 c2ID를 활용하여 선택재료가 포함되는 레시피 정보 반환

```sql
SELECT r.rID, r.recipeName, r.recipeIntroduce, r.recipeAmount, r.recipeImage, r.recipeTime, rid.count
FROM Recipe r, (SELECT DISTINCT ri.rID, count(*) count
FROM RecipeIngredient ri, Ingredient i
WHERE ri.iID=i.iID and i.ingredientName REGEXP (
		SELECT REPLACE(GROUP_CONCAT(a.classification2Name), ',' , '|') AS NAME
		FROM (SELECT c2.classification2Name FROM Classification2 c2 WHERE c2.c2ID in (1)) a)
Group by ri.rID) rid
WHERE r.rID=rid.rID
Order by rid.count DESC;
-->
```

2. 레시피 ID를 가지고 재료 정보 가져오기
```sql
SELECT i.iID, i.ingredientName, ri.ingredientAmount
FROM Recipe r, Ingredient i, RecipeIngredient ri
WHERE r.rID in (1) and r.rID=ri.rID and ri.iID=i.iID;
```

레시피 단계<br>
레시피를 선택하면 레시피 단계별 설명과 이미지를 제공한다.<br>
(test data: rID 6번은 한방 삼계탕 레시피)
```sql
select fdID, recipephaseIntroduce, recipephaseImage from recipephase where rID=6;
```

유저 즐겨찾기 기능<br>
(test data: 1번유저, 6번 레시피)

추가
```sql
INSERT INTO favorites(uID, rID) values (1, 6);
```

삭제
```sql
DELETE FROM favorites WHERE rID=6;
```

조회
```sql
SELECT rID FROM favorites WHERE uID=1;
```
