from flask import Flask, render_template
app = Flask(__name__)

@app.route('/')
def spatialskills():
    return render_template("spatialskills/index.html")

if __name__ == "__main__":
    app.run(debug=True)
