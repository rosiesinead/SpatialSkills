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
            //console.log(res)
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
            }
        });

        //loop through database data and update the matching exercise.question.answercanvas with user data
        for (var j = 0; j < receivedProg.length; j++){
                var current = receivedProg[j];
                var canvasData = JSON.parse(current.canvas_data);      
                exercises[current.exercise_number-1].questions[current.question_number-1].answerCanvas[current.canvas_number-1]=canvasData;
        }

        // newSix = {"answerCanvas":[{"canvasId":"isometricEx6","ctx":{},"dashed":false,"linesCurrentlyDrawn":[],"linesAllDrawn":[],"tempLine":[],"attempts":[],"correctAnswer":[],"justChecked":false,"gridText":[],"axes":[],"axisTrails":[]}],"questionCanvas":[{"canvasId":"isometricPreImageEx6","ctx":{},"dashed":false,"linesCurrentlyDrawn":[],"linesAllDrawn":[],"tempLine":[],"attempts":[],"correctAnswer":[{"x1":3,"y1":5,"x2":3,"y2":7,"type":"dashed","color":"default"},{"x1":3,"y1":7,"x2":3,"y2":9,"type":"dashed","color":"default"},{"x1":3,"y1":9,"x2":3,"y2":11,"type":"dashed","color":"default"},{"x1":3,"y1":11,"x2":3,"y2":13,"type":"dashed","color":"default"},{"x1":3,"y1":13,"x2":3,"y2":15,"type":"dashed","color":"default"},{"x1":3,"y1":15,"x2":3,"y2":17,"type":"dashed","color":"default"},{"x1":3,"y1":5,"x2":4,"y2":6,"type":"dashed","color":"default"},{"x1":4,"y1":6,"x2":5,"y2":7,"type":"dashed","color":"default"},{"x1":5,"y1":7,"x2":6,"y2":8,"type":"dashed","color":"default"},{"x1":6,"y1":8,"x2":7,"y2":9,"type":"dashed","color":"default"},{"x1":7,"y1":9,"x2":8,"y2":10,"type":"dashed","color":"default"},{"x1":8,"y1":10,"x2":9,"y2":11,"type":"dashed","color":"default"},{"x1":9,"y1":11,"x2":10,"y2":12,"type":"dashed","color":"default"},{"x1":10,"y1":12,"x2":11,"y2":13,"type":"dashed","color":"default"},{"x1":11,"y1":13,"x2":12,"y2":14,"type":"dashed","color":"default"},{"x1":12,"y1":14,"x2":13,"y2":15,"type":"dashed","color":"default"},{"x1":13,"y1":15,"x2":13,"y2":17,"type":"dashed","color":"default"},{"x1":13,"y1":17,"x2":13,"y2":19,"type":"dashed","color":"default"},{"x1":13,"y1":19,"x2":13,"y2":21,"type":"dashed","color":"default"},{"x1":13,"y1":21,"x2":13,"y2":23,"type":"dashed","color":"default"},{"x1":13,"y1":23,"x2":13,"y2":25,"type":"dashed","color":"default"},{"x1":13,"y1":25,"x2":13,"y2":27,"type":"dashed","color":"default"},{"x1":3,"y1":17,"x2":4,"y2":18,"type":"dashed","color":"default"},{"x1":4,"y1":18,"x2":5,"y2":19,"type":"dashed","color":"default"},{"x1":5,"y1":19,"x2":6,"y2":20,"type":"dashed","color":"default"},{"x1":6,"y1":20,"x2":7,"y2":21,"type":"dashed","color":"default"},{"x1":7,"y1":21,"x2":8,"y2":22,"type":"dashed","color":"default"},{"x1":8,"y1":22,"x2":9,"y2":23,"type":"dashed","color":"default"},{"x1":9,"y1":23,"x2":10,"y2":24,"type":"dashed","color":"default"},{"x1":10,"y1":24,"x2":11,"y2":25,"type":"dashed","color":"default"},{"x1":11,"y1":25,"x2":12,"y2":26,"type":"dashed","color":"default"},{"x1":12,"y1":26,"x2":13,"y2":27,"type":"dashed","color":"default"},{"x1":3,"y1":23,"x2":4,"y2":22,"type":"solid","color":"default"},{"x1":4,"y1":22,"x2":5,"y2":21,"type":"solid","color":"default"},{"x1":5,"y1":21,"x2":6,"y2":20,"type":"solid","color":"default"},{"x1":4,"y1":24,"x2":3,"y2":23,"type":"solid","color":"default"},{"x1":5,"y1":25,"x2":4,"y2":24,"type":"solid","color":"default"},{"x1":6,"y1":26,"x2":5,"y2":25,"type":"solid","color":"default"},{"x1":6,"y1":26,"x2":7,"y2":25,"type":"solid","color":"default"},{"x1":7,"y1":25,"x2":8,"y2":24,"type":"solid","color":"default"},{"x1":8,"y1":24,"x2":9,"y2":23,"type":"solid","color":"default"},{"x1":7,"y1":19,"x2":6,"y2":20,"type":"solid","color":"default"},{"x1":8,"y1":18,"x2":7,"y2":19,"type":"solid","color":"default"},{"x1":9,"y1":17,"x2":8,"y2":18,"type":"solid","color":"default"},{"x1":9,"y1":17,"x2":10,"y2":18,"type":"solid","color":"default"},{"x1":10,"y1":18,"x2":11,"y2":19,"type":"solid","color":"default"},{"x1":11,"y1":19,"x2":12,"y2":20,"type":"solid","color":"default"},{"x1":10,"y1":22,"x2":9,"y2":23,"type":"solid","color":"default"},{"x1":11,"y1":21,"x2":10,"y2":22,"type":"solid","color":"default"},{"x1":12,"y1":20,"x2":11,"y2":21,"type":"solid","color":"default"}],"justChecked":false,"gridText":[],"axes":[],"axisTrails":[]}],"rotationCanvas":[]}
        // exercises[5].questions.push(newSix)

        for(var i=0;i<totalNoExercises;i++){
            setupQuestions(exercises[i])
        }

    }

    else if(role=="admin"){
        for(var i=0;i<totalNoExercises;i++){
            adminSetupQuestions(exercises[i])
        }

    }   


}