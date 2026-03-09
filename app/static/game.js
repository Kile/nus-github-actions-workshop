var canvas = document.getElementById("game-canvas");
var ctx = canvas.getContext("2d");

var W = CONFIG.canvas.width;
var H = CONFIG.canvas.height;
canvas.width = W;
canvas.height = H;

var octocatImg = new Image();
octocatImg.src = "img/octocat.svg";

var keys = {};
var player, items, particles, floats;
var score, lives, level, frame, spawnTimer;
var running = false;
var over = false;
var highScores = loadScores();

resetState();

// ---- Local storage ----

function loadScores() {
    try { return JSON.parse(localStorage.getItem("octoScores")) || []; }
    catch (e) { return []; }
}

function saveScore(val) {
    highScores.push({ score: val, date: new Date().toLocaleDateString() });
    highScores.sort(function (a, b) { return b.score - a.score; });
    highScores = highScores.slice(0, 10);
    localStorage.setItem("octoScores", JSON.stringify(highScores));
    refreshBoard();

    fetch("/api/scores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: "Player", score: val })
    }).catch(function () {});
}

function refreshBoard() {
    var ol = document.getElementById("high-scores");
    var msg = document.getElementById("no-scores");
    ol.innerHTML = "";
    highScores.forEach(function (s) {
        var li = document.createElement("li");
        li.textContent = s.score + " pts \u2014 " + s.date;
        ol.appendChild(li);
    });
    if (msg) msg.style.display = highScores.length ? "none" : "";
}

// ---- State ----

function resetState() {
    var pw = CONFIG.player.width;
    var ph = CONFIG.player.height;
    player = { x: W / 2 - pw / 2, y: H - ph - 20, w: pw, h: ph };
    items = [];
    particles = [];
    floats = [];
    score = 0;
    lives = CONFIG.startingLives;
    level = 1;
    frame = 0;
    spawnTimer = 0;
}

// ---- Spawning ----

function spawn() {
    var t = pickType(CONFIG.items, Math.random());
    items.push({
        x: Math.random() * (W - 28), y: -28, w: 28, h: 28,
        speed: getBaseSpeed(level) + Math.random(),
        color: t.color, pts: t.pts, sym: t.sym, bad: t.bad
    });
}

// ---- Effects ----

function burst(x, y, color) {
    for (var i = 0; i < 7; i++) {
        particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 5,
            vy: (Math.random() - 0.5) * 5,
            life: 18 + Math.random() * 12,
            color: color
        });
    }
}

function addFloat(x, y, text, color) {
    floats.push({ x: x, y: y, text: text, color: color, life: 28 });
}

// ---- Update ----

function update() {
    if (keys.ArrowLeft || keys.a) player.x -= CONFIG.player.speed;
    if (keys.ArrowRight || keys.d) player.x += CONFIG.player.speed;
    player.x = clampX(player.x, player.w, W);

    spawnTimer++;
    var rate = getSpawnRate(level);
    if (spawnTimer >= rate) { spawn(); spawnTimer = 0; }

    level = getLevel(score);

    for (var i = items.length - 1; i >= 0; i--) {
        var it = items[i];
        it.y += it.speed;

        if (overlaps(player, it)) {
            burst(it.x + 14, it.y + 14, it.color);
            if (it.bad) {
                lives--;
                addFloat(it.x + 14, it.y, "-1 \u2665", it.color);
                if (lives <= 0) { endGame(); return; }
            } else {
                score += it.pts;
                addFloat(it.x + 14, it.y, "+" + it.pts, it.color);
            }
            items.splice(i, 1);
        } else if (it.y > H) {
            items.splice(i, 1);
        }
    }

    for (var i = particles.length - 1; i >= 0; i--) {
        var p = particles[i];
        p.x += p.vx; p.y += p.vy; p.life--;
        if (p.life <= 0) particles.splice(i, 1);
    }

    for (var i = floats.length - 1; i >= 0; i--) {
        floats[i].y -= 1.2; floats[i].life--;
        if (floats[i].life <= 0) floats.splice(i, 1);
    }

    frame++;
}

// ---- Drawing ----

function drawOctocat(x, y, w, h) {
    if (octocatImg.complete && octocatImg.naturalWidth > 0) {
        ctx.drawImage(octocatImg, x, y, w, h);
    } else {
        ctx.fillStyle = "#e6edf3";
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, w / 2.5, 0, Math.PI * 2);
        ctx.fill();
    }
}

