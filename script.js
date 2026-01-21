// 全域變數設定 (避免結構巢狀導致錯誤)
let canvas, ctx, width, height;
let particles = [];
let arrow = { x: -100, y: 0, active: false };

// 程式進入點
document.addEventListener('DOMContentLoaded', () => {
    console.log("Script Loaded - Fixed Version");

    // 檢查網址參數
    const urlParams = new URLSearchParams(window.location.search);
    const h1Text = urlParams.get('h1');
    const h2Text = urlParams.get('h2');
    const msgText = urlParams.get('msg');

    // 判斷模式
    if (h1Text || h2Text || msgText) {
        initParticleView(h1Text, h2Text, msgText);
    } else {
        initCreationMode();
    }
});

// --- 1. 創造模式邏輯 ---
function initCreationMode() {
    const formContainer = document.getElementById('creation-form-container');
    const btn = document.getElementById('generate-btn');

    if (formContainer) {
        formContainer.style.display = 'flex';
    }

    if (btn) {
        btn.addEventListener('click', () => {
            try {
                const h1 = document.getElementById('input-h1').value || 'Me';
                const h2 = document.getElementById('input-h2').value || 'You';
                const msg = document.getElementById('input-msg').value || 'Happy Valentine\'s Day';

                const baseUrl = window.location.href.split('?')[0];
                const newUrl = `${baseUrl}?h1=${encodeURIComponent(h1)}&h2=${encodeURIComponent(h2)}&msg=${encodeURIComponent(msg)}`;
                
                const resultArea = document.getElementById('result-area');
                const urlInput = document.getElementById('generated-url');
                const previewLink = document.getElementById('preview-link');

                resultArea.style.display = 'block';
                urlInput.value = newUrl;
                previewLink.href = newUrl;
                resultArea.scrollIntoView({ behavior: 'smooth' });

            } catch (e) {
                console.error("Link Gen Error:", e);
                alert("發生錯誤: " + e.message);
            }
        });
    }
}

// --- 2. 粒子相關類別 (移到最外層避免語法錯誤) ---
class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = width / 2;
        this.y = height / 2;
        this.targetX = width / 2;
        this.targetY = height / 2;
        this.vx = (Math.random() - 0.5) * 10;
        this.vy = (Math.random() - 0.5) * 10;
        this.size = Math.random() * 2 + 0.5;
        this.color = `rgba(255, ${50 + Math.random() * 100}, ${100 + Math.random() * 100}, ${0.4 + Math.random() * 0.6})`;
        this.friction = 0.94;
        this.ease = 0.05;
        this.state = 'idle'; 
    }

    update() {
        if (this.state === 'explode') {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= this.friction;
            this.vy *= this.friction;
        } else if (this.state === 'forming' || this.state === 'merging') {
            const dx = this.targetX - this.x;
            const dy = this.targetY - this.y;
            this.x += dx * this.ease;
            this.y += dy * this.ease;
            // 微動效果
            this.x += (Math.random() - 0.5) * 0.5;
            this.y += (Math.random() - 0.5) * 0.5;
        } else if (this.state === 'shot') {
             this.x += (Math.random() - 0.5) * 10;
             this.y += (Math.random() - 0.5) * 10;
        }
    }

    draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// --- 3. 粒子特效主邏輯 ---
function initParticleView(textLeft, textRight, finalMsg) {
    const stage = document.getElementById('stage-container');
    canvas = document.getElementById('particle-canvas');
    const startOverlay = document.getElementById('start-overlay');
    
    if (!stage || !canvas) return;

    stage.style.display = 'block';
    const form = document.getElementById('creation-form-container');
    if(form) form.style.display = 'none';

    ctx = canvas.getContext('2d');

    // 視窗調整
    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }
    window.addEventListener('resize', resize);
    resize();

    // 初始化粒子
    const PARTICLE_COUNT = 1000;
    particles = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle());
    }

    // 開始動畫迴圈
    animate();

    // 點擊事件
    if (startOverlay) {
        startOverlay.addEventListener('click', () => {
            playSequence(startOverlay, textLeft, textRight, finalMsg);
        });
    }
}

