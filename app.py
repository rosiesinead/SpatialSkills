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
    username = db.Column(db.String(255),primary_key=True)
    role = db.Column(db.String(255), default='user')

#create database model for progress table
class Progress(db.Model,UserMixin ):
    username = db.Column(db.String(255), primary_key=True)
    exercise_number = db.Column(db.Integer, primary_key=True)
    question_number = db.Column(db.Integer, primary_key=True)
    answer_canvas = db.Column(db.Integer, primary_key=True)
    attempted = db.Column(db.Integer, default=0)
    complete = db.Column(db.Integer, default=0)
    answer_data = db.Column(db.String(1000000))

#---------------------------------------------------------------------------

#start at login page
@app.route('/')
def spatialskills():
    return render_template("spatialskills/login.html")

#login process
@app.route('/login', methods=['POST'])
def login():
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


#go to homepage  
@app.route('/homepage')
def homepage():
    return render_template("spatialskills/index.html")

#go to admin page
@app.route('/admin')
def admin():
    return render_template("spatialskills/Admin_Homepage.html")

#add a new question to database
@app.route('/newquestion', methods=['POST'])
def newquestion():
    #receive data and convert to dictionary
    data = json.dumps(request.form)
    dataToDict = json.loads(data)
    #get exercise number and exercise data from dictionary and store in variables
    ex_num = dataToDict["ex_num"]
    ex_data = dataToDict["ex_data"]
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
def getexercises():
    dataframe = pd.read_sql_table('exercises', 'sqlite:///ssdatabase.db')
    senddata = dataframe.to_json(orient='records')
    return json.dumps(senddata)

#get user progress from database
@app.route('/getprogress', methods=['GET'])
def getprogress():
    username = 'rosie'
    dataframe = pd.read_sql_query("select * from progress where username =?", 'sqlite:///ssdatabase.db',params=[username])
    senddata = dataframe.to_json(orient='records')
    return json.dumps(senddata)

#add user progress to database
@app.route('/writeprogress', methods=['POST'])
def writeprogress():
    #receive data and convert to dictionary
    data = json.dumps(request.form)
    dataToDict = json.loads(data)
    #data from dictionary and store in variables
    username = dataToDict["username"]
    exercise_number = dataToDict["exercise_number"]
    question_number = dataToDict["question_number"]
    answer_canvas= dataToDict["answer_canvas"]
    complete = dataToDict["complete"]
    answer_data = dataToDict["answer_data"]
    #check if prog already exists in database
    checkProg = db.session.query(Progress).filter_by(username=username,exercise_number=exercise_number,question_number=question_number,answer_canvas=answer_canvas).first()
    #if it does, check whether it has been completed already and if so don't change anything
    #otherwise update complete and answer_data columns
    if checkProg:
        if checkProg.complete==1:
            return ""
        else:
            checkProg.complete = complete            
            check_stat.answer_data=answer_data
            db.session.commit()
    #if stat doesn't already exist then add it
    else:
        db.session.execute(Progress.__table__.insert(), dataToDict)
        db.session.commit()
    return ""

if __name__ == "__main__":
    app.run(debug=True)
