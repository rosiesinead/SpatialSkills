from flask import Flask, render_template, request, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import func
from flask_login import LoginManager, UserMixin, login_user,login_required, logout_user,current_user
import json
import pandas as pd

app = Flask(__name__)

#connect to database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///ssdatabase.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'secretkey'

#create a database variable
db = SQLAlchemy(app)

#initialise login manager
login_manager = LoginManager()
login_manager.init_app(app)

#create database model for exercises table
class Exercises(db.Model):
    exercise_number = db.Column(db.Integer, primary_key=True)
    question_number = db.Column(db.Integer, primary_key=True)
    exercise_data = db.Column(db.String(10000))

#create database model for users table
class Users(db.Model,UserMixin ):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255),unique=True)
    role = db.Column(db.String(255), default='user')

#create database model for progress table
class Progress(db.Model,UserMixin ):
    user_id = db.Column(db.Integer, db.ForeignKey('Users.id'), primary_key=True)
    exercise_number = db.Column(db.Integer, primary_key=True)
    question_number = db.Column(db.Integer, primary_key=True)
    answer_canvas = db.Column(db.Integer, primary_key=True)
    complete = db.Column(db.Integer, default=0)
    answer_data = db.Column(db.String(1000000))

#---------------------------------------------------------------------------

@login_manager.user_loader
def load_user(user_id):
    return Users.query.get((int(user_id)))

#start at login page
@app.route('/')
def index():
    return render_template("spatialskills/login.html")

#login process
@app.route('/login', methods=['POST'])
def login():
    #get username from login form
    username = request.form['username']
    #create user variable and query the table by username
    user = Users.query.filter_by(username=username).first()
    #content found in database is now saved in user variable
    #if user is in database then:
    if user:
            #login user in, check role and redirect to appropriate page
            login_user(user)
            if current_user.role == 'admin':
                return redirect(url_for('admin'))
            else:
                return redirect(url_for('homepage'))
    else:
        #add new user to db
        new_user = Users(username=username)
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        return redirect(url_for('homepage'))

#go to homepage  
@app.route('/homepage')
@login_required
def homepage():
    return render_template("spatialskills/index.html", user = current_user.username)

#go to admin page
@app.route('/admin')
@login_required
def admin():
    if current_user.role == 'admin':
        return render_template("spatialskills/Admin_Homepage.html")
    else:
        return redirect(url_for('homepage'))

#logout and return to login page
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


#add a new question to database
@app.route('/newquestion', methods=['POST'])
@login_required
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
@login_required
def getexercises():
    dataframe = pd.read_sql_table('exercises', 'sqlite:///ssdatabase.db')
    senddata = dataframe.to_json(orient='records')
    return json.dumps(senddata)

#get user progress from database
@app.route('/getprogress', methods=['GET'])
@login_required
def getprogress():
    dataframe = pd.read_sql_query("select * from progress where user_id =?", 'sqlite:///ssdatabase.db',params=[current_user.id])
    senddata = dataframe.to_json(orient='records')
    return json.dumps(senddata)

#add user progress to database
@app.route('/writeprogress', methods=['POST'])
@login_required
def writeprogress():
    #receive data and convert to dictionary
    data = json.dumps(request.form)
    dataToDict = json.loads(data)
    #data from dictionary and store in variables
    exercise_number = dataToDict["exercise_number"]
    question_number = dataToDict["question_number"]
    answer_canvas= dataToDict["answer_canvas"]
    complete = dataToDict["complete"]
    answer_data = dataToDict["answer_data"]
    #check if prog already exists in database
    checkProg = db.session.query(Progress).filter_by(user_id=current_user.id,exercise_number=exercise_number,question_number=question_number,answer_canvas=answer_canvas).first()
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
