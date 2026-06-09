# 📦 Ammar Dolandyryş Programmasy - Gurnalyş Gollanmasy

## 🎯 Iki rol bar:

### 👨‍💼 Ammarçy (Admin) - LOGIN/PAROL GEREK
- Harytlary goşup bilýär
- Harytlary çykaryp bilýär
- Harytlary pozup bilýär
- Doly erkin
- **Login:** admin
- **Parol:** admin

### 👁️ Ulanyjy (Görüş) - LOGIN GEREK DÄL
- Diňe harytlara göz aýlap bilýär
- Hiç zady üýtgedip bilmeýär
- Awtomatik täzelenýär (30 sekuntda bir)

---

## 🔧 SERVER KOMPÝUTERINDE GURNALYŞ

### 1️⃣ Node.js gurmak (INTERNET GEREK!)

https://nodejs.org saýtyndan **LTS wersiýasyny** göçürip guruň (v20.x ýa-da v22.x)

### 2️⃣ Zip faýly açmak

`ammar-sistema-final.zip` faýlyny islän ýerde açyň (meselem: `C:\ammar`)

### 3️⃣ Serveri işletmek (INTERNET GEREK DÄL!)

Komanda setirini (CMD) açyň:

```bash
cd C:\ammar
npm start
```

Ýa-da:

```bash
node server.js
```

**BELLIK:** `node_modules` zip-iň içinde bar, şonuň üçin `npm install` etmegiň geregi ýok!

### 4️⃣ SERVER-iň IP adresini ýazga almak

```bash
ipconfig
```

IPv4 Address-den (meselem: 192.168.1.100)

### 5️⃣ Windows Firewall sazlamak

Eger beýleki kompýuterler baglanyp bilmeýän bolsa:

1. Windows Firewall açyň
2. "Allow an app through firewall" basyň
3. Node.js-ny tapyň we **Private** we **Public** network-lary işjeňleşdiriň

Ýa-da 3000 portyny açyň.

---

## 🌐 BEÝLEKI KOMPÝUTERLERDE ULANYŞ

**Hiç zat gurmaň!** Diňe brauzer gerek.

### Ammarçy üçin (Login gerek):

```
http://192.168.1.100:3000/login.html
```

Login: admin  
Parol: admin

Girdikden soň haryt goşup/çykaryp biler.

### Ulanyjylar üçin (Login gerek däl):

```
http://192.168.1.100:3000/view.html
```

Diňe görüp bilýär, üýtgedip bilmeýär.

---

## 📋 FAÝLLARYŇ MAZMUNY

```
ammar-sistema-final.zip içinde:
├── server.js           (Backend server)
├── package.json        (Paketleriň sanawы)
├── node_modules/       (Ähli gerek paketler - INTERNET GEREK DÄL!)
├── admin.html          (Ammarçy sahypasy)
├── login.html          (Giriş sahypasy)
├── view.html           (Ulanyjy sahypasy)
├── welcome.html        (Başlangyç sahypa)
├── index.html          (Ugratma sahypa)
├── style.css           (Stil faýly)
├── script.js           (JavaScript kody)
├── README.md           (Bu faýl)
└── ammar.db            (Databaza - awtomatik döreýär)
```

---

## 🔐 HOWPSUZLYK

- Admin sahypasyna girmek üçin login/parol gerek
- Login: **admin**
- Parol: **admin**
- Sessiýa 24 sagat işleýär
- Ulanyjy sahypasynda login gerek däl (diňe görüp bilýär)

**MASLAHAT:** Ilkinji gezek girensoň paroly üýtgetmek gowy (aýratyn amala aşyrylyp bilner)

---

## 🛑 SERVERI DURUZMAK

Komanda setirinde `Ctrl + C` basyň.

---

## 📝 MÖHÜM BELLIKLER

✅ Server işleýän kompýuter hemişe açyk bolmaly  
✅ Ähli kompýuterler bir lokal setde (WiFi/LAN) bolmaly  
✅ Databaza faýly (`ammar.db`) server kompýuterinde saklanýar  
✅ `node_modules` zip-iň içinde bar - INTERNET GEREK DÄL!  
✅ Diňe Node.js gurmak üçin internet gerek  

---

## 🆘 MESELE ÇÖZGÜTLERI

### "Server başlanmaýar"
- Node.js dogry gurulandygyny barlañ: `node --version`
- Port 3000 boşdugyny barlañ

### "Beýleki kompýuterler baglanýp bilmeýär"
- Windows Firewall sazlamalaryny barlañ
- IP adresi dogrymy barlañ
- Ähli kompýuterler bir setdemi barlañ

### "Login sahypasy açylmaýar"
- Server işleýärmi barlañ: http://localhost:3000
- Brauzer cache arassalañ

---

## 📞 GOLDAW

Meseleler ýüze çyksa, şu faýllary barlañ:
- Server işleýärmi? → Komanda setirinde meseleleri görüň
- IP dogrymy? → `ipconfig` bilen barla
- Firewall açykmy? → Windows Firewall sazlamalaryna giriň
