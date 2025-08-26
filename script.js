document.addEventListener('DOMContentLoaded', function() {
    // Sembunyikan transition screen SEBELUM halaman dimuat sepenuhnya
    const transitionScreen = document.getElementById('transitionScreen');
    if (transitionScreen) {
        transitionScreen.style.display = 'none';
    }
    
    // Atur viewport untuk mencegah zoom
    const viewportMeta = document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
        viewportMeta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no');
    } else {
        const meta = document.createElement('meta');
        meta.name = 'viewport';
        meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, shrink-to-fit=no';
        document.head.appendChild(meta);
    }
    
    // Cegah zoom dengan event listeners yang lebih agresif
    function preventZoom(e) {
        if (e.touches && e.touches.length > 1) {
            e.preventDefault();
        }
    }
    
    document.addEventListener('touchstart', preventZoom, { passive: false });
    document.addEventListener('touchmove', preventZoom, { passive: false });
    
    let lastTouchEnd = 0;
    document.addEventListener('touchend', function(e) {
        const now = Date.now();
        if (now - lastTouchEnd <= 300) {
            e.preventDefault();
        }
        lastTouchEnd = now;
    }, { passive: false });
    
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('gesturechange', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('wheel', function(e) {
        if (e.ctrlKey) {
            e.preventDefault();
        }
    }, { passive: false });
    
    // Disable double tap to zoom
    document.addEventListener('dblclick', function(e) {
        e.preventDefault();
    }, { passive: false });
    
    // Ambil parameter nama dari URL
    const urlParams = new URLSearchParams(window.location.search);
    const guestName = urlParams.get('to');
    
    // Jika ada parameter nama, ganti teks
    if (guestName) {
        const guestNameEl = document.getElementById('guestName');
        if (guestNameEl) {
            guestNameEl.textContent = guestName;
        }
    }
    
    // Buat partikel background untuk cover
    createCoverParticles();
    
    // Musik functionality
    const musicPlayer = document.getElementById('musicPlayer');
    const bgMusic = document.getElementById('bgMusic');
    let isPlaying = false;
    
    // Coba mainkan musik otomatis
    function playMusic() {
        if (!bgMusic) return;
        
        bgMusic.volume = 0.5;
        const playPromise = bgMusic.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                isPlaying = true;
                if (musicPlayer) {
                    musicPlayer.innerHTML = '<i class="fas fa-volume-up"></i>';
                }
            }).catch(error => {
                console.log('Autoplay dicegah:', error);
                // Tampilkan instruksi untuk interaksi pengguna
                const instruction = document.getElementById('instruction');
                if (instruction) {
                    instruction.textContent = 'Klik dimanapun untuk memutar musik';
                    instruction.style.display = 'block';
                    
                    // Sembunyikan instruksi setelah beberapa detik
                    setTimeout(() => {
                        instruction.style.opacity = '0';
                        setTimeout(() => {
                            instruction.style.display = 'none';
                        }, 1000);
                    }, 5000);
                }
            });
        }
    }
    
    // Coba mainkan musik segera
    setTimeout(playMusic, 500);
    
    if (musicPlayer) {
        musicPlayer.addEventListener('click', function() {
            if (!bgMusic) return;
            
            if (isPlaying) {
                bgMusic.pause();
                musicPlayer.innerHTML = '<i class="fas fa-volume-mute"></i>';
            } else {
                bgMusic.play();
                musicPlayer.innerHTML = '<i class="fas fa-volume-up"></i>';
            }
            isPlaying = !isPlaying;
        });
    }
    
    // Efek saat hover tombol
    const openBtn = document.getElementById('openInvitation');
    if (openBtn) {
        openBtn.addEventListener('mouseenter', () => {
            openBtn.style.transform = 'scale(1.05)';
            openBtn.style.boxShadow = '0 10px 25px rgba(212, 175, 55, 0.4)';
        });
        
        openBtn.addEventListener('mouseleave', () => {
            openBtn.style.transform = 'scale(1)';
            openBtn.style.boxShadow = '0 5px 15px rgba(212, 175, 55, 0.3)';
        });
        
        // Animasi origami saat membuka undangan
        openBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Dapatkan elemen konten undangan
            const content = document.getElementById('invitationContent');
            const origamiContainer = document.getElementById('origamiContainer');
            const origamiBird = document.getElementById('origamiBird');
            
            // Tampilkan container origami
            if (origamiContainer) origamiContainer.style.display = 'flex';
            
            // Animasi: lipat konten menjadi origami burung
            if (content) {
                content.style.animation = 'foldIntoBird 1.5s forwards';
                
                // Setelah animasi selesai, tampilkan burung origami
                setTimeout(() => {
                    content.style.display = 'none';
                    if (origamiBird) {
                        origamiBird.style.display = 'block';
                        
                        // Animasi: burung origami terbang
                        origamiBird.style.animation = 'flyAway 1.5s forwards';
                        
                        // Setelah animasi burung selesai, arahkan ke halaman utama
                        setTimeout(() => {
                            // Sembunyikan cover page dan tampilkan main content
                            const coverPage = document.getElementById('cover-page');
                            const mainContent = document.getElementById('main-content');
                            
                            if (coverPage) coverPage.style.display = 'none';
                            if (mainContent) {
                                mainContent.style.display = 'block';
                                mainContent.classList.add('active');
                            }
                            
                            // Inisialisasi konten utama
                            initMainContent();
                        }, 1500);
                    }
                }, 1500);
            }
        });
    }
    
    // Auto play music dengan interaksi pengguna
    document.addEventListener('click', function() {
        if (!isPlaying && bgMusic) {
            bgMusic.play().then(() => {
                isPlaying = true;
                if (musicPlayer) musicPlayer.innerHTML = '<i class="fas fa-volume-up"></i>';
            }).catch(error => {
                console.log('Autoplay dicegah:', error);
            });
        }
    }, { once: true });
    
    // Pastikan tidak ada ruang kosong di atas
    document.body.style.margin = '0';
    document.body.style.padding = '0';
    document.body.style.overflowX = 'hidden';
    
    // Periksa elemen cover untuk memastikan tidak ada margin/padding
    const coverPage = document.getElementById('cover-page');
    if (coverPage) {
        coverPage.style.margin = '0';
        coverPage.style.padding = '0';
    }
});

