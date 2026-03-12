// 雪花特效
function createSnowflake() {
    const snowflake = document.createElement('div');
    snowflake.innerHTML = '❄️';
    snowflake.style.position = 'fixed';
    snowflake.style.left = Math.random() * 100 + 'vw';
    snowflake.style.top = '-20px';
    snowflake.style.fontSize = (Math.random() * 10 + 10) + 'px';
    snowflake.style.pointerEvents = 'none';
    snowflake.style.zIndex = '9998';
    snowflake.style.opacity = Math.random() * 0.5 + 0.3;
    document.body.appendChild(snowflake);
    
    const duration = Math.random() * 3000 + 3000;
    snowflake.animate([
        { transform: 'translateY(0) rotate(0deg)', opacity: 0.8 },
        { transform: `translateY(${window.innerHeight + 20}px) rotate(${Math.random() * 720}deg)`, opacity: 0 }
    ], {
        duration: duration,
        easing: 'linear'
    }).onfinish = () => snowflake.remove();
}

// 每 2 秒创建一个雪花
setInterval(createSnowflake, 2000);

// 创建 10 个初始雪花
for (let i = 0; i < 10; i++) {
    setTimeout(createSnowflake, i * 300);
}
