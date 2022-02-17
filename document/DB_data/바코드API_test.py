import urllib.request
import json

#-*- coding:utf-8 -*-
# http://apis.data.go.kr/B553077/api/open/sdsc/storeZoneInRadius?radius=500&cx=127.004528&cy=37.567538&ServiceKey=[서비스키]&type=json
url = "http://openapi.foodsafetykorea.go.kr/api/9280ea8f04404b9caa96/C005/json/1/5/BAR_CD=8801007327914"#880 9395 1900 28"  =880 2039 2114 24

#noti: 가능한 것들

# 8809407210041
# 8801007053134 쌈장
# 8801115114390 후레쉬 밀크
# 8801056051150 가벼운매력 옥수수수염차
# 8801114123836 포카리스웨트
# 8801045440040 옛날참기름
# 8801007243054 다시다쇠고기

response = urllib.request.urlopen(url)

json_str = response.read().decode("utf-8")

json_object = json.loads(json_str)
print(json_object)

print(len(json_object['C005']['row']))