// Function untuk membuat partikel background cover
function createCoverParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 50;
    
    // Warna partikel
    const colors = [
        'rgba(212, 175, 55, 0.8)',
        'rgba(255, 215, 0, 0.6)',
        'rgba(255, 223, 116, 0.5)',
        'rgba(255, 240, 190, 0.4)',
        'rgba(255, 255, 255, 0.3)'
    ];
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        
        // Random size
        const size = Math.random() * 15 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Random color
        const colorIndex = Math.floor(Math.random() * colors.length);
        particle.style.backgroundColor = colors[colorIndex];
        particle.style.borderRadius = '50%';
        
        // Random animation
        const animDuration = Math.random() * 15 + 10;
        const animDelay = Math.random() * 5;
        particle.style.animation = `float ${animDuration}s ease-in-out ${animDelay}s infinite`;
        
        particlesContainer.appendChild(particle);
    }
}

// Inisialisasi konten utama
function initMainContent() {
    // Countdown timer
    const WEDDING_DATE = "2025-09-18T09:00:00+08:00";
    
    function updateCountdown() {
        const target = new Date(WEDDING_DATE).getTime();
        const now = Date.now();
        const timeLeft = Math.max(0, target - now);
        
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
        const seconds = Math.floor((timeLeft / 1000) % 60);
        
        const daysEl = document.getElementById('days');
        const hoursEl = document.getElementById('hours');
        const minutesEl = document.getElementById('minutes');
        const secondsEl = document.getElementById('seconds');
        
        if (daysEl) daysEl.textContent = String(days).padStart(2, '0');
        if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
        if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, '0');
        if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, '0');
    }
    
    // Update countdown immediately and then every second
    updateCountdown();
    setInterval(updateCountdown, 1000);
    
    // Navbar functionality
    const navbar = document.getElementById('navbar');
    const navbarToggle = document.getElementById('navbarToggle');
    const navbarMenu = document.getElementById('navbarMenu');
    
    if (navbar && navbarToggle && navbarMenu) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            // Update progress bar
            const progressBar = document.getElementById('progressBar');
            if (progressBar) {
                const winHeight = window.innerHeight;
                const docHeight = document.documentElement.scrollHeight;
                const scrollTop = window.pageYOffset;
                const trackLength = docHeight - winHeight;
                const progress = (scrollTop / trackLength) * 100;
                progressBar.style.width = progress + '%';
            }
        });
        
        navbarToggle.addEventListener('click', () => {
            navbarToggle.classList.toggle('active');
            navbarMenu.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        document.querySelectorAll('.navbar-link').forEach(link => {
            link.addEventListener('click', () => {
                navbarToggle.classList.remove('active');
                navbarMenu.classList.remove('active');
            });
        });
    }
    
    // Pesan form functionality
    const pesanForm = document.getElementById('pesan-form');
    const pesanList = document.getElementById('pesan-list');
    const pesanWrapper = document.getElementById('pesan-wrapper');
    
    if (pesanForm && pesanList && pesanWrapper) {
        pesanForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nameInput = document.getElementById('name');
            const messageInput = document.getElementById('message');
            
            const name = nameInput ? nameInput.value.trim() : '';
            const message = messageInput ? messageInput.value.trim() : '';
            
            if (name && message) {
                const li = document.createElement('li');
                li.style.marginBottom = '1rem';
                li.style.padding = '0.8rem';
                li.style.border = '1px solid rgba(212, 175, 55, 0.3)';
                li.style.borderRadius = '8px';
                li.style.background = 'rgba(212, 175, 55, 0.1)';
                
                li.innerHTML = `
                    <strong style="color: var(--gold);">${name}</strong><br>
                    <span style="color: var(--text);">${message}</span>
                    <br>
                    <button onclick="this.parentElement.remove()" class="btn" 
                        style="margin-top:0.5rem; background:rgba(212, 175, 55, 0.3); color:var(--text); border-radius:6px; padding:0.3rem 0.8rem;">
                        Hapus
                    </button>
                `;
                pesanList.appendChild(li);
                
                // Scroll otomatis ke pesan terbaru
                pesanWrapper.scrollTop = pesanWrapper.scrollHeight;
                
                pesanForm.reset();
            }
        });
    }
    
    // Add animation classes after page load
    const animatedElements = document.querySelectorAll('.animate-fade-in-up');
    animatedElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
    
    // Create interactive background particles
    createBackgroundParticles();
}

