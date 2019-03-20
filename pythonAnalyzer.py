# -*- coding: utf-8 -*-
"""
Created on Wed Mar 20 16:09:18 2019

@author: Freddy
"""

import MySQLdb 
import mysql.connector


#connection string and cursor

conn=mysql.connector.connect(host='byte.cis440.com',user='salem',passwd='CIS440!',db='byte_database') 
mycursor=conn.cursor()




#pull from reviews1

SQLCommand=("Select * from reviews1")
mycursor = conn.cursor()
mycursor.execute(SQLCommand)
records = mycursor.fetchall()
print("Rows:",mycursor.rowcount)
i=0
for row in records:
    idVar = row[0]
    reviewVar = row[1]
    qTypeVar = row[2]
        
    
    #analysis
    
    #insert into reviews 2

    SQLCommand = ("INSERT INTO reviews2(review, sentimentScore, actionableScore, rudeScore, sentimentCount, actionableCount, rudeCount, qType) VALUES (%s,%s,%s,%s,%s,%s,%s,%s)")
    Values = [reviewVar,2.5,2.5,2.5,5,7,6,qTypeVar]
    mycursor.execute(SQLCommand,Values)
    conn.commit()















#Delete * from reviews 1

SQLCommand = ("Delete * from reviews1")
mycursor.execute(SQLCommand)
conn.commit()
mycursor.close()
if(conn.is_connected()):
    conn.close()
