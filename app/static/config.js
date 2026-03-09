var CONFIG = {
    canvas: { width: 480, height: 640 },

    player: { width: 60, height: 65, speed: 6 },

    startingLives: 3,

    items: [
        { type: "commit", color: "#238636", pts: 10, weight: 50, sym: "\u2713" },
        { type: "pr",     color: "#58a6ff", pts: 25, weight: 25, sym: "PR" },
        { type: "star",   color: "#e3b341", pts: 50, weight: 5,  sym: "\u2605" },
        { type: "bug",    color: "#f85149", pts: 0,  weight: 20, sym: "\u2715", bad: true }
    ],

    colors: {
        background: "#0d1117",
        gridLines: "#161b22",
        text: "#c9d1d9",
        headings: "#f0f6fc",
        muted: "#8b949e",
        dimmed: "#6e7681",
        hearts: "#f85149",
        startButton: "#238636"
    }
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = CONFIG;
}
