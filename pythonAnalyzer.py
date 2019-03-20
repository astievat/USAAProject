# -*- coding: utf-8 -*-
"""
Created on Wed Mar 20 16:09:18 2019

@author: Freddy
"""

import MySQLdb 
import mysql.connector


'connection string and cursor

conn=mysql.connector.connect(host='byte.cis440.com',user='salem',passwd='CIS440!',db='byte_database') 
mycursor=conn.cursor()




'pull from reviews1

SQLCommand=("Select * from reviews1")
mycursor = conn.cursor()
mycursor.execute(SQLCommand)
records = mycursor.fetchall()
print("Rows:",mycursor.rowcount)
for row in records:
    print("id = ", row[0], )
    print("reviews = ", row[1] )
    print("qType = ", row[2],"\n")








'insert into reviews 2

SQLCommand = ("INSERT INTO reviews2(review, sentimentScore, actionableScore, rudeScore, sentimentCount, actionableCount, rudeCount, qType) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)")
Values = ["review",2.5,2.5,2.5,5,7,6,"type"]
mycursor.execute(SQLCommand,Values)
conn.commit()






'Delete * from reviews 1

SQLCommand = ("Delete * from reviews1")
mycursor.execute(SQLCommand)
conn.commit()
mycursor.close()
if(conn.is_connected()):
    conn.close()
