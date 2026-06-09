const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const session = require('express-session');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());
app.use(session({
    secret: 'ammar-secret-key-2024',
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, // 24 sagat
        httpOnly: true
    }
}));
app.use(express.static(__dirname));

// Databaza döretmek
const db = new sqlite3.Database('ammar.db', (err) => {
    if (err) {
        console.error('Databaza açylmady:', err);
    } else {
        console.log('✅ Databaza açyldy!');
    }
});

// Tablisalary döretmek
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS harytlar (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            harytAdy TEXT UNIQUE NOT NULL,
            galanMukdar REAL DEFAULT 0,
            jemiGelen REAL DEFAULT 0,
            jemiCykan REAL DEFAULT 0,
            birlik TEXT NOT NULL,
            sonkyUytgesme TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS gechmis (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            harytAdy TEXT NOT NULL,
            hereket TEXT NOT NULL,
            mukdar REAL NOT NULL,
            birlik TEXT NOT NULL,
            sene TEXT NOT NULL,
            wagt TEXT NOT NULL
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'admin'
        )
    `);

    // Default admin ulanyjy (login: admin, parol: admin)
    const defaultPassword = bcrypt.hashSync('admin', 10);
    db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES ('admin', ?, 'admin')`, [defaultPassword]);

    console.log('✅ Tablisalar taýýar!');
});

// Middleware - Admin barlag
function requireAdmin(req, res, next) {
    if (req.session && req.session.userId) {
        next();
    } else {
        res.status(401).json({ error: 'Giriş gerek', needLogin: true });
    }
}

// API Endpoints

// Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    db.get('SELECT * FROM users WHERE username = ?', [username], async (err, user) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!user) {
            return res.status(401).json({ error: 'Login ýa-da parol nädogry!' });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Login ýa-da parol nädogry!' });
        }

        req.session.userId = user.id;
        req.session.username = user.username;
        req.session.role = user.role;

        res.json({
            success: true,
            message: 'Giriş üstünlikli!',
            username: user.username
        });
    });
});

// Logout
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true, message: 'Çykdyňyz' });
});

// Session barlamak
app.get('/api/check-session', (req, res) => {
    if (req.session && req.session.userId) {
        res.json({ loggedIn: true, username: req.session.username });
    } else {
        res.json({ loggedIn: false });
    }
});

// Ähli harytlary almak
app.get('/api/harytlar', (req, res) => {
    db.all('SELECT * FROM harytlar', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        const result = {};
        rows.forEach(h => {
            result[h.harytAdy] = {
                galanMukdar: h.galanMukdar,
                jemiGelen: h.jemiGelen,
                jemiCykan: h.jemiCykan,
                birlik: h.birlik,
                sonkyUytgesme: h.sonkyUytgesme
            };
        });
        res.json(result);
    });
});

// Gelen haryt goşmak
app.post('/api/gelen', requireAdmin, (req, res) => {
    const { harytAdy, mukdar, birlik, sene } = req.body;

    // Haryt bar bolsa update, ýok bolsa insert
    db.get('SELECT * FROM harytlar WHERE harytAdy = ?', [harytAdy], (err, existing) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (existing) {
            db.run(`
                UPDATE harytlar
                SET galanMukdar = galanMukdar + ?,
                    jemiGelen = jemiGelen + ?,
                    sonkyUytgesme = ?
                WHERE harytAdy = ?
            `, [mukdar, mukdar, sene, harytAdy], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                saveToGechmis();
            });
        } else {
            db.run(`
                INSERT INTO harytlar (harytAdy, galanMukdar, jemiGelen, jemiCykan, birlik, sonkyUytgesme)
                VALUES (?, ?, ?, 0, ?, ?)
            `, [harytAdy, mukdar, mukdar, birlik, sene], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                saveToGechmis();
            });
        }

        function saveToGechmis() {
            db.run(`
                INSERT INTO gechmis (harytAdy, hereket, mukdar, birlik, sene, wagt)
                VALUES (?, 'gelen', ?, ?, ?, ?)
            `, [harytAdy, mukdar, birlik, sene, new Date().toISOString()], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ success: true, message: 'Haryt goşuldy' });
            });
        }
    });
});

// Çykaryş
app.post('/api/cykarys', requireAdmin, (req, res) => {
    const { harytAdy, mukdar, sene } = req.body;

    db.get('SELECT * FROM harytlar WHERE harytAdy = ?', [harytAdy], (err, haryt) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (!haryt) {
            return res.status(404).json({ error: 'Haryt tapylmady' });
        }

        if (mukdar > haryt.galanMukdar) {
            return res.status(400).json({
                error: 'Ýeterlik mukdar ýok',
                galanMukdar: haryt.galanMukdar
            });
        }

        // Azaltmak
        db.run(`
            UPDATE harytlar
            SET galanMukdar = galanMukdar - ?,
                jemiCykan = jemiCykan + ?,
                sonkyUytgesme = ?
            WHERE harytAdy = ?
        `, [mukdar, mukdar, sene, harytAdy], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            // Geçmişe ýazmak
            db.run(`
                INSERT INTO gechmis (harytAdy, hereket, mukdar, birlik, sene, wagt)
                VALUES (?, 'cykan', ?, ?, ?, ?)
            `, [harytAdy, mukdar, haryt.birlik, sene, new Date().toISOString()], (err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }
                res.json({ success: true, message: 'Haryt çykaryldy' });
            });
        });
    });
});

// Haryt pozmak
app.delete('/api/harytlar/:harytAdy', requireAdmin, (req, res) => {
    const { harytAdy } = req.params;
    db.run('DELETE FROM harytlar WHERE harytAdy = ?', [harytAdy], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ success: true, message: 'Haryt pozuldy' });
    });
});

// Geçmişi almak
app.get('/api/gechmis', (req, res) => {
    db.all('SELECT * FROM gechmis ORDER BY id DESC LIMIT 100', [], (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Ähli maglumatlary arassalamak
app.delete('/api/clear', requireAdmin, (req, res) => {
    db.run('DELETE FROM harytlar', [], (err) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        db.run('DELETE FROM gechmis', [], (err) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }
            res.json({ success: true, message: 'Ähli maglumatlar arassalandy' });
        });
    });
});

// Server başlatmak
app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server işleýär!`);
    console.log(`📍 Lokal: http://localhost:${PORT}`);
    console.log(`🌐 Lokal setde: http://[siziň-IP]:${PORT}`);
    console.log(`\n💡 Beýleki kompýuterler üçin bu serveriň IP adresini ulanyň\n`);
});
