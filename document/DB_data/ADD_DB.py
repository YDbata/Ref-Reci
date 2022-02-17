import pymysql


#MySQL에 정보를 저장
def db():
      conn = pymysql.connect(host='i5a203.p.ssafy.io', user='user', password='a203!', charset='utf8', db='project')
      cur = conn.cursor()
      sql = 'INSERT INTO `project`.`Classification2` (`classification2Name`, `classification2Image`, `Classification2to1`)\
            VALUES (%s, %s, %s)'
      f = open("11.txt", 'r', encoding='utf-8')
      lines = f.read()
      line = lines.split()
      for i in range(0, len(line), 2):
            val = (line[i], line[i] + '.jpg', int(line[i+1]))
            cur.execute(sql, val)
            conn.commit()
      conn.close()


if __name__=="__main__":
      db()
