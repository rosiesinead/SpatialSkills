//set up each Exercise and add to the exercises array

var exercises = [];
var totalNoExercises = 6;

function setUpExercises(){

    //get role: either user or admin
    var role = document.getElementById("role").title;

    //create array of exercise objects
    for(var i=0;i<totalNoExercises;i++){
        exercises.push(new Exercise("Ex"+(i+1),i+1));
    }

    //send ajax get request to retrieve exercise data from database
    var receivedEx;
    $.ajax({
        async: false, //seems like this is necessary in order to use the received variable outside the scope
        url: "/getexercises",
        type: 'GET',
        dataType: 'json',
        success: function(res) {
            receivedEx = JSON.parse(res)
           // console.log(res)
           // alert(res);
        }
    });

    //loop through database data, set receivedEx to current.
    //get exercise object from array, add received exercise data to question array
    //JSON parse exercise data to convert to a question object  

    for (var i = 0; i < receivedEx.length; i++){
        var current = receivedEx[i]
        var exercise = exercises[current.exercise_number-1]
        if(role=="user"){
            exercise.questions.push(JSON.parse(current.question_data))
        }
        else if(role=="admin"){
            exercise.questions.push(JSON.parse(current.question_answers))
        }
        exercise.answerType = current.answer_type
        exercise.questionType = current.question_type
    }

    if(role=="user"){

        var receivedProg;
        $.ajax({
            async: false, //seems like this is necessary in order to use the received variable outside the scope
            url: "/getprogress",
            type: 'GET',
            dataType: 'json',
            success: function(res) {
                receivedProg = JSON.parse(res)
                //console.log(receivedProg)
            }
        });

        //loop through database data and update the matching exercise.question.answercanvas with user data
        for (var j = 0; j < receivedProg.length; j++){
                var current = receivedProg[j];
                var canvasData = JSON.parse(current.canvas_data); 
                var answerCanvas = exercises[current.exercise_number-1].questions[current.question_number-1].answerCanvas[current.canvas_number-1];      
                answerCanvas.linesCurrentlyDrawn = canvasData.linesCurrentlyDrawn;
                answerCanvas.linesAllDrawn = canvasData.linesAllDrawn;
                answerCanvas.attempts = canvasData.attempts;
                answerCanvas.correct = canvasData.correct;
        }

    }

    for(var i=0;i<totalNoExercises;i++){
        setupQuestions(exercises[i])
    }


}