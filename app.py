import os

from flask import Flask, render_template, jsonify

from callAPI import convert_to_json

app = Flask(__name__)

@app.route("/")
def index():
    """Return the homepage."""
    return render_template("index.html")

@app.route('/data')
def get():
	dictionary = convert_to_json()
	return jsonify(dictionary)

if __name__ == "__main__":
    app.run()
