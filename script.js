const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

const player = {
    texture: new CaImage("textures/player.png"),
    y: canvas.height / 2
}

let points=0;
let hearts=3;
const bullets = [];
let canShoot = true;
let bulletsLeft = 150;

const zombies = [];
let zombieCanSpawn=true;

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

class Bullet {
    static texture = new CaImage("textures/bullet.png");
    constructor(y) {
        this.offsetX = 0;
        this.y = y;
    }
}
class Zombie {
    static texture = new CaImage("textures/zombie.png");
    constructor() {
        this.x=-805*0.45*0.2;
        this.y=randomNumber(0,canvas.height-1006*0.45*0.2);
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

    ctx.font = "25px Arial monospace";
    ctx.fillStyle = "red";
    ctx.textBaseline = "top";
    ctx.textAlign = "left";
    ctx.fillText(`Points: ${points}`,0,0)
    ctx.fillText(`Bullets left: ${bulletsLeft}`, 0, 25);
    ctx.fillText(`Hearts: ${hearts}`,0,50);

    ctx.drawImage(player.texture, canvas.width - 490 * 0.45 * 0.45, player.y - 75, 330 * 0.45 * 0.45, 490 * 0.45 * 0.45);
    bullets.forEach(bullet => ctx.drawImage(Bullet.texture, canvas.width - 490 * 0.45 * 0.45 - 20 - bullet.offsetX, bullet.y - 65, 351 * 0.175 * 0.45, 186 * 0.175 * 0.45));
    zombies.forEach(zombie=>ctx.drawImage(Zombie.texture,zombie.x,zombie.y,805*0.45*0.2,1006*0.45*0.2));
}

function rectanglesCollide(x0, y0, width0, height0, x1, y1, width1, height1) {
    if (x0 < x1 + width1 &&
        x0 + width0 > x1 &&
        y0 < y1 + height1 &&
        height0 + y0 > y1) {
        return true; // rectangles are colliding
    }
    return false; // rectangles are not colliding
}

function app() {
    if (keyboard.w) if (player.y - 75 > 0) player.y -= 4;
    if (keyboard.s) if (player.y - 75 + 490 * 0.45 * 0.45 < canvas.height) player.y += 4;

    if (keyboard.space) {
        if (canShoot) {
            bullets.push(new Bullet(player.y));
            bulletsLeft--;
            canShoot = false;
            if (bulletsLeft > 0) setTimeout(() => canShoot = true, 100);
        }
    }

    if(zombieCanSpawn) {
        zombies.push(new Zombie());
        zombieCanSpawn=false;
        setTimeout(()=>zombieCanSpawn=true,randomNumber(500,1000));
    }

    bullets.forEach((bullet, id) => {
        bullet.offsetX += 4;
        if (canvas.width - 490 * 0.45 * 0.45 - 20 - bullet.offsetX + 351 * 0.175 * 0.45 <= 0) bullets.splice(id, 1);
    });

    zombies.forEach((zombie,id)=>{
        let zombieSpeed=1;

        if(points<20) zombieSpeed=1;
        else if(19<points) zombieSpeed=2;
        else if(39<points) zombieSpeed=3;
        else if(59<points) zombieSpeed=4;

        zombie.x+=zombieSpeed;

        if(zombie.x>canvas.width) zombies.splice(id,1);
        else if(!rectanglesCollide(zombie.x,zombie.y,805*0.45*0.2,1006*0.45*0.2,canvas.width - 490 * 0.45 * 0.45, player.y - 75, 330 * 0.45 * 0.45, 490 * 0.45 * 0.45)) bullets.forEach((bullet,bid)=>{
            if(rectanglesCollide(zombie.x,zombie.y,805*0.45*0.2,1006*0.45*0.2,canvas.width - 490 * 0.45 * 0.45 - 20 - bullet.offsetX, bullet.y - 65, 351 * 0.175 * 0.45, 186 * 0.175 * 0.45)) {
                zombies.splice(id,1);
                bullets.splice(bid,1);
                points++;
            }
        }); else {
            zombies.splice(id,1);
            hearts--;
        }

    });

    if(hearts<=0) {
        alert("GAME OVER");
        location.reload();
        return;
    }

    if(points>=100) {
        alert("YOU WIN");
        location.reload();
        return;
    }

    render();
    requestAnimationFrame(app);
}
app();