document.addEventListener('DOMContentLoaded', () => {
    // ===============================================
    // --- 1. LOGIKA MODE TERANG/GELAP (DARK MODE) ---
    // ===============================================

    const toggleButton = document.getElementById('theme-toggle');
    const body = document.body;
    const currentTheme = localStorage.getItem('theme');

    // Fungsi untuk Menerapkan Tema
    function applyTheme(theme) {
        if (theme === 'dark') {
            body.classList.add('dark-mode');
            toggleButton.textContent = '🌙'; // Ikon bulan
        } else {
            body.classList.remove('dark-mode');
            toggleButton.textContent = '☀️'; // Ikon matahari
        }
    }

    // Terapkan tema yang tersimpan atau preferensi sistem saat halaman dimuat
    if (currentTheme) {
        applyTheme(currentTheme);
    } else {
        // Cek preferensi sistem jika belum ada tema tersimpan
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            applyTheme('dark');
        } else {
            applyTheme('light');
        }
    }

    // Event Listener untuk tombol pengalih
    toggleButton.addEventListener('click', () => {
        let newTheme;
        if (body.classList.contains('dark-mode')) {
            newTheme = 'light';
        } else {
            newTheme = 'dark';
        }
        
        applyTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    });

    // ===============================================
    // --- 2. LOGIKA MINI-GAME "BERSIHKAN KKN" ---
    // ===============================================

    const gameArea = document.getElementById('game-area');
    const startGameBtn = document.getElementById('start-game-btn');
    const scoreDisplay = document.getElementById('game-score');
    const timerDisplay = document.getElementById('game-timer');
    const messageDisplay = document.getElementById('game-message');

    let score = 0;
    let time = 15;
    let gameInterval;
    let targetSpawnInterval;
    let gameRunning = false;
    const gameDuration = 15000; // 15 detik

    function updateScore(points) {
        score += points;
        scoreDisplay.textContent = `Bounty: ${score}`; // Diubah sesuai tema koboi
    }

    function updateTimer(t) {
        timerDisplay.textContent = `Waktu Tersisa: ${t}s`;
    }

    function spawnTarget() {
        if (!gameRunning) return;

        const target = document.createElement('div');
        target.classList.add('kkn-target');
        target.textContent = '🦠'; // Simbol kuman/virus (bandit)

        const gameAreaRect = gameArea.getBoundingClientRect();
        const targetSize = 45; 
        const maxX = gameAreaRect.width - targetSize;
        const maxY = gameAreaRect.height - targetSize;

        const randomX = Math.floor(Math.random() * maxX);
        const randomY = Math.floor(Math.random() * maxY);

        target.style.left = `${randomX}px`;
        target.style.top = `${randomY}px`;

        target.addEventListener('click', (e) => {
            e.stopPropagation(); // Penting: Hanya target yang diklik, bukan area game
            if (gameRunning) {
                updateScore(1);
                target.remove();
            }
        });

        gameArea.appendChild(target);

        // Hilangkan target secara otomatis setelah 1.5 detik
        setTimeout(() => {
            if (target.parentNode === gameArea) {
                target.remove();
            }
        }, 1500); 
    }

    function endGame() {
        gameRunning = false;
        clearInterval(gameInterval);
        clearInterval(targetSpawnInterval);
        
        // Hapus semua target yang tersisa
        gameArea.querySelectorAll('.kkn-target').forEach(t => t.remove());

        messageDisplay.textContent = `Waktu habis! Anda berhasil menangkap ${score} bandit!`;
        startGameBtn.style.display = 'block';
        startGameBtn.textContent = 'Tarik Pelatuk Lagi?';

        // Pesan motivasi
        if (score > 20) {
            messageDisplay.textContent += ' Sheriff terbaik! Kota ini aman berkat Anda.';
        } else if (score > 10) {
            messageDisplay.textContent += ' Pekerjaan yang bagus, Partner! Terus jaga batas kota.';
        } else {
            messageDisplay.textContent += ' Hmm, kita butuh lebih banyak amunisi! Coba lagi!';
        }
    }

    function startGame() {
        if (gameRunning) return;

        gameRunning = true;
        score = 0;
        time = 15;
        
        updateScore(0);
        updateTimer(15);
        messageDisplay.textContent = 'Tembak cepat bandit KKN!';
        startGameBtn.style.display = 'none';

        // Interval Waktu
        gameInterval = setInterval(() => {
            time--;
            updateTimer(time);
            if (time <= 0) {
                endGame();
            }
        }, 1000);

        // Interval Spawn Target
        targetSpawnInterval = setInterval(spawnTarget, 800);
        
        setTimeout(() => {
            if (gameRunning) { 
                endGame();
            }
        }, gameDuration + 50); 
    }

    startGameBtn.addEventListener('click', startGame);
    // Mencegah drag/seret yang mengganggu di area game
    gameArea.addEventListener('dragstart', (e) => e.preventDefault());
});