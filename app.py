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
    getEx1 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.section==1).all()
    exercise1 = [x[0] for x in getEx1]
    getEx2 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.section==2).all()
    exercise2 = [x[0] for x in getEx2]
    getEx3 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.section==3).all()
    exercise3 = [x[0] for x in getEx3]
    getEx4 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.section==4).all()
    exercise4 = [x[0] for x in getEx4]
    getEx5 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.section==5).all()
    exercise5 = [x[0] for x in getEx5]
    getEx6 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.section==6).all()
    exercise6 = [x[0] for x in getEx6]
    return render_template("spatialskills/index.html", exercise1=exercise1,exercise2=exercise2,exercise3=exercise3,exercise4=exercise4,exercise5=exercise5,exercise6=exercise6)

if __name__ == "__main__":
    app.run(debug=True)
