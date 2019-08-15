//set up each Exercise and add to the exercises array

var exercises = [];
var totalExercises = 6;
//var ex1, ex2, ex3, ex4, ex5, ex6;

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
       
    }

    

    exercises[0].answerType = 'orthographic';
    exercises[0].questionType = 'isometric'
    exercises[1].answerType = 'isometric'
    exercises[1].questionType = 'orthographic'
    exercises[2].answerType = 'isometric'
    exercises[2].questionType = 'isometric'
    exercises[3].answerType = 'isometric'
    exercises[3].questionType = 'isometric'
    exercises[4].answerType = 'isometric'
    exercises[4].questionType = 'isometric'
    exercises[5].answerType = 'isometric'
    exercises[5].questionType = 'isometric'


    for(var i=0;i<totalExercises;i++){
        adminSetupQuestions(exercises[i])
    }

  
    

   
    // setupQuestionEx2(exercises[1])
    // setupQuestionEx3(exercises[2])
    // setupQuestionEx4(exercises[3])
    // setupQuestionEx5(exercises[4])
    // setupQuestionEx6(exercises[5])
    

}
    //startupEx1()


    
    

    // for(var i=0;i<exercises.length;i++){
    //     for(var j=0;j<exercises[i].questions.length;j++){
    //         for(var k=0;k<exercises[i].questions[j].answerCanvas.length;k++){
    //             var canvas = exercises[i].questions[j].answerCanvas[k].canvasId
    //             console.log(canvas)
    //             disableTouch(document.getElementById(canvas));
    //             disableTouchOrth(document.getElementById(canvas));
    //             document.getElementById(canvas + "UndoButton").disabled = true;
    //             document.getElementById(canvas + "ClearButton").disabled = true;
    //             document.getElementById(canvas + "SolidButton").disabled = true;
    //             document.getElementById(canvas + "DashedButton").disabled = true;
    //             document.getElementById(canvas + "CheckAnswerButton").disabled = true;

    //         }
    //     }
    // }



