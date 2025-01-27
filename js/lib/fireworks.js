class Fireworks {
    constructor(container, options = {}) {
        this.container = container;
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.particles = [];
        this.trails = [];
        this.running = false;
        this.launching = true;
        this.options = {
            particleCount: options.particleCount || 120,
            gravity: options.gravity || 0.98,
            speed: options.speed || 8,
            trailLength: options.trailLength || 15,
            maxRockets: options.maxRockets || 3, // 最大同时存在的火箭数
            maxParticles: options.maxParticles || 500, // 最大粒子数
            ...options
        };

        // 预定义多组颜色主题
        this.colorThemes = [
            // 紫色主题
            ['#ff00ff', '#bf00ff', '#9d00ff', '#ffffff', '#e6b3ff', '#cc99ff'],
            // 红色主题
            ['#ff0000', '#ff3333', '#ff6666', '#ff9999', '#ffcccc', '#ffffff'],
            // 金色主题
            ['#ffd700', '#ffed4a', '#fff44f', '#ffffff', '#fffacd', '#ffffe0'],
            // 蓝色主题
            ['#00ffff', '#00ccff', '#0099ff', '#ffffff', '#e6ffff', '#b3ffff'],
            // 彩虹主题
            ['#ff0000', '#ff7f00', '#ffff00', '#00ff00', '#0000ff', '#4b0082', '#8b00ff'],
            // 粉色主题
            ['#ff69b4', '#ff1493', '#ff00ff', '#ffffff', '#ffb6c1', '#ffc0cb'],
            // 绿色主题
            ['#00ff00', '#33ff33', '#66ff66', '#ffffff', '#ccffcc', '#99ff99']
        ];

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
    }

    createRocket() {
        // 检查是否超过最大火箭数
        if (this.trails.length >= this.options.maxRockets) {
            return;
        }

        const x = Math.random() * this.width;
        const y = this.height;
        const angle = Math.PI * 1.5 + (Math.random() * 0.2 - 0.1);
        const speed = this.options.speed * (0.8 + Math.random() * 0.4);
        const rocket = {
            x,
            y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed,
            trail: [],
            color: '#ffffff',
            size: 2,
            exploded: false,
            colorTheme: this.colorThemes[Math.floor(Math.random() * this.colorThemes.length)]
        };
        this.trails.push(rocket);
    }

    createParticles(x, y, colorTheme) {
        // 检查是否超过最大粒子数
        if (this.particles.length >= this.options.maxParticles) {
            return;
        }

        const colors = colorTheme || this.colorThemes[0];
        const particlesToCreate = Math.min(
            this.options.particleCount,
            this.options.maxParticles - this.particles.length
        );
        
        for (let i = 0; i < particlesToCreate; i++) {
            const angle = (Math.PI * 2 * i) / particlesToCreate;
            const variance = Math.random() * 0.4 + 0.8;
            const speed = this.options.speed * variance;
            const particle = {
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                color: colors[Math.floor(Math.random() * colors.length)],
                size: 2 + Math.random() * 2,
                alpha: 1,
                trail: []
            };
            this.particles.push(particle);
        }
    }

    update() {
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.width, this.height);

        // 更新火箭
        for (let i = this.trails.length - 1; i >= 0; i--) {
            const rocket = this.trails[i];
            rocket.x += rocket.vx;
            rocket.y += rocket.vy;
            rocket.vy += this.options.gravity / 40;

            rocket.trail.push({ x: rocket.x, y: rocket.y });
            if (rocket.trail.length > this.options.trailLength) {
                rocket.trail.shift();
            }

            this.ctx.beginPath();
            this.ctx.moveTo(rocket.trail[0].x, rocket.trail[0].y);
            for (let j = 1; j < rocket.trail.length; j++) {
                this.ctx.lineTo(rocket.trail[j].x, rocket.trail[j].y);
            }
            this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
            this.ctx.lineWidth = rocket.size;
            this.ctx.stroke();

            if (rocket.vy > -2 && !rocket.exploded) {
                this.createParticles(rocket.x, rocket.y, rocket.colorTheme);
                this.trails.splice(i, 1);
                rocket.exploded = true;
            }
        }

        // 更新粒子
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.x += p.vx;
            p.y += p.vy;
            p.vy += this.options.gravity / 15;
            p.vx *= 0.99;
            p.vy *= 0.99;
            p.alpha -= 0.005;

            p.trail.push({ x: p.x, y: p.y });
            if (p.trail.length > this.options.trailLength) {
                p.trail.shift();
            }

            if (p.trail.length > 1) {
                this.ctx.beginPath();
                this.ctx.moveTo(p.trail[0].x, p.trail[0].y);
                for (let j = 1; j < p.trail.length; j++) {
                    this.ctx.lineTo(p.trail[j].x, p.trail[j].y);
                }
                this.ctx.strokeStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, '0');
                this.ctx.lineWidth = p.size;
                this.ctx.stroke();
            }

            if (p.alpha <= 0) {
                this.particles.splice(i, 1);
            }
        }

        // 只在launching为true且未超过最大火箭数时发射新烟花
        if (this.running && this.launching && 
            this.trails.length < this.options.maxRockets && 
            Math.random() < 0.05) {
            this.createRocket();
        }

        if (this.running) {
            requestAnimationFrame(() => this.update());
        }
    }

    start() {
        if (!this.running) {
            this.running = true;
            this.launching = true;
            this.update();
        }
    }

    stopLaunching() {
        this.launching = false;
    }

    stop() {
        this.running = false;
        this.launching = false;
        this.particles = [];
        this.trails = [];
        this.ctx.clearRect(0, 0, this.width, this.height);
    }
} 