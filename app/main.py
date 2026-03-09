from flask import Flask, jsonify, request

app = Flask(__name__, static_url_path="", static_folder="static")

scores = []


@app.route("/")
def index():
    return app.send_static_file("index.html")


@app.route("/api/health")
def health():
    return jsonify({"status": "healthy"})


@app.route("/api/scores", methods=["GET"])
def get_scores():
    top = sorted(scores, key=lambda s: s["score"], reverse=True)[:10]
    return jsonify(top)


@app.route("/api/scores", methods=["POST"])
def add_score():
    data = request.get_json()
    if not data or "name" not in data or "score" not in data:
        return jsonify({"error": "name and score are required"}), 400

    try:
        score_val = int(data["score"])
    except (TypeError, ValueError):
        return jsonify({"error": "score must be a number"}), 400

    if score_val < 0:
        return jsonify({"error": "score must be non-negative"}), 400

    entry = {"name": str(data["name"])[:20], "score": score_val}
    scores.append(entry)
    return jsonify(entry), 201


if __name__ == "__main__":
    app.run(debug=True, port=5000)
