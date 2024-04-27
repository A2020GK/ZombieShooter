const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const player = {
    texture: new CaImage("textures/player.png"),
    y: canvas.height / 2
}

const bullets = [];
let canShoot = true;
let bulletsLeft=150;

class Bullet {
    static texture = new CaImage("textures/bullet.png");
    constructor(y) {
        this.offsetX = 0;
        this.y = y;
    }
}

const keyboard = { // Keyboard legacy object
    w: false,
    s: false,
    space: false
}
// Keyboard handlers
document.addEventListener("keydown", function (event) {
    const code = event.code;
    const new_state = true;

    if (code == "KeyW" || code == "ArrowUp") keyboard.w = new_state;
    if (code == "KeyS" || code == "ArrowDown") keyboard.s = new_state;
    if (code == "Space") keyboard.space = new_state;
});
document.addEventListener("keyup", function (event) {
    const code = event.code;
    const new_state = false;

    if (code == "KeyW" || code == "ArrowUp") keyboard.w = new_state;
    if (code == "KeyS" || code == "ArrowDown") keyboard.s = new_state;
    if (code == "Space") keyboard.space = new_state;
});

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.font="25px Arial monospace";
    ctx.fillStyle="red";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText(`Bullets left: ${bulletsLeft}`,0,0);

    ctx.drawImage(player.texture, canvas.width - 490 * 0.45 * 0.45, player.y - 75, 330 * 0.45 * 0.45, 490 * 0.45 * 0.45);
    bullets.forEach(bullet => ctx.drawImage(Bullet.texture, canvas.width - 490 * 0.45 * 0.45 - 20 - bullet.offsetX, bullet.y - 65, 351 * 0.175 * 0.45, 186 * 0.175 * 0.45));

}

function app() {
    if (keyboard.w) if (player.y - 75 > 0) player.y -= 4;
    if (keyboard.s) if (player.y - 75 + 490 * 0.45 * 0.45 < canvas.height) player.y += 4;

    if (keyboard.space) {
        if (canShoot) {
            bullets.push(new Bullet(player.y));
            bulletsLeft--;
            canShoot = false;
            if(bulletsLeft>0) setTimeout(() => canShoot = true, 100);
        }
    }

    bullets.forEach((bullet, id) => {
        bullet.offsetX += 3;
        if (canvas.width - 490 * 0.45 * 0.45 - 20 - bullet.offsetX + 351 * 0.175 * 0.45 <= 0) bullets.splice(id,1);
    });
    render();
    requestAnimationFrame(app);
}
app();