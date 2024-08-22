import React, { useRef, useEffect, useState } from 'react';
import './App.css';

const DuelGame = () => {
    const canvasRef = useRef(null);
    const [hero1, setHero1] = useState({ x: 50, y: 100, direction: 1, speed: 1, projectileColor: 'black', fireRate: 140 });
    const [hero2, setHero2] = useState({ x: 950, y: 100, direction: -1, speed: 3, projectileColor: 'green', fireRate: 150 });
    const [projectiles, setProjectiles] = useState([]);
    const [score, setScore] = useState({ hero1: 0, hero2: 0 });

    const canvasWidth = 1000;
    const canvasHeight = 400;

    // функция создания заклинаний
    const shootProjectile = (x, y, direction, color) => {
        setProjectiles((prev) => [...prev, { x, y, direction, color }]);
    };

    useEffect(() => {
        const ctx = canvasRef.current.getContext('2d');
        let animationFrameId;

        const draw = () => {
            ctx.clearRect(0, 0, canvasWidth, canvasHeight);

            // Рисуем героев
            ctx.fillStyle = 'red';
            ctx.beginPath();
            ctx.arc(hero1.x, hero1.y, 20, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = 'blue';
            ctx.beginPath();
            ctx.arc(hero2.x, hero2.y, 20, 0, Math.PI * 2);
            ctx.fill();

            // Рисуем заклинания
            projectiles.forEach((proj, index) => {
                ctx.fillStyle = proj.color;
                ctx.beginPath();
                ctx.arc(proj.x, proj.y, 5, 0, Math.PI * 2);
                ctx.fill();

                // Двигаем заклинание
                proj.x += proj.direction * 20;

                // Логика столкновения с героями
                if (proj.x > canvasWidth || proj.x < 10) {
                    setProjectiles((prev) => prev.filter((_, i) => i !== index)); // Удаляем за пределами
                }

                // Проверка на столкновение с героем 1
                if (proj.x < hero1.x + 10 && proj.x > hero1.x - 20 && proj.y < hero1.y + 20 && proj.y > hero1.y - 20) {
                    setScore((prev) => ({ ...prev, hero2: prev.hero2 + 1 }));
                    setProjectiles((prev) => prev.filter((_, i) => i !== index)); // Удаляем после попадания
                }

                // Проверка на столкновение с героем 2
                if (proj.x < hero2.x + 10 && proj.x > hero2.x - 20 && proj.y < hero2.y + 20 && proj.y > hero2.y - 20) {
                    setScore((prev) => ({ ...prev, hero1: prev.hero1 + 1 }));
                    setProjectiles((prev) => prev.filter((_, i) => i !== index)); // Удаляем после попадания
                }
            });

            // Двигаем героев
            hero1.y += hero1.direction * hero1.speed;
            hero2.y += hero2.direction * hero2.speed;

            // Логика отскока от границ
            if (hero1.y <= 20 || hero1.y >= canvasHeight - 20) {
                hero1.direction *= -1;
            }
            if (hero2.y <= 20 || hero2.y >= canvasHeight - 20) {
                hero2.direction *= -1;
            }

            animationFrameId = requestAnimationFrame(draw);
        };

        draw();

        return () => {
            cancelAnimationFrame(animationFrameId);
        };
    }, [hero1, hero2, projectiles]);

    // Логика стрельбы
    useEffect(() => {
        const shootInterval1 = setInterval(() => {
            shootProjectile(hero1.x, hero1.y, 1, hero1.projectileColor);
        }, hero1.fireRate);

        const shootInterval2 = setInterval(() => {
            shootProjectile(hero2.x, hero2.y, -1, hero2.projectileColor);
        }, hero2.fireRate);

        return () => {
            clearInterval(shootInterval1);
            clearInterval(shootInterval2);
        };
    }, [hero1.fireRate, hero2.fireRate, hero1.projectileColor, hero2.projectileColor, hero1.x, hero1.y, hero2.x, hero2.y]);

    // Попробуйте использовать disptach для изменения конфигурации каждого героя
    const updateHero1Color = (color) => {
        setHero1((prev) => ({ ...prev, projectileColor: color }));
    };

    const updateHero2Color = (color) => {
        setHero2((prev) => ({ ...prev, projectileColor: color }));
    };

    return (
        <div>
            <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
            <div>
                <h2>Score: Hero 1 - {score.hero1} | Hero 2 - {score.hero2}</h2>
                <div>
                    <h3>Hero 1 Settings</h3>
                    <label>
                        Color:
                        <input type="color" onChange={(e) => updateHero1Color(e.target.value)} />
                    </label>
                    <label>
                        Speed:
                        <input type="range" min="1" max="10" value={hero1.speed} onChange={(e) => setHero1((prev) => ({ ...prev, speed: Number(e.target.value) }))} />
                    </label>
                    <label>
                        Fire Rate:
                        <input type="range" min="10" max="500" value={hero1.fireRate} onChange={(e) => setHero1((prev) => ({ ...prev, fireRate: Number(e.target.value) }))} />
                    </label>
                </div>
                <div>
                    <h3>Hero 2 Settings</h3>
                    <label>
                        Color:
                        <input type="color" onChange={(e) => updateHero2Color(e.target.value)} />
                    </label>
                    <label>
                        Speed:
                        <input type="range" min="1" max="10" value={hero2.speed} onChange={(e) => setHero2((prev) => ({ ...prev, speed: Number(e.target.value) }))} />
                    </label>
                    <label>
                        Fire Rate:
                        <input type="range" min="10" max="500" value={hero2.fireRate} onChange={(e) => setHero2((prev) => ({ ...prev, fireRate: Number(e.target.value) }))} />
                    </label>
                </div>
            </div>
        </div>
    );
};

export default DuelGame;
