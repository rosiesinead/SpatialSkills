//set up each Exercise and add to the exercises array

var exercises = [];
var totalExercises = 6;

function setUpExercises(){

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
           // alert(res);
        }
    });

    //create array of exercise objects
    for(var i=0;i<6;i++){
        exercises.push(new Exercise("Ex"+(i+1),i+1));
        }

    //loop through database data, set current exercise to current.
    //get exercise object from array, add current exercise data to question array
    //JSON parse exercise data to convert to a question object  
    for (var i = 0; i < receivedEx.length; i++){
        var current = receivedEx[i]
        var exercise = exercises[current.exercise_number-1]
        exercise.questions.push(JSON.parse(current.question_data))
        exercise.answerType = current.answer_type
        exercise.questionType = current.question_type
    }

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
            var current = receivedProg[j]
            var answer_data = JSON.parse(current.answer_data)         
            exercises[current.exercise_number-1].questions[current.question_number-1].answerCanvas[current.answer_canvas-1]=answer_data;
    }

    //use query for this instead...

    for(var i=0;i<totalExercises;i++){
        setupQuestions(exercises[i])
    }

}

//---------------------------------------------------------------------------------

    // loop through data and create a new exercise with name & number

//     ex1 = new Exercise("Ex1");
//     ex1.num = 1;
//     for (var i = 0; i < received.length; i++){
//         var exercise = received[i];
//     }
//     var exercise1 = getExercise1Data()
//     for (var i = 0; i < exercise1.length; i++){
//         ex1.questions.push(exercise1[i]);
//     }
//     exercises.push(ex1);
//     setupQuestionEx1(ex1);
    
//     ex2 = new Exercise("Ex2");
//     ex2.num = 2;
//     var exercise2 = getExercise2Data()
//     for (var i = 0; i < exercise2.length; i++){
//         ex2.questions.push(exercise2[i]);
//     }
//     exercises.push(ex2);
//     setupQuestionEx2(ex2);
    
//     ex3 = new Exercise("Ex3");
//     ex3.num = 3;
//     var exercise3 = getExercise3Data()
//     for (var i = 0; i < exercise3.length; i++){
//         ex3.questions.push(exercise3[i]);
//     }
//     exercises.push(ex3);
//     setupQuestionEx3(ex3);
    
//     ex4 = new Exercise("Ex4");
//     ex4.num = 4;
//     var exercise4 = getExercise4Data()
//     for (var i = 0; i < exercise4.length; i++){
//         ex4.questions.push(exercise4[i]);
//     }
//     exercises.push(ex4);
//     setupQuestionEx4(ex4);
    
//     ex5 = new Exercise("Ex5");
//     ex5.num = 5;
//     var exercise5 = getExercise5Data()
//     for (var i = 0; i < exercise5.length; i++){
//         ex5.questions.push(exercise5[i]);
//     }
//     exercises.push(ex5);
//     setupQuestionEx5(ex5);
    
//     ex6 = new Exercise("Ex6");
//     ex6.num = 6;
//     var exercise6 = getExercise6Data()
//     for (var i = 0; i < exercise6.length; i++){
//         ex6.questions.push(exercise6[i]);
//     }
//     exercises.push(ex6);
//     setupQuestionEx6(ex6);
// }