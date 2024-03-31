import React, { useRef, useEffect } from 'react';
import './canvas.css';

class Particle {
    x: number;
    y: number;
    directionX: number;
    directionY: number;
    size: number;
    color: string;

    constructor(x: number, y: number, directionX: number, directionY: number, size: number, color: string) {
        this.x = x;
        this.y = y;
        this.directionX = directionX;
        this.directionY = directionY;
        this.size = size;
        this.color = color;
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
        ctx.fillStyle = 'black';
        ctx.fill();
    }

    update(ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, mouse: { x: number | null; y: number | null; radius: number }) {
        if (this.x > canvas.width || this.x < 0)
            this.directionX = -this.directionX;
        if (this.y > canvas.height || this.y < 0)
            this.directionY = -this.directionY;

        let dx = (mouse.x || 0) - this.x;
        let dy = (mouse.y || 0) - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < (mouse.radius || 0) + this.size) {
            if ((mouse.x || 0) < this.x && this.x < canvas.width - this.size * 10)
                this.x += 1;
            if ((mouse.x || 0) > this.x && this.x > this.size * 10)
                this.x -= 1;
            if ((mouse.y || 0) < this.y && this.y < canvas.height - this.size * 10)
                this.y += 1;
            if ((mouse.y || 0) > this.y && this.y > this.size * 10)
                this.y -= 1;
        }

        this.x += this.directionX;
        this.y += this.directionY;
        this.draw(ctx);
    }
}

function CanvasAnimation() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const mouse = {
        x: null,
        y: null,
        radius: 0
    };

    const handleMouseMove = (event: MouseEvent) => {
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    };

    const handleMouseOut = () => {
        mouse.x = null;
        mouse.y = null;
    };

    const initArr = (canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d');
        let particleArr: Particle[] = [];
        let num = (canvas.height * canvas.width) / 17000;
        for (let j = 0; j < num; j++) {
            let size = (Math.random() * 5) + 1;
            let x = Math.random() * ((window.innerWidth - size * 2) - (size * 2)) + size * 2;
            let y = Math.random() * ((window.innerHeight - size * 2) - (size * 2)) + size * 2;
            let directionX = (Math.random() * .5);
            let directionY = (Math.random()) * .5;
            let color = 'red';
            particleArr.push(new Particle(x, y, directionX, directionY, size, color));
        }
        return particleArr;
    };

    const connectElements = (ctx: CanvasRenderingContext2D, particleArr: Particle[], canvas: HTMLCanvasElement) => {
        let opacityVal = 1;
        for (let x = 0; x < particleArr.length; x++) {
            for (let y = x; y < particleArr.length; y++) {
                let dxi = particleArr[y].x - particleArr[x].x;
                let dyi = particleArr[y].y - particleArr[x].y;
                let distance1 = Math.sqrt((dxi * dxi) + (dyi * dyi));
                if (distance1 < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityVal = 1 - (distance1 / 200);
                    ctx.strokeStyle = 'rgba(255,0,0,' + opacityVal + ')';
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(particleArr[x].x, particleArr[x].y);
                    ctx.lineTo(particleArr[y].x, particleArr[y].y);
                    ctx.stroke();
                }
            }
        }
    };

    const moveElements = (particleArr: Particle[], canvas: HTMLCanvasElement) => {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        for (let i = 0; i < particleArr.length; i++) {
            particleArr[i].update(ctx, canvas, mouse);
        }
        connectElements(ctx, particleArr, canvas);
        requestAnimationFrame(() => moveElements(particleArr, canvas));
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (canvas) {
            window.addEventListener('resize', handleResize);
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            mouse.radius = (canvas.height / 80) * (canvas.width / 80);
            const particles = initArr(canvas);
            moveElements(particles, canvas);
        }
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    const handleResize = () => {
        const canvas = canvasRef.current;
        if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            mouse.radius = (canvas.height / 80) * (canvas.width / 80);
        }
    };

    return (
        <canvas
            ref={canvasRef}
            id="canvas2"
            onMouseMove={handleMouseMove}
            onMouseOut={handleMouseOut}
        />
    );
}

export default CanvasAnimation;
