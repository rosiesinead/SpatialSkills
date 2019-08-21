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
    id = db.Column(db.Integer, primary_key=True)
    exercise_number = db.Column(db.Integer)
    question_number = db.Column(db.Integer)
    question_data = db.Column(db.String(10000))
    question_answers = db.Column(db.String(1000000))

#create database model for exercise types
class Types(db.Model):
    exercise = db.Column(db.Integer, primary_key=True)
    answer_type = db.Column(db.String(30))
    question_type = db.Column(db.String(30))

#create database model for users table
class Users(db.Model,UserMixin ):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255),unique=True)
    role = db.Column(db.String(255), default='user')

#create database model for progress table
class Progress(db.Model,UserMixin ):
    user_id = db.Column(db.Integer, primary_key=True)
    exercise_id =db.Column(db.Integer, primary_key=True)
    # exercise_number = db.Column(db.Integer, primary_key=True)
    # question_number = db.Column(db.Integer, primary_key=True)
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
        #return render_template("spatialskills/Ex6_ADMIN_Reflection.html")
        return render_template("spatialskills/Admin_Homepage.html")
    else:
        return redirect(url_for('homepage'))

#logout and return to login page
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

#---------------------------------------------------------------------------
#--EXERCISES----------------------------------------------------------------
#---------------------------------------------------------------------------

# #add a new question to database
# @app.route('/newquestion', methods=['POST'])
# @login_required
# def newquestion(): 
#     #receive data and convert to dictionary
#     data = json.dumps(request.form)
#     dataToDict = json.loads(data)
#     #get exercise number and exercise data from dictionary and store in variables
#     exerciseNumber = dataToDict["exerciseNumber"]
#     questionData = dataToDict["questionData"]
#     questionAnswers = dataToDict["questionAnswers"]
#     #get highest question number in database for that exercise and increment it
#     questionNumber = db.session.query(func.max(Exercises.question_number)).filter_by(exercise_number=exerciseNumber).scalar() + 1
#     #create new exercise
#     newExercise = Exercises(exercise_number=exerciseNumber, question_number=questionNumber,question_data=questionData, question_answers=questionAnswers)
#     #commit to database
#     db.session.add(newExercise)
#     db.session.commit()
#     return ""

#edit a question
@app.route('/savequestion', methods=['POST'])
@login_required
def editquestion():
    #receive data and convert to dictionary
    data = json.dumps(request.form)
    dataToDict = json.loads(data)
    #data from dictionary and store in variables
    exerciseNumber = dataToDict["exerciseNumber"]
    questionNumber = dataToDict["questionNumber"]
    questionData = dataToDict["questionData"]
    questionAnswers = dataToDict["questionAnswers"]
    #Get question from database and update
    getQuestion = db.session.query(Exercises).filter_by(exercise_number=exerciseNumber,question_number=questionNumber).first()
    if getQuestion:
        getQuestion.question_data = questionData
        getQuestion.question_answers = questionAnswers       
        db.session.commit()
    else:
        newExercise = Exercises(exercise_number=exerciseNumber, question_number=questionNumber,question_data=questionData, question_answers=questionAnswers)
        #commit to database
        db.session.add(newExercise)
        db.session.commit()
        # db.session.execute(Exercises.__table__.insert(), dataToDict)
        # db.session.commit()
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
    
#delete a question from the database
@app.route('/deletequestion', methods=['POST'])
@login_required
def deletequestion(): 
    #receive data and convert to dictionary
    data = json.dumps(request.form)
    dataToDict = json.loads(data)
    #data from dictionary and store in variables
    exerciseNumber = dataToDict["exerciseNumber"]
    questionNumber = dataToDict["questionNumber"]
    deleteQu = db.session.query(Exercises).filter_by(exercise_number=exerciseNumber,question_number=questionNumber).first()
    if deleteQu:
        db.session.delete(deleteQu)
        db.session.commit()
        #get exercises from database and update question numbers of those after deleted recod
        for i in db.session.query(Exercises).filter_by(exercise_number=exerciseNumber).all():
            if i.question_number > int(questionNumber):
                i.question_number = i.question_number - 1
                db.session.commit()
    return json.dumps({"redirect":True,"redirect_url":"/admin"}), 200, {'ContentType':'application/json'}
    
#get exercise data from database
@app.route('/getexercises', methods=['GET'])
@login_required
def getexercises():
    dataframe = pd.read_sql_query("SELECT * from exercises AS e, types AS t where e.exercise_number=t.exercise", 'sqlite:///ssdatabase.db')
    senddata = dataframe.to_json(orient='records')
    return json.dumps(senddata)

#---------------------------------------------------------------------------
#--USER PROGRESS------------------------------------------------------------
#---------------------------------------------------------------------------

#get user progress from database
@app.route('/getprogress', methods=['GET'])
@login_required
def getprogress():
    dataframe = pd.read_sql_query("SELECT * from progress as P, exercises as E where P.exercise_id= E.id and P.user_id =?", 'sqlite:///ssdatabase.db',params=[current_user.id])
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
    exId = Exercises.query.with_entities(Exercises.id).filter_by(exercise_number=exercise_number,question_number=question_number).scalar()
    checkProg = db.session.query(Progress).filter_by(user_id=current_user.id,exercise_id=exId,answer_canvas=answer_canvas).first()
    #if it does, check whether it has been completed already and if so don't change anything
    #otherwise update complete and answer_data columns
    if checkProg:
        if checkProg.complete==1:
            return ""
        else:
            checkProg.complete = complete            
            checkProg.answer_data=answer_data
            db.session.commit()
    #if stat doesn't already exist then add it
    else:
        newProgress = Progress(user_id=current_user.id,exercise_id=exId,answer_canvas=answer_canvas,complete=complete,answer_data=answer_data)
        #commit to database
        db.session.add(newProgress)
        db.session.commit()
    return ""




if __name__ == "__main__":
    app.run(debug=True)
