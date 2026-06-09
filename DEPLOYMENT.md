# Ammar Dolandyryş Programmasy - Internet Deployment

## Render.com-da Mugt Ýerleşdirmek

### 1-njiädim: GitHub-a ýüklemek

```bash
cd "C:\script\Новая папка"
git init
git add .
git commit -m "Ammar programmasy - ilkinji commit"
```

GitHub-da täze repository dörediň we push ediň:
```bash
git remote add origin https://github.com/siziň-username/ammar-system.git
git branch -M main
git push -u origin main
```

### 2-njiädim: Render.com-da Deploy

1. **Render.com** giriň: https://render.com (GitHub bilen giriň)
2. **"New +"** → **"Web Service"** basyň
3. GitHub repository-ňyzy saýlaň
4. Awtomatik kesgitlär gelýär:
   - **Name:** ammar-system
   - **Environment:** Node
   - **Build Command:** npm install
   - **Start Command:** npm start
   - **Plan:** Free ✅
5. **"Create Web Service"** basyň

### 3-njiädim: Garaşyň (5-10 minut)

Deploy tamamlanandan soň siziň URL gelýär:
```
https://ammar-system-xxxx.onrender.com
```

## Giriş maglumatlary:
- **Login:** admin
- **Parol:** admin

## ⚠️ Möhüm bellik:

Render.com mugt planynda:
- 15 minut ulanylmasa server ýatýar
- Ilkinji girişde 30 sekunt garaşmaly
- Her aý 750 sagat mugt (kän ýeterlik)
- SSL sertifikat awtomatik (HTTPS)

## Redaktirlemek:

1. Faýllary üýtgediň
2. Git commit ediň:
```bash
git add .
git commit -m "üýtgeşme"
git push
```
3. Render.com awtomatik täzeden deploy edýär

---

Başga sorag bar bolsa soruň! 🚀
