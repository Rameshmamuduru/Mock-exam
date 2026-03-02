Good 👍 Now I’ll give you **clear manual deployment steps** for your 3-tier mock exam project.

This is **production-style manual deployment**, but running on your own servers (not Docker, not K8s).

We assume:

* 🖥 Server 1 → Database Server
* 🖥 Server 2 → Backend Server
* 🖥 Server 3 → Frontend Server

---

# 🏗 ARCHITECTURE

```
User Browser
      ↓
Frontend Server (React build)
      ↓ HTTP API
Backend Server (Node + Express)
      ↓ SQL
Database Server (MySQL)
```

---

# 🔹 SERVER 1 — DATABASE SERVER SETUP

## 1️⃣ Install MySQL

On DB server:

```bash
sudo apt update
sudo apt install mysql-server -y
```

Check:

```bash
sudo systemctl status mysql
```

---

## 2️⃣ Secure MySQL

```bash
sudo mysql_secure_installation
```

Set:

* Root password
* Remove anonymous users
* Disable remote root login

---

## 3️⃣ Create Database & User

Login:

```bash
sudo mysql -u root -p
```

Inside MySQL:

```sql
CREATE DATABASE mock_exam;

CREATE USER 'examuser'@'%' IDENTIFIED BY 'StrongPassword123';

GRANT ALL PRIVILEGES ON mock_exam.* TO 'examuser'@'%';

FLUSH PRIVILEGES;
```

---

## 4️⃣ Allow Remote Connections

Edit:

```bash
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf
```

Change:

```
bind-address = 0.0.0.0
```

Restart:

```bash
sudo systemctl restart mysql
```

---

## 5️⃣ Open Port 3306

If using firewall:

```bash
sudo ufw allow 3306
```

Or allow backend server IP only (recommended in real production).

---

## 6️⃣ Import Your Schema

Copy your `schema.sql` and run:

```bash
mysql -u examuser -p mock_exam < schema.sql
```

✅ Database server is ready.

---

# 🔹 SERVER 2 — BACKEND SERVER SETUP

## 1️⃣ Install Node

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install nodejs -y
```

Check:

```bash
node -v
npm -v
```

---

## 2️⃣ Upload Backend Code

Copy backend folder to server:

```bash
scp -r backend user@backend-ip:/home/user/
```

Go inside:

```bash
cd backend
npm install
```

---

## 3️⃣ Configure Environment Variables

Create `.env`

```
DB_HOST=DB_SERVER_IP
DB_USER=examuser
DB_PASSWORD=StrongPassword123
DB_NAME=mock_exam
PORT=5000
```

Update `db.js` to use process.env variables.

---

## 4️⃣ Test Backend

```bash
node server.js
```

Test from browser:

```
http://backend-ip:5000/api/questions
```

If JSON appears → working.

---

## 5️⃣ Run Backend in Production (PM2)

Install PM2:

```bash
sudo npm install -g pm2
```

Start:

```bash
pm2 start server.js --name mock-backend
pm2 save
pm2 startup
```

Backend now runs as service.

---

# 🔹 SERVER 3 — FRONTEND SERVER SETUP

## 1️⃣ Install Node

Same as backend.

---

## 2️⃣ Upload Frontend Code

```bash
scp -r frontend user@frontend-ip:/home/user/
```

Go inside:

```bash
cd frontend
npm install
```

---

## 3️⃣ Update API URL

In React:

Change:

```js
axios.get("/api/questions")
```

To:

```js
axios.get("http://BACKEND_IP:5000/api/questions")
```

---

## 4️⃣ Build React App

```bash
npm run build
```

This creates:

```
build/
```

---

## 5️⃣ Install Nginx

```bash
sudo apt install nginx -y
```

Remove default:

```bash
sudo rm -rf /var/www/html/*
```

Copy build:

```bash
sudo cp -r build/* /var/www/html/
```

Restart:

```bash
sudo systemctl restart nginx
```

Now open:

```
http://frontend-ip
```

Frontend loads.

