import os

from flask import Flask, render_template

from callAPI import convert_to_json

app = Flask(__name__)

@app.route("/")
def index():
    """Return the homepage."""
    convert_to_json()
    return render_template("index.html")


if __name__ == "__main__":
    app.run()