// Function untuk membuat partikel background interaktif
function createBackgroundParticles() {
    const interactiveBg = document.getElementById('interactiveBg');
    if (!interactiveBg) return;
    
    const particleCount = 20;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('bg-particle');
        
        // Random size
        const size = Math.random() * 60 + 30;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 10}s`;
        
        interactiveBg.appendChild(particle);
    }
}

// Function to scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ 
            behavior: 'smooth' 
        });
    }
}

// Function to scroll to top
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Function to share invitation
function shareInvitation() {
    if (navigator.share) {
        navigator.share({
            title: 'Undangan Pawiwahan Gus Anom & Ode',
            text: 'Saya mengundang Anda untuk hadir dalam pernikahan kami',
            url: window.location.href
        })
        .catch(error => {
            console.log('Error sharing:', error);
        });
    } else {
        alert('Fitur berbagi tidak didukung di browser ini. Anda dapat menyalin URL dari address bar.');
    }
}

// Pastikan CSS yang diperlukan ada
const style = document.createElement('style');
style.textContent = `
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    
    body {
        margin: 0;
        padding: 0;
        overflow-x: hidden;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        text-size-adjust: 100%;
        touch-action: manipulation;
    }
    
    #transitionScreen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        z-index: 9999;
        display: none;
    }
    
    .particle {
        position: absolute;
        background: rgba(212, 175, 55, 0.6);
        border-radius: 50%;
        animation: float 15s ease-in-out infinite;
    }
    
    @keyframes float {
        0%, 100% { transform: translateY(0) rotate(0deg); }
        50% { transform: translateY(-20px) rotate(180deg); }
    }
    
    @keyframes foldIntoBird {
        0% { transform: scale(1) rotate(0deg); opacity: 1; }
        100% { transform: scale(0) rotate(720deg); opacity: 0; }
    }
    
    @keyframes flyAway {
        0% { transform: translateY(0) scale(1); opacity: 1; }
        100% { transform: translateY(-100vh) scale(0.2); opacity: 0; }
    }
`;
document.head.appendChild(style);