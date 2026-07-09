// ==========================================
// 1. المؤثرات الصوتية والملفات الصوتية المدمجة
// ==========================================
const sfxStartup = new Audio('https://actions.google.com/sounds/v1/science_fiction/ambient_power_up.ogg');
const sfxClick = new Audio('https://actions.google.com/sounds/v1/digital_watch/beep.ogg');
const sfxAlarm = new Audio('https://actions.google.com/sounds/v1/alarms/digital_watch_alarm_long.ogg');

// دالة لتخفيض شدة الصوت حتى لا يزعج المستخدم
sfxStartup.volume = 0.4; sfxClick.volume = 0.3; sfxAlarm.volume = 0.5;

// ==========================================
// 2. شاشة الإقلاع التتابعية (Boot Screen)
// ==========================================
const bootLines = [
    "JARVIS v4.8 INITIALIZING...",
    "LOADING AI CORE MEMORY CLUSTERS...",
    "ESTABLISHING SECURE SATELLITE UPLINK...",
    "CONNECTING TO STARK ENTERPRISES NETWORK...",
    "DECRYPTION PROTOCOLS... COMPLETE.",
    "ALL SYSTEMS OPERATIONAL. WELCOME HUSSEIN."
];

let lineIndex = 0;
const terminal = document.getElementById('boot-terminal');
const bootBar = document.getElementById('boot-bar');

function runBootSequence() {
    if (lineIndex < bootLines.length) {
        terminal.innerHTML += `> ${bootLines[lineIndex]}<br>`;
        lineIndex++;
        let progress = (lineIndex / bootLines.length) * 100;
        bootBar.style.width = progress + '%';
        setTimeout(runBootSequence, 700);
    } else {
        setTimeout(() => {
            document.getElementById('boot-screen').style.opacity = '0';
            setTimeout(() => {
                document.getElementById('boot-screen').style.display = 'none';
                // تشغيل الأنيميشن الخاص بالـ Face Scan فور الدخول للوحة
                triggerFaceScan();
            }, 800);
        }, 500);
    }
}
// بدء التشغيل التلقائي
window.addEventListener('DOMContentLoaded', () => {
    sfxStartup.play().catch(() => console.log("Click anywhere to allow audio context."));
    runBootSequence();
});

// ==========================================
// 3. محرك الجزيئات والماتريكس (HTML5 Canvas)
// ==========================================
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let animationMode = "particles"; // "particles" or "matrix"

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// إعدادات الـ Particles
const particles = [];
for(let i=0; i<60; i++) {
    particles.push({
        x: Math.random() * canvas.width, y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 1.5, vy: (Math.random() - 0.5) * 1.5, r: Math.random() * 3
    });
}

// إعدادات الـ Matrix
const katakana = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const fontSize = 16;
const columns = Math.floor(window.innerWidth / fontSize);
const rainDrops = Array(columns).fill(1);

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let neonColor = getComputedStyle(document.documentElement).getPropertyValue('--neon-blue').trim();

    if (animationMode === "particles") {
        ctx.fillStyle = neonColor;
        ctx.strokeStyle = neonColor;
        particles.forEach((p, idx) => {
            p.x += p.vx; p.y += p.vy;
            if(p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if(p.y < 0 || p.y > canvas.height) p.vy *= -1;
            ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI*2); ctx.fill();
            
            // رسم خطوط متقاطعة بين النقاط القريبة
            for(let j = idx+1; j < particles.length; j++) {
                let p2 = particles[j];
                let dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if(dist < 100) {
                    ctx.shadowBlur = 0;
                    ctx.strokeStyle = `rgba(${neonColor === '#ff003c' ? '255,0,60' : '0,240,255'}, ${1 - dist/100})`;
                    ctx.lineWidth = 0.5; ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(p2.x, p2.y); ctx.stroke();
                }
            }
        });
    } else if (animationMode === "matrix") {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = neonColor;
        ctx.font = fontSize + 'px monospace';
        for (let i = 0; i < rainDrops.length; i++) {
            const text = katakana.charAt(Math.floor(Math.random() * katakana.length));
            ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);
            if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) rainDrops[i] = 0;
            rainDrops[i]++;
        }
    }
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

function toggleMatrix() {
    sfxClick.play();
    animationMode = (animationMode === "particles") ? "matrix" : "particles";
    logAction(`Background altered to ${animationMode.toUpperCase()} grid.`);
}

// ==========================================
// 4. تعقب الماوس وتحريك الـ HUD (3D Mouse Tracking)
// ==========================================
const hudContainer = document.getElementById('hud-container');
window.addEventListener('mousemove', (e) => {
    const xAxis = (window.innerWidth / 2 - e.pageX) / 45;
    const yAxis = (window.innerHeight / 2 - e.pageY) / 45;
    hudContainer.style.transform = `rotateY(${xAxis}deg) rotateX(${-yAxis}deg)`;
});

// ==========================================
// 5. محاكاة الـ Face Scan التلقائي عند الدخول
// ==========================================
function triggerFaceScan() {
    const status = document.getElementById('scan-status');
    const mesh = document.getElementById('face-mesh');
    status.innerText = "SCANNING FACE...";
    
    setTimeout(() => {
        status.innerText = "IDENTITY FOUND";
        status.style.color = "#00ff00";
        mesh.style.opacity = "0.9";
        logAction("Biometric Match: Hussein authorized.");
        speakJarvis("Identity confirmed. Welcome back Hussein.");
    }, 3000);
}