function drawItem(it) {
    var cx = it.x + 14;
    var cy = it.y + 14;

    ctx.fillStyle = it.color;
    ctx.beginPath();
    ctx.arc(cx, cy, 14, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#ffffff";
    ctx.font = it.sym.length > 1 ? "bold 10px sans-serif" : "bold 15px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(it.sym, cx, cy + 1);
}

function drawParticles() {
    for (var i = 0; i < particles.length; i++) {
        var p = particles[i];
        ctx.globalAlpha = p.life / 30;
        ctx.fillStyle = p.color;
        ctx.fillRect(p.x - 2, p.y - 2, 4, 4);
    }
    ctx.globalAlpha = 1;
}

function drawFloats() {
    for (var i = 0; i < floats.length; i++) {
        var f = floats[i];
        ctx.globalAlpha = f.life / 28;
        ctx.fillStyle = f.color;
        ctx.font = "bold 14px sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(f.text, f.x, f.y);
    }
    ctx.globalAlpha = 1;
}

function drawHUD() {
    ctx.fillStyle = CONFIG.colors.text;
    ctx.font = "15px sans-serif";
    ctx.textAlign = "left";
    ctx.fillText("Score: " + score, 12, 26);
    ctx.fillText("Level: " + level, 12, 46);

    ctx.textAlign = "right";
    ctx.fillStyle = CONFIG.colors.hearts;
    ctx.font = "20px sans-serif";
    for (var i = 0; i < lives; i++) {
        ctx.fillText("\u2665", W - 14 - i * 22, 28);
    }
}

function drawBackground() {
    ctx.fillStyle = CONFIG.colors.background;
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = CONFIG.colors.gridLines;
    ctx.lineWidth = 1;
    for (var x = 0; x < W; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
    }
    for (var y = 0; y < H; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
    }
}

function drawStart() {
    drawBackground();
    drawOctocat(W / 2 - 60, H / 2 - 150, 120, 120);

    ctx.fillStyle = CONFIG.colors.headings;
    ctx.font = "bold 26px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Octocat Commit Catcher", W / 2, H / 2 + 10);

    ctx.fillStyle = CONFIG.colors.muted;
    ctx.font = "15px sans-serif";
    ctx.fillText("Catch commits, PRs and stars!", W / 2, H / 2 + 42);
    ctx.fillText("Dodge the bugs!", W / 2, H / 2 + 64);

    ctx.fillStyle = CONFIG.colors.dimmed;
    ctx.font = "14px sans-serif";
    ctx.fillText("\u2190 \u2192  or  A / D  to move", W / 2, H / 2 + 100);

    ctx.fillStyle = CONFIG.colors.startButton;
    ctx.font = "bold 17px sans-serif";
    ctx.fillText("Press SPACE to start", W / 2, H / 2 + 145);
}

function drawGameOver() {
    ctx.fillStyle = "rgba(13, 17, 23, 0.88)";
    ctx.fillRect(0, 0, W, H);

    ctx.fillStyle = CONFIG.colors.hearts;
    ctx.font = "bold 34px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Game Over", W / 2, H / 2 - 30);

    ctx.fillStyle = CONFIG.colors.text;
    ctx.font = "22px sans-serif";
    ctx.fillText("Score: " + score, W / 2, H / 2 + 12);

    ctx.fillStyle = CONFIG.colors.startButton;
    ctx.font = "15px sans-serif";
    ctx.fillText("Press SPACE to play again", W / 2, H / 2 + 55);
}

function drawPlaying() {
    drawBackground();
    for (var i = 0; i < items.length; i++) drawItem(items[i]);
    drawParticles();
    drawFloats();
    drawOctocat(player.x, player.y, player.w, player.h);
    drawHUD();
}

// ---- Game flow ----

function endGame() {
    over = true;
    running = false;
    saveScore(score);
}

function startGame() {
    resetState();
    running = true;
    over = false;
}

function loop() {
    if (running) {
        update();
        drawPlaying();
    } else if (over) {
        drawPlaying();
        drawGameOver();
    } else {
        drawStart();
    }
    requestAnimationFrame(loop);
}

// ---- Input ----

document.addEventListener("keydown", function (e) {
    keys[e.key] = true;
    if (e.key === " ") {
        e.preventDefault();
        if (!running) startGame();
    }
});

document.addEventListener("keyup", function (e) {
    keys[e.key] = false;
});

// ---- Init ----

refreshBoard();
loop();