// --- 4. 動畫迴圈 ---
function animate() {
    if (!ctx) return;
    ctx.clearRect(0, 0, width, height);
    
    particles.forEach(p => {
        p.update();
        p.draw();
    });

    drawArrow();
    requestAnimationFrame(animate);
}

// --- 5. 畫箭頭 ---
function drawArrow() {
    if (!arrow.active || !ctx) return;
    arrow.x += 20;

    ctx.fillStyle = '#ffd700';
    ctx.shadowBlur = 20;
    ctx.shadowColor = '#ffd700';
    ctx.beginPath();
    ctx.arc(arrow.x, arrow.y, 4, 0, Math.PI*2);
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.strokeStyle = 'rgba(255, 215, 0, 0.5)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(arrow.x, arrow.y);
    ctx.lineTo(arrow.x - 100, arrow.y);
    ctx.stroke();
}

// --- 6. 愛心數學公式 ---
function getHeartPoint(t, scale = 10, offsetX = 0, offsetY = 0) {
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
    return {
        x: x * scale + width / 2 + offsetX,
        y: y * scale + height / 2 + offsetY
    };
}

// --- 7. 動畫劇本 (Timeline) ---
function playSequence(overlay, t1, t2, msg) {
    const HEART_SCALE = Math.min(width, height) / 45;

    // 隱藏遮罩
    gsap.to(overlay, { opacity: 0, duration: 1, onComplete: () => overlay.style.display = 'none' });
    
    // 爆炸
    particles.forEach(p => p.state = 'explode');

    // 1.2秒後成形
    setTimeout(() => {
        const half = particles.length / 2;
        const offset = width < 600 ? 60 : 120;
        
        particles.forEach((p, i) => {
            p.state = 'forming';
            p.ease = 0.03 + Math.random() * 0.05;
            const t = Math.PI * 2 * Math.random();
            
            if (i < half) {
                const point = getHeartPoint(t, HEART_SCALE * 0.8, -offset, -20);
                p.targetX = point.x;
                p.targetY = point.y;
                p.color = `rgba(255, 100, 150, ${0.5 + Math.random()*0.5})`;
            } else {
                const point = getHeartPoint(t, HEART_SCALE * 0.8, offset, -20);
                p.targetX = point.x;
                p.targetY = point.y;
                p.color = `rgba(255, 150, 150, ${0.5 + Math.random()*0.5})`;
            }
        });

        // 顯示名字
        const nameL = document.getElementById('name-left');
        const nameR = document.getElementById('name-right');
        if (nameL && nameR) {
            nameL.textContent = t1 || "User";
            nameR.textContent = t2 || "Lover";
            nameL.style.left = `calc(50% - ${offset}px)`;
            nameL.style.top = '50%';
            nameR.style.left = `calc(50% + ${offset}px)`;
            nameR.style.top = '50%';
            
            gsap.to('.floating-text', { opacity: 1, duration: 2, delay: 1 });
        }
    }, 1200);

    // 5秒後合併
    setTimeout(() => {
        gsap.to('.floating-text', { opacity: 0, duration: 1 });

        particles.forEach(p => {
            p.state = 'merging';
            const t = Math.PI * 2 * Math.random();
            const scaleVar = (0.8 + Math.random() * 0.4);
            const point = getHeartPoint(t, HEART_SCALE * 1.2 * scaleVar, 0, -20);
            p.targetX = point.x;
            p.targetY = point.y;
            p.color = Math.random() > 0.8 ? '#ffd700' : '#ff0044';
        });
    }, 5000);

    // 8秒後射箭
    setTimeout(() => {
        arrow.active = true;
        arrow.y = height / 2 - 20;
        
        // 箭穿心震動
        setTimeout(() => {
            particles.forEach(p => {
                p.x += (Math.random()-0.5) * 50;
                p.y += (Math.random()-0.5) * 50;
            });
        }, 600);
    }, 8000);

    // 9秒後顯示文字
    setTimeout(() => {
        const msgDiv = document.getElementById('final-message');
        if (msgDiv) {
            msgDiv.textContent = msg || "Happy Valentine's Day";
            gsap.to(msgDiv, { opacity: 1, y: -20, duration: 2, ease: "power2.out" });
        }
    }, 9000);
}