// ==========================================
// 6. الـ CPU الدائري ومؤشرات الشبكة والوقت
// ==========================================
function updateCircularCPU() {
    const load = Math.floor(Math.random() * 35) + 12;
    document.getElementById('cpu-text').innerText = load + "%";
    const circle = document.getElementById('cpu-circle');
    const circumference = 2 * Math.PI * 50; 
    const offset = circumference - (load / 100) * circumference;
    circle.style.strokeDashoffset = offset;
}
setInterval(updateCircularCPU, 1500);

// الساعة واليوم واصطياد الـ IP الوهمي والـ Ping
setInterval(() => {
    const now = new Date();
    document.getElementById('clock').innerText = now.toTimeString().split(' ')[0];
    document.getElementById('date').innerText = now.toDateString().toUpperCase();
}, 1000);

// توليد بيانات شبكة افتراضية ذكية ومتحركة
function generateNetworkStats() {
    document.getElementById('net-ip').innerText = `192.168.${Math.floor(Math.random()*254)}.${Math.floor(Math.random()*254)}`;
    setInterval(() => {
        document.getElementById('net-ping').innerText = Math.floor(Math.random() * 14) + 4 + " ms";
        document.getElementById('net-down').innerText = (Math.random() * 150 + 400).toFixed(1) + " Mbps";
    }, 2000);
}
generateNetworkStats();

// ==========================================
// 7. جلب بيانات الطقس الحقيقي (Real Weather API)
// ==========================================
function getRealWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            // API مجاني تماماً وبدون حاجة لـ Key خاص بك ومقيد بجهازك لحمايتك
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
            
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    const temp = Math.round(data.current_weather.temperature);
                    document.getElementById('weather-temp').innerText = `${temp}°C`;
                    document.getElementById('weather-desc').innerText = `LOC SYNCED PROTOCOL`;
                    document.getElementById('location').innerText = `GPS: LAT ${lat.toFixed(2)} LON ${lon.toFixed(2)}`;
                    logAction(`Atmospheric core updated: ${temp}°C detected.`);
                })
                .catch(() => fallbackWeather());
        }, () => fallbackWeather());
    } else { fallbackWeather(); }
}
function fallbackWeather() {
    document.getElementById('weather-temp').innerText = "26°C";
    document.getElementById('weather-desc').innerText = "STATIC LOCAL BACKUP";
}
getRealWeather();

// ==========================================
// 8. التعرف على الصوت والذكاء الاصطناعي (Voice Recognition)
// ==========================================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        document.getElementById('voice-status').innerText = "JARVIS IS LISTENING...";
        document.getElementById('voiceWave').classList.add('listening');
    };

    recognition.onresult = (event) => {
        const lastIndex = event.results.length - 1;
        const command = event.results[lastIndex][0].transcript.toLowerCase().trim();
        logAction(`User voice input: "${command}"`);

        if (command.includes('jarvis')) {
            if (command.includes('status') || command.includes('system')) {
                speakJarvis("All mainframe sectors are secured, and the system load is within standard thresholds, sir.");
            } else if (command.includes('combat') || command.includes('red code') || command.includes('mark 85')) {
                activateMark85();
            } else {
                speakJarvis("At your command, Hussein. Systems are steady.");
            }
        }
    };

    recognition.onend = () => { recognition.start(); }; // لإبقاء المايكروفون يستمع دائمًا دون انقطاع
    recognition.start();
} else {
    document.getElementById('voice-status').innerText = "VOICE ENGINE NOT SUPPORTED";
}

function speakJarvis(text) {
    const utterance = new SpeechSynthesisUtterance(text);
    const voices = window.speechSynthesis.getVoices();
    const jVoice = voices.find(v => v.lang.includes('en') && v.name.toLowerCase().includes('male'));
    if (jVoice) utterance.voice = jVoice;
    utterance.pitch = 0.85; utterance.rate = 1.0;
    window.speechSynthesis.speak(utterance);
}

// ==========================================
// 9. طور القتال التدميري (MARK 85 MODE) 😈
// ==========================================
function activateMark85() {
    sfxAlarm.play();
    document.body.classList.add('mark85-active');
    logAction("⚠️ ALERT: COMBAT MODE ACTIVATED. SHIEILDS UP.");
    speakJarvis("Combat mode initiated. Weapons primed, thrusters online. Let's finish this, Hussein.");
    
    // تسريع حركة الرادار لمحاكاة البحث عن الأهداف
    document.getElementById('main-radar').style.animationDuration = "0.6s";

    // العودة للوضع العادي بعد 10 ثوانٍ (لحماية العين وللـ Reset التلقائي)
    setTimeout(() => {
        document.body.classList.remove('mark85-active');
        document.getElementById('main-radar').style.animationDuration = "2.5s";
        logAction("Combat threat cleared. Returning to passive mode.");
        speakJarvis("Threat eliminated. Standing down to standard grid.");
    }, 10000);
}

function logAction(msg) {
    const logs = document.getElementById('logs');
    logs.innerHTML = `> ${msg}<br>` + logs.innerHTML.split('<br>').slice(0, 2).join('<br>');
}
