document.addEventListener('DOMContentLoaded', () => {
    // 音乐控制
    const bgMusic = document.getElementById('bgMusic');
    const musicToggle = document.getElementById('musicToggle');
    const intro = document.querySelector('.intro');
    const mainContent = document.querySelector('.main-content');
    const contentContainer = document.querySelector('.container');
    const fireworkButton = document.querySelector('.firework-button');
    
    // 点击开场动画进入主页面
    intro.addEventListener('click', () => {
        // 尝试播放音乐
        bgMusic.play().then(() => {
            console.log('音乐播放成功');
        }).catch(err => {
            console.log('音乐播放失败:', err);
        });

        // 开始淡出动画
        intro.style.animation = `fadeOut ${config.timing.introFadeOut}ms ease forwards`;
        setTimeout(() => {
            intro.style.display = 'none';
            showMainContent();
        }, config.timing.introFadeOut);
    });

    // 添加提示点击的文字
    const clickHint = document.createElement('div');
    clickHint.className = 'click-hint';
    clickHint.textContent = '点击进入';
    intro.appendChild(clickHint);

    // 音乐控制按钮
    musicToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        if (bgMusic.paused) {
            bgMusic.play();
            musicToggle.classList.remove('paused');
        } else {
            bgMusic.pause();
            musicToggle.classList.add('paused');
        }
    });
    
    // 显示主内容
    function showMainContent() {
        mainContent.classList.add('show');
        
        setTimeout(() => {
            contentContainer.classList.add('show');
            showGreetings();
            // 显示烟花按钮
            setTimeout(() => {
                fireworkButton.classList.add('show');
            }, 1000); // 延迟1秒显示按钮
        }, config.timing.containerDelay);
    }
    
    // 逐条显示祝福语
    function showGreetings() {
        const greetingElements = document.querySelectorAll('.greeting p');
        greetingElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('show');
            }, config.timing.greetingDelay * index);
        });
    }

    // 初始化烟花
    const fireworksContainer = document.querySelector('.fireworks-container');
    const fireworks = new Fireworks(fireworksContainer, {
        particleCount: 120,    // 每次爆炸的粒子数
        gravity: 0.8,         // 重力效果
        speed: 8,            // 粒子速度
        maxRockets: 4,       // 最大同时存在的火箭数
        maxParticles: 400    // 最大粒子数
    });

    // 烟花按钮点击事件
    let isPlaying = false;
    let stopTimeout;

    // 烟花按钮文字
    const buttonTexts = {
        start: '放赛博烟花 🎆',
        stop: '许个愿吧 ✨'
    };

    fireworkButton.textContent = buttonTexts.start;

    fireworkButton.addEventListener('click', () => {
        // 如果已经在播放，清除之前的停止定时器
        if (stopTimeout) {
            clearTimeout(stopTimeout);
        }
        
        // 如果没有在播放，开始新的播放
        if (!isPlaying) {
            fireworks.start();
            fireworkButton.textContent = buttonTexts.stop;
            isPlaying = true;
        }

        // 无论是否在播放，都重新设置定时器
        stopTimeout = setTimeout(() => {
            fireworks.stopLaunching();
            fireworkButton.textContent = buttonTexts.start;
            
            setTimeout(() => {
                fireworks.stop();
                isPlaying = false;
            }, 3000); // 给3秒时间让现有烟花消失
        }, 8000); // 放烟花持续8秒
    });
}); 