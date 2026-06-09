# 📦 Ammar Dolandyryş Programmasy - Gurnalyş Gollanmasy

## 🎯 Iki rol bar:

### 👨‍💼 Ammarçy (Admin) - `admin.html`
- Harytlary goşup bilýär
- Harytlary çykaryp bilýär
- Harytlary pozup bilýär
- Doly erkin

### 👁️ Ulanyjy (Görüş) - `view.html`
- Diňe harytlara göz aýlap bilýär
- Hiç zady üýtgedip bilmeýär
- Awtomatik täzelenýär (30 sekuntda bir)

## 🔧 Gerek bolan programma
1. **Node.js** - https://nodejs.org/en/ (LTS wersiýasy)

## 📥 Gurnalyş ädimleri

### 1-nji ädim: Paketleri gurmak

Komandalar setirini (CMD ýa-da Terminal) açyň we bu papkanyň içinde işlediň:

```bash
cd C:\script
npm install
```

Bu komanda gerek bolan ähli paketleri gurýar (express, cors, better-sqlite3).

### 2-nji ädim: Serveri işletmek

```bash
npm start
```

Ýa-da:

```bash
node server.js
```

Server işlän bolsa şeýle habar görkezer:
```
✅ Databaza taýýar!
🚀 Server işleýär!
📍 Lokal: http://localhost:3000
🌐 Lokal setde: http://[siziň-IP]:3000
```

## 🌐 Lokal setde ulanyş

### Server kompýuterinde:

1. `server.js` faýlyny işletmeli (ýokarda görkezilen usul bilen)
2. Windows Firewall-da 3000 portyny açmaly (gerek bolsa)
3. Öz IP adresinizi bilmeli: 
   ```bash
   ipconfig
   ```
   IPv4 Address görkezilen san (meselem: 192.168.1.100)

### Ammarçy kompýuterinde:

1. Brauzer açyň
2. Şu salgyga giriň: `http://192.168.1.100:3000/admin.html` 
3. Doly erkin - haryt goşup/çykaryp bolýar

### Beýleki kompýuterlerde (Ulanyjylar):

1. Brauzer açyň
2. Şu salgyga giriň: `http://192.168.1.100:3000/view.html`
3. Diňe görüp bolýar, üýtgedip bolmaýar
4. Awtomatik täzelenýär (30 sekuntda)

## ⚙️ IP adresini üýtgetmek (Islege görä)

Eger beýleki kompýuterlerde `http://localhost:3000` işlemese, `script.js` faýlynyň başynda:

```javascript
const API_URL = 'http://192.168.1.100:3000/api';
```

(192.168.1.100 ýerine server kompýuteriň hakyky IP adresini ýazyň)

## 🔒 Windows Firewall sazlamalary

Eger beýleki kompýuterler baglanyp bilmeýän bolsa:

1. Windows Firewall açyň
2. "Allow an app through firewall" saýlaň
3. Node.js-ny tapyň we Private/Public network-lary işjeňleşdiriň
4. Ýa-da 3000 portyny açyň

## 📊 Programmanyň aýratynlyklary

✅ Gelen harytlary giriziň
✅ Ammardan haryt alyň (awtomatik azalýar)
✅ Ähli kompýuterlerde bir maglumat görünýär
✅ Databaza faýly: `ammar.db` (awtomatik döreýär)
✅ Real-time täzelenme

## 🛑 Serveri duruzmak

Komanda setirinde `Ctrl + C` basyň.

## 📝 Bellik

- Server işleýän kompýuter hemişe açyk bolmaly
- Ähli kompýuterler bir lokal setde (WiFi/LAN) bolmaly
- Databaza faýly (`ammar.db`) server kompýuterinde saklanýar
