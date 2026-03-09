function overlaps(a, b) {
    return a.x < b.x + b.w && a.x + a.w > b.x &&
           a.y < b.y + b.h && a.y + a.h > b.y;
}

function getLevel(score) {
    return Math.floor(score / 500) + 1;
}

function getSpawnRate(level) {
    return Math.max(22, 55 - level * 4);
}

function getBaseSpeed(level) {
    return 2 + level * 0.4;
}

function clampX(x, width, canvasWidth) {
    return Math.max(0, Math.min(canvasWidth - width, x));
}

function pickType(items, roll) {
    var total = items.reduce(function (s, i) { return s + i.weight; }, 0);
    var r = roll * total;
    for (var i = 0; i < items.length; i++) {
        r -= items[i].weight;
        if (r <= 0) return items[i];
    }
    return items[0];
}

if (typeof module !== "undefined" && module.exports) {
    module.exports = { overlaps, getLevel, getSpawnRate, getBaseSpeed, clampX, pickType };
}
