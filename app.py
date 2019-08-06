from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from flask_login import LoginManager, UserMixin, login_user,login_required, logout_user
import json
import pandas as pd

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

#start at login page
@app.route('/')
def spatialskills():
    return render_template("spatialskills/login.html")

#login process
@app.route('/processor', methods=['POST'])
def processor():
    #get username from login form
    username = request.form['username']
    #create user variable and query the table by username
    user=Users.query.filter_by(username=username).first()
    #content found in database is now saved in user variable

    #if user is in database then:
    if user:
            #get user role
            role = Users.query.with_entities(Users.role).filter_by(username=username).scalar()
            if role == 'admin':
                return redirect(url_for('admin'))
            else:
                return redirect(url_for('homepage'))
    else:
        #add new user to db
        new_user = Users(username =username)
        db.session.add(new_user)
        db.session.commit()
        return redirect(url_for('homepage'))

#go to admin page
@app.route('/admin')
def admin():
    return render_template("spatialskills/Ex5_ADMIN_RotationsMultiple.html")

#add a new question to database
@app.route('/newquestion', methods=['POST'])
def newquestion():
    #receive data and convert to dictionary
    data = json.dumps(request.form)
    dataTodict = json.loads(data)
    #get exercise number and exercise data from dictionary and store in variables
    ex_num = dataTodict["ex_num"]
    ex_data = dataTodict["ex_data"]
    #get highest question number in database for that exercise and increment it
    qu_num = db.session.query(func.max(Exercises.question_number)).filter_by(exercise_number=ex_num).scalar() + 1
    #create new exercise
    new_ex = Exercises(exercise_number=ex_num, question_number=qu_num,exercise_data =ex_data)
    #commit to database
    db.session.add(new_ex)
    db.session.commit()

    return ""

#send exercise data from database
@app.route('/getexercises', methods=['GET'])
def get_python_data():
    dataframe = pd.read_sql_table('exercises', 'sqlite:///ssdatabase.db')
    senddata = dataframe.to_json(orient='records')
    return json.dumps(senddata)

#get exercises from database and pass to index.
@app.route('/homepage')
def homepage():
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
