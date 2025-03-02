// Kullanıcı kayıtları (basit bir örnek için localStorage kullanıyoruz)
let users = JSON.parse(localStorage.getItem('users')) || [];

// Giriş yapma fonksiyonu
function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('currentUser', username);
        showEditorPage();
    } else {
        document.getElementById('error-message').style.display = 'block';
    }
}

// Çıkış yapma fonksiyonu
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('currentUser');
    showLoginPage();
}

// Giriş sayfasını göster
function showLoginPage() {
    document.getElementById('login-page').style.display = 'block';
    document.getElementById('editor-page').style.display = 'none';
}

// Metin düzenleyici sayfasını göster
function showEditorPage() {
    document.getElementById('login-page').style.display = 'none';
    document.getElementById('editor-page').style.display = 'block';
}

// Sayfa yüklendiğinde kullanıcı giriş durumunu kontrol et
window.onload = function () {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        showEditorPage();
    } else {
        showLoginPage();
    }

    // Kaydedilmiş metni yükle
    let savedText = localStorage.getItem("savedText");
    if (savedText) {
        document.getElementById("editor").innerHTML = savedText;
    }

    // MP3 dosyasını yükleme
    document.getElementById('backgroundAudio').src = 'mex.mp3';

    // İstatistikleri güncelle
    updateStats();
};

// Metin biçimlendirme fonksiyonları
function formatText(command) {
    document.execCommand(command, false, null);
}

function alignText(command) {
    document.execCommand(command, false, null);
}

function changeColor(color) {
    document.execCommand('foreColor', false, color);
}

function changeBgColor(color) {
    document.execCommand('hiliteColor', false, color);
}

function changeFont(font) {
    document.execCommand('fontName', false, font);
}

function changeFontSize(size) {
    document.execCommand('fontSize', false, size);
}

function insertList(command) {
    document.execCommand(command, false, null);
}

function insertTable() {
    let rows = prompt("Satır sayısını girin:", 2);
    let cols = prompt("Sütun sayısını girin:", 2);
    if (rows > 0 && cols > 0) {
        let table = "<table border='1'>";
        for (let i = 0; i < rows; i++) {
            table += "<tr>";
            for (let j = 0; j < cols; j++) {
                table += "<td> </td>";
            }
            table += "</tr>";
        }
        table += "</table>";
        document.execCommand('insertHTML', false, table);
    }
}

function insertImage() {
    let url = prompt("Resim URL'sini girin:");
    if (url) {
        document.execCommand('insertImage', false, url);
    }
}

function insertLink() {
    let url = prompt("Bağlantı URL'sini girin:");
    if (url) {
        document.execCommand('createLink', false, url);
    }
}

function insertExcelTable() {
    let rows = prompt("Satır sayısını girin:", 5);
    let cols = prompt("Sütun sayısını girin:", 5);
    if (rows > 0 && cols > 0) {
        let table = "<table border='1' style='border-collapse: collapse;'>";
        for (let i = 0; i < rows; i++) {
            table += "<tr>";
            for (let j = 0; j < cols; j++) {
                table += "<td style='padding: 5px; border: 1px solid #000;'> </td>";
            }
            table += "</tr>";
        }
        table += "</table>";
        document.execCommand('insertHTML', false, table);
    }
}

function insertWordArt() {
    let text = prompt("WordArt metnini girin:");
    if (text) {
        let wordArt = `<span style="font-family: 'Comic Sans MS', cursive, sans-serif; font-size: 2em; color: #ff6b6b; text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);">${text}</span>`;
        document.execCommand('insertHTML', false, wordArt);
    }
}

function saveText() {
    let text = document.getElementById("editor").innerHTML;
    localStorage.setItem("savedText", text);
    alert("Metin kaydedildi!");
}

function buyutYazi() {
    const yaziElementi = document.getElementById('editor');
    const mevcutBoyut = window.getComputedStyle(yaziElementi, null).getPropertyValue('font-size');
    const yeniBoyut = parseFloat(mevcutBoyut) + 2;
    yaziElementi.style.fontSize = yeniBoyut + 'px';
}

function yeniYaziTipi() {
    const yaziElementi = document.getElementById('editor');
    yaziElementi.style.fontFamily = 'Arial, sans-serif';
}

function downloadText() {
    let text = document.getElementById("editor").innerHTML;
    let blob = new Blob([text], { type: "text/html" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "metin.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// Gece modu fonksiyonu
function toggleDarkMode() {
    const body = document.body;
    body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
}

// Emoji ekleme fonksiyonu
function openEmojiPicker() {
    const picker = document.getElementById('emojiPicker');
    picker.style.display = 'block';
}

function insertEmoji(emoji) {
    const editor = document.getElementById('editor');
    editor.innerHTML += emoji;
    document.getElementById('emojiPicker').style.display = 'none';
}

// Bul ve değiştir fonksiyonu
function openFindReplace() {
    const findReplace = document.getElementById('findReplace');
    findReplace.style.display = 'block';
}

function findAndReplace() {
    const editor = document.getElementById('editor');
    const findText = document.getElementById('findText').value;
    const replaceText = document.getElementById('replaceText').value;
    const content = editor.innerHTML;
    const newContent = content.replace(new RegExp(findText, 'g'), replaceText);
    editor.innerHTML = newContent;
}

// Metin istatistiklerini güncelleme fonksiyonu
function updateStats() {
    const editor = document.getElementById('editor');
    const text = editor.innerText;

    // Karakter sayısı
    const charCount = text.length;
    document.getElementById('charCount').textContent = charCount;

    // Kelime sayısı
    const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
    document.getElementById('wordCount').textContent = wordCount;

    // Satır sayısı
    const lineCount = text.split('\n').length;
    document.getElementById('lineCount').textContent = lineCount;
}

// Editor içeriği değiştiğinde istatistikleri güncelle
document.getElementById('editor').addEventListener('input', updateStats);

// Sürükle-bırak ile resim ekleme
const editor = document.getElementById('editor');

editor.addEventListener('dragover', (e) => {
    e.preventDefault();
});

editor.addEventListener('drop', (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (event) => {
            const img = document.createElement('img');
            img.src = event.target.result;
            editor.appendChild(img);
        };
        reader.readAsDataURL(file);
    }
});

// PDF indirme fonksiyonu
function downloadAsPDF() {
    const { jsPDF } = window.jspdf; // jsPDF kütüphanesini kullanıyoruz
    const doc = new jsPDF();

    // Metin içeriğini al
    const content = document.getElementById("editor").innerHTML;

    // PDF'ye metni ekle
    doc.fromHTML(content, 15, 15, {
        'width': 170
    });

    // PDF dosyasını indirme
    doc.save('metin.pdf');
}