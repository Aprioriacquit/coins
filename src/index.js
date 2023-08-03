import * as PIXI from 'pixi.js';
import { Emitter } from 'pixi-particles';
import gsap from 'gsap';

const app = new PIXI.Application({
    width: window.innerWidth,
    height: window.innerHeight,
    backgroundColor: 0x000000,
});
document.body.appendChild(app.view);

// массив с текстурами монетки для плавного вращения
const coinTextures = [];
for (let i = 0; i <= 10; i++) {
    const texture = PIXI.Texture.from(`images/coin_${i}.png`);
    coinTextures.push(texture);
}

// Настройки для эмиттера
const emitterConfig = {
    alpha: {
        start: 1,
        end: 0.5
    },
    scale: {
        start: 0.6,
        end: 0,
        minimumScaleMultiplier: 1
    },
    color: {
        start: "#ffffff",
        end: "#ffffff"
    },
    speed: {
        start: 350,
        end: 300,
        minimumSpeedMultiplier: 3
    },
    acceleration: {
        x: 0,
        y: 500
    },
    maxSpeed: 0,
    startRotation: {
        min: -125,
        max: -55
    },
    noRotation: false,
    rotationSpeed: {
        min: 200,
        max: 360
    },
    lifetime: {
        min: 2,
        max: 2.5
    },
    blendMode: "normal",
    frequency: 0.01,
    emitterLifetime: -1,
    maxParticles: 200,
    pos: {
        x: 0,
        y: 1000
    },
    addAtBack: false,
    spawnType: "rect",
    spawnRect: {
        x: 0,
        y: -40,
        w: 0,
        h: 100
    }
};


// Сам эмиттер
const emitter = new Emitter(app.stage, coinTextures, emitterConfig);
emitter.emit = true; // Запускаем эмиттер

// Функция для создания новых монеток
function createCoin() {
    const coinSprite = new PIXI.Sprite(coinTextures[0]); // Используем текстуру coin_0 для начальной позиции
    coinSprite.anchor.set(0.5);
    app.stage.addChild(coinSprite);

    // Начальная позиция монетки (вылетают снизу по центру)
    coinSprite.x = app.renderer.width / 2;
    coinSprite.y = app.renderer.height + 80;

    // Случайное направление для движения монетки
    const directionX = Math.random() < 0.5 ? -1 : 1;
    const directionY = -1; //-1, чтобы движение было вверх
    const randomX = Math.random() * 700 * directionX; // Увеличиваем дистанцию полета в стороны
    const randomY = Math.random() * 1200 * directionY; // Увеличиваем дистанцию полета вверх

    // Анимация движения монетки в разные стороны и исчезновения
    gsap.to(coinSprite, {
        x: coinSprite.x + randomX,
        y: coinSprite.y + randomY,
        alpha: 0,
        duration: 3,
        ease: 'power2.in',
        onComplete: () => {
            app.stage.removeChild(coinSprite); // Удаление монетки после окончания анимации
        },
    });

    // Анимация плавного вращения монетки в полете
    gsap.to(coinSprite, {
        rotation: Math.PI * 2, // Поворачиваем на 360 градусов (один оборот)
        duration: 0.8,
        ease: 'linear',
        repeat: -1, // Зацикливаем анимацию поворота только для текущей монетки
        onUpdate: () => {
            // Обновляем текстуру монетки в процессе анимации вращения
            const textureIndex = Math.floor(
                (coinSprite.rotation / (Math.PI * 2)) * coinTextures.length
            );
            coinSprite.texture = coinTextures[textureIndex];
        },
    });
}

// Создаем новую монетку каждые 0.1 секунды
gsap.to({}, {
    repeat: -1,
    duration: 0.2,
    onRepeat: createCoin,
});
