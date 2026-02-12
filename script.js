// State
let selectedPhotos = [];
let selectedPhotoSrcs = [];
let selectedPhotoCaptions = [];
let yesScale = 1;

// Elements
const captchaScreen = document.getElementById('captcha-screen');
const loadingScreen = document.getElementById('loading-screen');
const successScreen = document.getElementById('success-screen');
const envelopeScreen = document.getElementById('envelope-screen');
const valentineScreen = document.getElementById('valentine-screen');
const celebrationScreen = document.getElementById('celebration-screen');

const photoCells = document.querySelectorAll('.photo-cell');
const verifyBtn = document.getElementById('verify-btn');
const envelope = document.getElementById('envelope');
const yesBtn = document.getElementById('yes-btn');
const noBtn = document.getElementById('no-btn');

// Initialize
function init() {
    setupCaptcha();
    setupEnvelope();
    setupButtons();
    createFloatingHearts();
}

// ========== CAPTCHA ==========
function setupCaptcha() {
    photoCells.forEach(cell => {
        cell.addEventListener('click', () => togglePhoto(cell));
    });

    verifyBtn.addEventListener('click', handleVerify);
}

function togglePhoto(cell) {
    const index = cell.dataset.index;
    const imgSrc = cell.querySelector('.photo-img').src;
    const caption = cell.dataset.caption || '';

    if (cell.classList.contains('selected')) {
        cell.classList.remove('selected');
        selectedPhotos = selectedPhotos.filter(i => i !== index);
        selectedPhotoSrcs = selectedPhotoSrcs.filter(src => src !== imgSrc);
        selectedPhotoCaptions = selectedPhotoCaptions.filter(c => c !== caption);
    } else if (selectedPhotos.length < 3) {
        cell.classList.add('selected');
        selectedPhotos.push(index);
        selectedPhotoSrcs.push(imgSrc);
        selectedPhotoCaptions.push(caption);
    }

    updateVerifyButton();
}

function updateVerifyButton() {
    verifyBtn.disabled = selectedPhotos.length !== 3;
}

function handleVerify() {
    showScreen(loadingScreen);

    // Show loading for 1.5 seconds
    setTimeout(() => {
        showScreen(successScreen);

        // Show success for 1.5 seconds then envelope
        setTimeout(() => {
            showScreen(envelopeScreen);
        }, 1500);
    }, 1500);
}

// ========== ENVELOPE ==========
function setupEnvelope() {
    envelope.addEventListener('click', openEnvelope);
}

function openEnvelope() {
    envelope.classList.add('opened');

    // Wait for animation then show valentine screen
    setTimeout(() => {
        showScreen(valentineScreen);
        createPolaroids('valentine-screen');
    }, 800);
}

// ========== BUTTONS ==========
function setupButtons() {
    yesBtn.addEventListener('click', handleYes);
    noBtn.addEventListener('click', handleNo);
}

function handleNo() {
    yesScale += 0.2;
    yesBtn.style.transform = `scale(${yesScale})`;

    // Add a little shake to the no button
    noBtn.style.animation = 'none';
    noBtn.offsetHeight; // Trigger reflow
    noBtn.style.animation = 'shake 0.3s ease';
}

function handleYes() {
    showScreen(celebrationScreen);
    createHeartBurst();
    createCelebrationHearts();
    createPolaroids('celebration-screen');
}

// ========== FLOATING HEARTS ==========
function createFloatingHearts() {
    const container = document.getElementById('hearts-container');
    const hearts = ['❤️', '💕', '💗', '💖', '💘'];

    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = Math.random() * 100 + '%';
        heart.style.animationDelay = Math.random() * 4 + 's';
        heart.style.fontSize = (16 + Math.random() * 20) + 'px';
        container.appendChild(heart);
    }
}

// ========== HEART BURST ==========
function createHeartBurst() {
    const burstContainer = document.getElementById('heart-burst');
    const hearts = ['❤️', '💕', '💗', '💖', '💘', '💝'];

    for (let i = 0; i < 20; i++) {
        const heart = document.createElement('div');
        heart.className = 'burst-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];

        const angle = (i / 20) * Math.PI * 2;
        const distance = 150 + Math.random() * 100;
        const tx = Math.cos(angle) * distance + 'px';
        const ty = Math.sin(angle) * distance + 'px';

        heart.style.setProperty('--tx', tx);
        heart.style.setProperty('--ty', ty);
        heart.style.left = '50%';
        heart.style.top = '50%';
        heart.style.animationDelay = Math.random() * 0.3 + 's';

        burstContainer.appendChild(heart);
    }
}

// ========== CELEBRATION HEARTS ==========
function createCelebrationHearts() {
    const container = document.getElementById('celebration-hearts');
    const hearts = ['❤️', '💕', '💗', '💖', '💘', '💝'];

    // Create initial hearts
    for (let i = 0; i < 30; i++) {
        createFallingHeart(container, hearts, i * 100);
    }

    // Keep creating hearts
    setInterval(() => {
        createFallingHeart(container, hearts, 0);
    }, 300);
}

function createFallingHeart(container, hearts, delay) {
    setTimeout(() => {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.textContent = hearts[Math.floor(Math.random() * hearts.length)];
        heart.style.left = Math.random() * 100 + '%';
        heart.style.top = '-50px';
        heart.style.fontSize = (20 + Math.random() * 20) + 'px';
        heart.style.animation = `fall ${3 + Math.random() * 2}s linear forwards`;
        container.appendChild(heart);

        // Remove after animation
        setTimeout(() => {
            heart.remove();
        }, 5000);
    }, delay);
}

// ========== POLAROIDS ==========
function createPolaroids(screenId) {
    const screen = document.getElementById(screenId);

    // Remove existing polaroids if any
    screen.querySelectorAll('.polaroid').forEach(p => p.remove());

    // Create polaroid for each selected photo
    selectedPhotoSrcs.forEach((src, index) => {
        const polaroid = document.createElement('div');
        polaroid.className = 'polaroid';

        // Position them at different spots
        const positions = [
            { left: '5%', top: '15%', rotate: -15 },
            { left: '75%', top: '10%', rotate: 12 },
            { left: '80%', top: '60%', rotate: -8 }
        ];
        const pos = positions[index];

        polaroid.style.left = pos.left;
        polaroid.style.top = pos.top;
        polaroid.style.setProperty('--rotate', pos.rotate + 'deg');
        polaroid.style.animationDelay = (index * 0.5) + 's';

        const caption = selectedPhotoCaptions[index] || '';
        polaroid.innerHTML = `
            <div class="polaroid-inner">
                <img src="${src}" alt="Memory">
                <div class="polaroid-caption">${caption}</div>
            </div>
        `;

        screen.appendChild(polaroid);
    });
}

// ========== UTILITY ==========
function showScreen(screen) {
    document.querySelectorAll('.screen').forEach(s => {
        s.classList.remove('active');
    });
    screen.classList.add('active');
}

// Add falling animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            transform: translateY(calc(100vh + 100px)) rotate(360deg);
        }
    }
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-5px); }
        75% { transform: translateX(5px); }
    }
`;
document.head.appendChild(style);

// Start
init();
