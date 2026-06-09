// API URL (Serveriň adresi)
const API_URL = 'http://localhost:3000/api';

// Maglumatlary saklamak
let ammarData = {};
let gechmis = [];

// Sahypa ýüklenende
document.addEventListener('DOMContentLoaded', async function() {
    // Admin sahypasynda sessiýa barlamak
    if (window.location.pathname.includes('admin.html')) {
        await checkSession();
    }

    // Şu günki senäni goýmak
    const bugun = new Date().toISOString().split('T')[0];
    document.getElementById('gelenSene').value = bugun;
    document.getElementById('cykarysSene').value = bugun;

    // Serverden maglumatlary ýüklemek
    loadDataFromServer();
});

// Sessiýa barlamak
async function checkSession() {
    try {
        const response = await fetch(`${API_URL}/check-session`, {
            credentials: 'include'
        });
        const data = await response.json();

        if (!data.loggedIn) {
            // Giriş etmän bolsa login sahypasyna ugrat
            window.location.href = 'login.html';
        }
    } catch (error) {
        console.error('Sessiýa barlag ýalňyşlygy:', error);
        window.location.href = 'login.html';
    }
}

// Logout funksiýasy
async function logout() {
    try {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        window.location.href = 'login.html';
    } catch (error) {
        console.error('Logout ýalňyşlygy:', error);
    }
}

// Serverden maglumatlary ýüklemek
async function loadDataFromServer() {
    try {
        const response = await fetch(`${API_URL}/harytlar`, {
            credentials: 'include'
        });
        if (response.ok) {
            ammarData = await response.json();
            updateHasabat();
            updateCykarysSelect();
        } else {
            showMessage('⚠️ Server bilen baglanyşyk mesele!', 'error');
        }
    } catch (error) {
        showMessage('❌ Server işlemeýär! Server.js faýlyny işletmeli.', 'error');
        console.error('Server ýalňyşlygy:', error);
    }
}

// Tab geçişleri
function showTab(tabName) {
    // Ähli tablary gizle
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Saýlanan taby görkez
    document.getElementById(tabName).classList.add('active');
    event.target.classList.add('active');

    if (tabName === 'cykarys') {
        updateCykarysSelect();
    } else if (tabName === 'hasabat') {
        updateHasabat();
    }
}

// Gelen harytlary goşmak
document.getElementById('gelenForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const harytAdy = document.getElementById('gelenHarytAdy').value.trim();
    const mukdar = parseFloat(document.getElementById('gelenMukdar').value);
    const birlik = document.getElementById('gelenBirlik').value;
    const sene = document.getElementById('gelenSene').value;

    try {
        const response = await fetch(`${API_URL}/gelen`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ harytAdy, mukdar, birlik, sene })
        });

        if (response.ok) {
            // Formy arassalamak
            document.getElementById('gelenForm').reset();
            document.getElementById('gelenSene').value = new Date().toISOString().split('T')[0];

            showMessage('✅ Haryt üstünlikli goşuldy!', 'success');

            // Maglumatlary täzelemek
            await loadDataFromServer();
        } else {
            const error = await response.json();
            showMessage(`❌ Ýalňyşlyk: ${error.error}`, 'error');
        }
    } catch (error) {
        showMessage('❌ Server bilen baglanyşyk ýok!', 'error');
        console.error('Ýalňyşlyk:', error);
    }
});

// Çykaryş
document.getElementById('cykarysForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const harytAdy = document.getElementById('cykarysHaryt').value;
    const mukdar = parseFloat(document.getElementById('cykarysMukdar').value);
    const sene = document.getElementById('cykarysSene').value;

    if (!harytAdy) {
        showMessage('❌ Haryt saýlaň!', 'error');
        return;
    }

    try {
        const response = await fetch(`${API_URL}/cykarys`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ harytAdy, mukdar, sene })
        });

        if (response.ok) {
            // Formy arassalamak
            document.getElementById('cykarysForm').reset();
            document.getElementById('cykarysSene').value = new Date().toISOString().split('T')[0];
            document.getElementById('galanMukdarInfo').classList.remove('show');

            showMessage('✅ Haryt üstünlikli çykaryldy!', 'success');

            // Maglumatlary täzelemek
            await loadDataFromServer();
        } else {
            const error = await response.json();
            showMessage(`❌ ${error.error}`, 'error');
        }
    } catch (error) {
        showMessage('❌ Server bilen baglanyşyk ýok!', 'error');
        console.error('Ýalňyşlyk:', error);
    }
});

