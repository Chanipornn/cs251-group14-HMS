*** ถ้าจะทำโปรเจตนี้อย่างแรกคือ ***
1. ติดตั้ง Docker container
2. Import Project นี้เข้า Springboot 
3. รันคำสั่ง "docker-compose up mysql-db -d" ให้สร้าง Container ของตัว Database Mysql
4. Build Project แล้วรันแอปได้เลย 
5. แยกทำของแต่ละส่วนได้เลย

*** โครงสร้าง Database สำหรับคนที่ทำ Model,Repository ***
โครงสร้าง Database อยู่ที่โฟลเดอร์ database > init.sql โดยตัว docker-compose จะไปอ่านไฟล์นี้และนำมาสร้าง container ของ Database


*** คำสั่งติดตั้ง docker container ***
ไฟล์ docker-compose เป็นไฟล์สำหรับสร้างทั้ง container 2 ตัว ที่มี web server และ database server แยกกัน
# รัน MySQL อย่างเดียวก่อน (ระหว่าง dev)
docker-compose up mysql-db -d

# ถ้าเขียนเสร็จแล้ว รันตัวนี้
docker-compose up --build -d