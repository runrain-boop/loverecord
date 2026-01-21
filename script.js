document.addEventListener('DOMContentLoaded', () => {
    // 1. 檢查網址參數，判斷是「創造模式」還是「觀看模式」
    const urlParams = new URLSearchParams(window.location.search);
    const heart1Text = urlParams.get('h1');
    const heart2Text = urlParams.get('h2');
    const msgText = urlParams.get('msg');

    // 如果網址有參數，進入「觀看模式」
    if (heart1Text || heart2Text || msgText) {
        initViewMode(heart1Text, heart2Text, msgText);
    } else {
        // 否則，進入「創造模式」
        initCreationMode();
    }
});

// ==========================================
// 創造模式邏輯 (填寫表單產生連結)
// ==========================================
function initCreationMode() {
    const formContainer = document.getElementById('creation-form-container');
    const stageContainer = document.getElementById('stage-container');
    const generateBtn = document.getElementById('generate-btn');
    const resultArea = document.getElementById('result-area');
    const generatedUrlTextarea = document.getElementById('generated-url');
    const previewLink = document.getElementById('preview-link');

    // 顯示表單，隱藏舞台
    formContainer.style.display = 'block';
    stageContainer.style.display = 'none';

    generateBtn.addEventListener('click', () => {
        const h1 = document.getElementById('input-h1').value || 'Love';
        const h2 = document.getElementById('input-h2').value || 'You';
        const msg = document.getElementById('input-msg').value || 'Happy Valentine\'s Day!';

        // 建立基本的 URL 物件
        const baseUrl = window.location.protocol + "//" + window.location.host + window.location.pathname;
        const newUrl = new URL(baseUrl);
        
        // 加入參數 (使用 encodeURIComponent 處理特殊字符和中文)
        newUrl.searchParams.set('h1', h1);
        newUrl.searchParams.set('h2', h2);
        newUrl.searchParams.set('msg', msg);

        // 顯示結果
        resultArea.style.display = 'block';
        generatedUrlTextarea.value = newUrl.toString();
        previewLink.href = newUrl.toString();
    });
}


// ==========================================
// 觀看模式邏輯 (執行 GSAP 動畫)
// ==========================================
function initViewMode(h1, h2, msg) {
    const formContainer = document.getElementById('creation-form-container');
    const stageContainer = document.getElementById('stage-container');

    // 隱藏表單，顯示舞台
    formContainer.style.display = 'none';
    stageContainer.style.display = 'flex';

    // 1. 設定客製化文字
    document.getElementById('text-h1').textContent = h1 || "Jack";
    document.getElementById('text-h2').textContent = h2 || "Rose";
    document.getElementById('final-message-text').textContent = msg || "Happy Valentine's Day!";

    // 2. 建立 GSAP 動畫時間軸
    const tl = gsap.timeline({ defaults: { ease: "power2.inOut" } });

    // --- 動畫序列開始 ---

    // [初始狀態設定] 確保愛心在正確位置準備飛出
    gsap.set("#heart-left-group", { x: -20 });
    gsap.set("#heart-right-group", { x: 20 });
    
    tl
    // 步驟 1: 信封打開
    .to("#wax-seal", { duration: 0.3, opacity: 0, scale: 0.5 }, "+=0.5") // 封蠟消失
    .to("#envelope-flap", { duration: 0.6, rotateX: 180, transformOrigin: "top" }, "-=0.1") // 信封蓋打開

    // 步驟 2: 愛心飛出，信封縮小消失
    .addLabel("heartsFlyOut")
    // 信封縮小淡出
    .to("#envelope-group", { duration: 0.8, scale: 0, opacity: 0, ease: "back.in(1.7)" }, "heartsFlyOut")
    // 愛心同時出現、放大並向上飛
    .to("#hearts-container", { 
        duration: 1, 
        opacity: 1, 
        scale: 1.5, // 稍微放大
        y: -50,     // 向上移動
        ease: "elastic.out(1, 0.5)"
    }, "heartsFlyOut-=0.6") // 提前一點開始，產生從信封衝出來的感覺

    // 步驟 3: 兩顆心慢慢放大，並靠近重疊 (1/3)
    .addLabel("heartsConverge")
    .to("#hearts-container", { duration: 1.5, scale: 2.5, y: 0 }, "heartsConverge") // 整體變更大，回到中心 Y 軸
    // 左愛心向右移
    .to("#heart-left-group", { duration: 1.5, x: 35, ease: "slow(0.7, 0.7, false)" }, "heartsConverge") 
    // 右愛心向左移，產生重疊效果 (x 值需要根據 SVG 寬度微調)
    .to("#heart-right-group", { duration: 1.5, x: -35, ease: "slow(0.7, 0.7, false)" }, "heartsConverge")
    
    // 步驟 4: 邱比特之箭穿過
    .to("#arrow-group", { 
        duration: 1.2, 
        opacity: 1,
        x: "300%", // 從左側畫面外穿到右側畫面外
        ease: "power4.inOut"
    }, "-=0.5") // 在愛心快重疊好時射出

    // 愛心被射中時的震動效果 (增加動態感)
    .to("#hearts-container", { duration: 0.1, scale: 2.6, yoyo: true, repeat: 1, ease: "linear" }, "-=0.9")

    // 步驟 5: 底下出現文字
    .to("#final-message-container", { duration: 1, opacity: 1, y: -20, ease: "power2.out" }, "+=0.3");
}
