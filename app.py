from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)


#connect to database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ssdatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

#create a database variable
db = SQLAlchemy(app)

#create database model for exercises table
class Exercises(db.Model):
    exercise_number = db.Column(db.Integer, primary_key=True)
    question_number = db.Column(db.Integer, primary_key=True)
    exercise_data = db.Column(db.String(10000))

#create database model for users table
class Users(db.Model,UserMixin ):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255))
    role = db.Column(db.String(255), default='user')

  
@app.route('/')
def spatialskills():
    getEx1 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.exercise_number==1).all()
    exercise1 = [x[0] for x in getEx1]
    getEx2 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.exercise_number==2).all()
    exercise2 = [x[0] for x in getEx2]
    getEx3 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.exercise_number==3).all()
    exercise3 = [x[0] for x in getEx3]
    getEx4 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.exercise_number==4).all()
    exercise4 = [x[0] for x in getEx4]
    getEx5 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.exercise_number==5).all()
    exercise5 = [x[0] for x in getEx5]
    getEx6 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.exercise_number==6).all()
    exercise6 = [x[0] for x in getEx6]
    return render_template("spatialskills/index.html", exercise1=exercise1,exercise2=exercise2,exercise3=exercise3,exercise4=exercise4,exercise5=exercise5,exercise6=exercise6)

if __name__ == "__main__":
    app.run(debug=True)
