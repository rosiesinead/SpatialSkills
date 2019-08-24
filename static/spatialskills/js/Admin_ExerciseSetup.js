//set up each Exercise and add to the exercises array

var exercises = [];
var totalExercises = 6;

function setUpAdminExercises(){

    //send ajax get request
    var receivedEx;
    $.ajax({
        async: false, //seems like this is necessary in order to use the received variable outside the scope
        url: "/getexercises",
        type: 'GET',
        dataType: 'json',
        success: function(res) {
            receivedEx = JSON.parse(res)
            //console.log(res)
            //alert(res);
        }
    });

    //create array of exercise objects
    for(var i=0;i<totalExercises;i++){
        exercises.push(new Exercise("Ex"+(i+1), i+1));
        }

    //loop through database data, set current exercise to current.
    //get exercise object from array, add current exercise data to question array
    //JSON parse exercise data to convert to a question object  
    for (var i = 0; i < receivedEx.length; i++){
        var current = receivedEx[i]
        var exercise = exercises[current.exercise_number-1]
        exercise.questions.push(JSON.parse(current.question_answers))
        
        exercise.answerType = current.answer_type
        exercise.questionType = current.question_type
       
    }

    for(var i=0;i<totalExercises;i++){
        adminSetupQuestions(exercises[i])
    }

}



    
    



