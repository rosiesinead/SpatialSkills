from flask import Flask, render_template, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_marshmallow import Marshmallow
import json

app = Flask(__name__)

#connect to database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///C:/Users/teste/OneDrive - University of Glasgow/Project Practice Space/Database Exercise/practicecopy.db'
app.config['SECRET_KEY']='secretkey'

#create a database variale
db = SQLAlchemy(app)

db.Model.metadata.reflect(db.engine)

ma = Marshmallow(app)

#create class which will be database model
class Exercises(db.Model):
    #add table columns
    __table__ = db.Model.metadata.tables['exercises']

class ExercisesSchema(ma.ModelSchema):
    class Meta:
        model = Exercises
          


@app.route('/')
def login():
    listEx1 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.exercise_number==1).all()
    exercise1 = [x[0] for x in listEx1]
    #exercise_schema =ExercisesSchema
   # output = exercise_schema.dump(exercise1).data

    #exercise12 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.exercise_number==1).filter(Exercises.number==2).first()
    #exercise13 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.exercise_number==1).filter(Exercises.number==3).first()
    #exercise14 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.exercise_number==1).filter(Exercises.number==4).first()
    #exercise15 = Exercises.query.with_entities(Exercises.exercise_data).filter(Exercises.exercise_number==1).filter(Exercises.number==5).first()
    
    return render_template('index.html', exercise1=exercise1)#,exercise12=exercise12,exercise13=exercise13,exercise14=exercise14,exercise15=exercise15)
    #return jsonify({output})

if __name__ == "__main__":
    app.run(debug=True)