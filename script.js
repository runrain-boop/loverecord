body {
    margin: 0;
    padding: 0;
    width: 100vw;
    height: 100vh;
    background-color: #050505; /* 深黑色背景 */
    color: white;
    font-family: 'Segoe UI', sans-serif;
    overflow: hidden;
}

/* --- 創造模式表單 (改為深色風格) --- */
#creation-form-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: radial-gradient(circle at center, #1a1a1a 0%, #000000 100%);
}

.form-box {
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 30px;
    border-radius: 15px;
    text-align: center;
    max-width: 350px;
    width: 90%;
    color: #eee;
}

.form-box h2 { color: #ff4d6d; text-shadow: 0 0 10px rgba(255, 77, 109, 0.5); }
.input-group { margin-bottom: 15px; text-align: left; }
.input-group label { color: #aaa; font-size: 0.8em; }
.input-group input, .input-group textarea {
    width: 100%; padding: 10px; 
    background: rgba(0,0,0,0.5); border: 1px solid #444; color: white;
    border-radius: 5px; box-sizing: border-box;
}
#generate-btn {
    background: linear-gradient(45deg, #ff4d6d, #ff8fa3);
    color: white; border: none; padding: 12px; width: 100%;
    border-radius: 25px; cursor: pointer; font-weight: bold; margin-top: 10px;
}
#generated-url {
    background: #111; color: #888; border: 1px solid #333;
    width: 100%; margin-top: 10px; height: 50px;
}
.preview-hint a { color: #ff4d6d; }


/* --- 觀看模式 --- */
#stage-container {
    position: relative;
    width: 100%;
    height: 100%;
}

canvas {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
}

/* 開始前的信封按鈕 */
#start-overlay {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    z-index: 100;
    background: rgba(0,0,0,0.8);
    cursor: pointer;
    transition: opacity 0.5s;
}

.envelope-icon {
    font-size: 80px;
    animation: float 2s ease-in-out infinite;
}

@keyframes float {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-20px); }
}

/* 漂浮的名字文字 */
#text-layer {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    z-index: 10;
    pointer-events: none;
}

.floating-text {
    position: absolute;
    font-size: 1.2rem;
    font-weight: bold;
    color: white;
    opacity: 0; /* 初始隱藏 */
    text-shadow: 0 0 10px rgba(255, 100, 150, 0.8);
    transform: translate(-50%, -50%);
    white-space: nowrap;
}

/* 底部訊息 */
#final-message {
    position: absolute;
    bottom: 10%;
    width: 100%;
    text-align: center;
    color: #ffb3c1;
    font-size: 1.5rem;
    opacity: 0;
    z-index: 10;
    text-shadow: 0 0 15px rgba(255, 77, 109, 0.6);
    padding: 0 20px;
    box-sizing: border-box;
}
