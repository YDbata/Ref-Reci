import pyzbar.pyzbar as pyzbar
import cv2
import urllib.request
import json

def barcode_API(barcodenum):
  url = "http://openapi.foodsafetykorea.go.kr/api/9280ea8f04404b9caa96/C005/json/1/5/BAR_CD=" + barcodenum
  response = urllib.request.urlopen(url)

  json_str = response.read().decode("utf-8")

  json_object = json.loads(json_str)
  print(json_object)

  print(len(json_object['C005']['row']))
  return json_object


def barcode_recognition():
  cap = cv2.VideoCapture(0)
  product_info = ''

  i = 0
  while(cap.isOpened()):
    ret, img = cap.read()

    if not ret:
      continue

    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    decoded = pyzbar.decode(gray)
    # [[barcode]]
    for d in decoded:
      x, y, w, h = d.rect

      barcode_data = d.data.decode("utf-8")
      barcode_type = d.type

      cv2.rectangle(img, (x, y), (x + w, y + h), (0, 0, 255), 2)

      text = '%s (%s)' % (barcode_data, barcode_type)
      cv2.putText(img, text, (x, y), cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 255), 2, cv2.LINE_AA)
      product_info = barcode_API(barcode_data)
      if product_info:
        if product_info['C005']['RESULT']['MSG'] == '정상처리되었습니다.':
          print(product_info)
        else:
          print("데이터가 없습니다.")

    # 여기에 while 종료 조건
    key = cv2.waitKey(1)
    if key == ord('q'):
      break

  cap.release()
  cv2.destroyAllWindows()
    # return product_info
    # cv2.imshow('img', img)
    #
    # key = cv2.waitKey(1)
    # if key == ord('q'):
    #   break
    # elif key == ord('s'):
    #   i += 1
    #   cv2.imwrite('testdata/c_%03d.jpg' % i, img)

# barcode_API('8801007719801')