// Çykaryş üçin haryt saýlamak
document.getElementById('cykarysHaryt').addEventListener('change', function() {
    const harytAdy = this.value;
    const infoBox = document.getElementById('galanMukdarInfo');

    if (harytAdy && ammarData[harytAdy]) {
        const data = ammarData[harytAdy];
        infoBox.innerHTML = `
            <strong>📦 ${harytAdy}</strong><br>
            <strong>Galan mukdar:</strong> ${data.galanMukdar} ${data.birlik}<br>
            <strong>Jemi gelen:</strong> ${data.jemiGelen} ${data.birlik}<br>
            <strong>Jemi çykan:</strong> ${data.jemiCykan} ${data.birlik}
        `;
        infoBox.classList.add('show');
    } else {
        infoBox.classList.remove('show');
    }
});

// Çykaryş select-ny täzelemek
function updateCykarysSelect() {
    const select = document.getElementById('cykarysHaryt');
    select.innerHTML = '<option value="">-- Haryt saýlaň --</option>';

    Object.keys(ammarData).forEach(harytAdy => {
        if (ammarData[harytAdy].galanMukdar > 0) {
            const option = document.createElement('option');
            option.value = harytAdy;
            option.textContent = `${harytAdy} (${ammarData[harytAdy].galanMukdar} ${ammarData[harytAdy].birlik})`;
            select.appendChild(option);
        }
    });
}

// Hasabat tablisyny täzelemek
function updateHasabat() {
    const tbody = document.getElementById('hasabatBody');
    tbody.innerHTML = '';

    let index = 1;
    Object.keys(ammarData).forEach(harytAdy => {
        const data = ammarData[harytAdy];
        const row = document.createElement('tr');

        if (data.galanMukdar < (data.jemiGelen * 0.2)) {
            row.classList.add('low-stock');
        }

        row.innerHTML = `
            <td>${index++}</td>
            <td><strong>${harytAdy}</strong></td>
            <td><strong>${data.galanMukdar.toFixed(2)}</strong> ${data.birlik}</td>
            <td>${data.jemiGelen.toFixed(2)} ${data.birlik}</td>
            <td>${data.jemiCykan.toFixed(2)} ${data.birlik}</td>
            <td>${data.sonkyUytgesme}</td>
            <td>
                <button onclick="deleteHaryt('${harytAdy}')" class="btn btn-delete">🗑️ Poz</button>
            </td>
        `;
        tbody.appendChild(row);
    });

    if (Object.keys(ammarData).length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding: 30px;">Heniz hiç zat goşulmadyk</td></tr>';
    }
}

// Gözleg funksiýasy
document.getElementById('gozlegInput').addEventListener('input', function() {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll('#hasabatBody tr');

    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(filter)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
});

// Haryt pozmak
async function deleteHaryt(harytAdy) {
    if (confirm(`"${harytAdy}" harydyny pozmak isleýärsiňizmi?`)) {
        try {
            const response = await fetch(`${API_URL}/harytlar/${encodeURIComponent(harytAdy)}`, {
                method: 'DELETE',
                credentials: 'include'
            });

            if (response.ok) {
                showMessage('✅ Haryt pozuldy!', 'success');
                await loadDataFromServer();
            } else {
                showMessage('❌ Haryt pozulmady!', 'error');
            }
        } catch (error) {
            showMessage('❌ Server bilen baglanyşyk ýok!', 'error');
            console.error('Ýalňyşlyk:', error);
        }
    }
}

// Ähli maglumatlary arassalamak
async function clearAllData() {
    if (confirm('⚠️ Ähli maglumatlary arassalamak isleýärsiňizmi? Bu hereketi yzyna alnyp bilenok!')) {
        if (confirm('Siz hakykatdanam arassalamak isleýärsiňizmi?')) {
            try {
                const response = await fetch(`${API_URL}/clear`, {
                    method: 'DELETE',
                    credentials: 'include'
                });

                if (response.ok) {
                    showMessage('✅ Ähli maglumatlar arassalandy!', 'success');
                    await loadDataFromServer();
                } else {
                    showMessage('❌ Arassalamak başartmady!', 'error');
                }
            } catch (error) {
                showMessage('❌ Server bilen baglanyşyk ýok!', 'error');
                console.error('Ýalňyşlyk:', error);
            }
        }
    }
}

// Export funksiýasy (JSON görnüşinde)
function exportData() {
    const dataStr = JSON.stringify({
        ammarData: ammarData,
        gechmis: gechmis,
        exportSene: new Date().toISOString()
    }, null, 2);

    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ammar-hasabat-${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    showMessage('✅ Maglumatlar göçürildi!', 'success');
}

// Habar görkez
function showMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = type === 'success' ? 'success-message show' : 'error-message show';
    messageDiv.textContent = message;

    const container = document.querySelector('.container');
    container.insertBefore(messageDiv, container.firstChild);

    setTimeout(() => {
        messageDiv.remove();
    }, 3000);
}
