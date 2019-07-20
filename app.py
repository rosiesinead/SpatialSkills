from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ssdatabase.db'
db = SQLAlchemy(app)
db.Model.metadata.reflect(db.engine)

class Exercises(db.Model):
    __table__ = db.Model.metadata.tables['exercises']

  
@app.route('/')
def spatialskills():
    colEx1 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.section==1).all()
    exercise1 = [x[0] for x in colEx1]
    #exercise1 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.section==1).filter(Exercises.number==1).scalar()
    return render_template("spatialskills/index.html", exercise1=exercise1)

if __name__ == "__main__":
    app.run(debug=True)
