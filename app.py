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

#create database model for exercise table
class Exercises(db.Model):
    exercise = db.Column(db.Integer, primary_key=True)
    answer_type = db.Column(db.String(30))
    question_type = db.Column(db.String(30))

#create database model for questions table
class Questions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    exercise_number = db.Column(db.Integer, db.ForeignKey(Exercises.exercise))
    question_number = db.Column(db.Integer)
    question_data = db.Column(db.String(10000))
    question_answers = db.Column(db.String(1000000))

#create database model for users table
class Users(db.Model,UserMixin ):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(255),unique=True)
    role = db.Column(db.String(255), default='user')

#create database model for progress table
class Progress(db.Model,UserMixin ):
    user_id = db.Column(db.Integer,db.ForeignKey(Users.id, ondelete='CASCADE'), primary_key=True)
    question_id =db.Column(db.Integer, db.ForeignKey(Questions.id,ondelete='CASCADE'),primary_key=True)
    canvas_number = db.Column(db.Integer, primary_key=True)
    canvas_data = db.Column(db.String(1000000))

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
    print(user==None)
    if user:
            print(username==user.username)
            #login user in, check role and redirect to appropriate page
            login_user(user)
            print(current_user.username == username)
            if current_user.role == 'admin':
                return redirect(url_for('admin'))
            else:
                return redirect(url_for('homepage'))
    else:
        #add new user to db
        new_user = Users(username=username)
        print(new_user.username == username)
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        print(current_user.username == new_user.username)
        print(current_user.role == 'user')
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
#@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))

#---------------------------------------------------------------------------
#--EXERCISES----------------------------------------------------------------
#---------------------------------------------------------------------------"

#edit a question
@app.route('/savequestion', methods=['POST'])
@login_required
def editquestion():
    #receive data and convert to dictionary
    data = json.dumps(request.form)
    data_to_dict = json.loads(data)
    #data from dictionary and store in variables
    exercise_number = data_to_dict["exerciseNumber"]
    question_number = data_to_dict["questionNumber"]
    question_data = data_to_dict["questionData"]
    question_answers = data_to_dict["questionAnswers"]
    #Get question from database and update
    get_question = db.session.query(Questions).filter_by(exercise_number=exercise_number,question_number=question_number).first()
    if get_question:
        get_question.question_data = question_data
        get_question.question_answers = question_answers       
        db.session.commit()
    else:
        new_question = Questions(exercise_number=exercise_number, question_number=question_number,question_data=question_data, question_answers=question_answers)
        #commit to database
        db.session.add(new_question)
        db.session.commit()
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 
    
#delete a question from the database
@app.route('/deletequestion', methods=['POST'])
@login_required
def deletequestion(): 
    db.session.execute('pragma foreign_keys=on') # https://stackoverflow.com/questions/2614984/sqlite-sqlalchemy-how-to-enforce-foreign-keys
    #receive data and convert to dictionary
    data = json.dumps(request.form)
    data_to_dict = json.loads(data)
    #data from dictionary and store in variables
    exercise_number = data_to_dict["exerciseNumber"]
    question_number = data_to_dict["questionNumber"]
    delete_qu = db.session.query(Questions).filter_by(exercise_number=exercise_number,question_number=question_number).first()
    if delete_qu:
        db.session.delete(delete_qu)
        db.session.commit()
        #get questions from database and update question numbers of those after deleted recod
        for i in db.session.query(Questions).filter_by(exercise_number=exercise_number).all():
            if i.question_number > int(question_number):
                i.question_number = i.question_number - 1
                db.session.commit()
    return json.dumps({"redirect":True,"redirect_url":"/admin"}), 200, {'ContentType':'application/json'}
    
#get exercise data from database
@app.route('/getexercises', methods=['GET'])
@login_required
def getexercises():
    data_frame = pd.read_sql_query("SELECT * from questions AS Q, exercises AS E where Q.exercise_number=E.exercise", 'sqlite:///ssdatabase.db')
    send_data = data_frame.to_json(orient='records')
    return json.dumps(send_data)

#---------------------------------------------------------------------------
#--USER PROGRESS------------------------------------------------------------
#---------------------------------------------------------------------------

#get user progress from database
@app.route('/getprogress', methods=['GET'])
@login_required
def getprogress():
    data_frame = pd.read_sql_query("SELECT * from Progress as P, Questions as Q WHERE P.question_id= Q.id and P.user_id =?", 'sqlite:///ssdatabase.db',params=[current_user.id])
    send_data = data_frame.to_json(orient='records')
    return json.dumps(send_data)

#add user progress to database
@app.route('/writeprogress', methods=['POST'])
@login_required
def writeprogress():
    #receive data and convert to dictionary
    data = json.dumps(request.form)
    data_to_dict = json.loads(data)
    #data from dictionary and store in variables
    exercise_number = data_to_dict["exerciseNumber"]
    question_number = data_to_dict["questionNumber"]
    canvas_number = data_to_dict["canvasNumber"]
    canvas_data = data_to_dict["canvasData"]
    #get the question id
    qu_id = Questions.query.with_entities(Questions.id).filter_by(exercise_number=exercise_number,question_number=question_number).scalar()
    #check if prog already exists in database
    check_prog = db.session.query(Progress).filter_by(user_id=current_user.id,question_id=qu_id,canvas_number=canvas_number).first()
    #if it does,update answer_data columns
    if check_prog:     
            check_prog.canvas_data=canvas_data
            db.session.commit()
    #if stat doesn't already exist then add it
    else:
        new_progress = Progress(user_id=current_user.id,question_id=qu_id,canvas_number=canvas_number,canvas_data=canvas_data)
        #commit to database
        db.session.add(new_progress)
        db.session.commit()
    return json.dumps({'success':True}), 200, {'ContentType':'application/json'} 




if __name__ == "__main__":
    app.run(debug=True)
