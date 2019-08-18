// function saveNewQuestion(question,exerciseNumber){
//     //Create a copy of the Question object so that we can modify this before outputting to JSON format
//     var tempQuestion = JSON.parse(JSON.stringify(question));
    
//     for (var i = 0; i < question.answerCanvas.length; i++){
//         tempQuestion.answerCanvas[i].correctAnswer = tempQuestion.answerCanvas[i].linesCurrentlyDrawn;
//         tempQuestion.answerCanvas[i].linesCurrentlyDrawn = [];
//         tempQuestion.answerCanvas[i].tempLine = [];
//         tempQuestion.answerCanvas[i].linesAllDrawn = []; 
//         tempQuestion.answerCanvas[i].dashed = false; 
//     }
//     for (var i = 0; i < question.questionCanvas.length; i++){
//         tempQuestion.questionCanvas[i].correctAnswer = tempQuestion.questionCanvas[i].linesCurrentlyDrawn;
//         tempQuestion.questionCanvas[i].linesCurrentlyDrawn = [];
//         tempQuestion.questionCanvas[i].tempLine = [];
//         tempQuestion.questionCanvas[i].linesAllDrawn = []; 
//         tempQuestion.questionCanvas[i].dashed = false; 
//     }
    
//     var questionAnswers = getAnswers(tempQuestion)
//     var save = {exerciseNumber:exerciseNumber,questionData:JSON.stringify(tempQuestion),questionAnswers:JSON.stringify(questionAnswers)}

//     $.ajax({
//         type: "POST",
//         url: "/newquestion",
//         data: save,
//         dataType: "json",
//         success: function(resultData){
//         alert("Save Complete");
//         }
//   });
  
// }

function writeQuestionToDb(question,exerciseNumber,questionNumber){

    //update answer with any changes to question canvas
    updateCorrectAnswer(question.questionCanvas)
    //update answer with any changes to answer canvas
    updateCorrectAnswer(question.answerCanvas)
   
    // make a copy to save as answers
    var questionAnswers = JSON.parse(JSON.stringify(question));
  

    //clear lines on answer canvas so ready for user
    for(var i=0;i<question.answerCanvas.length;i++){
        question.answerCanvas[i].linesAllDrawn = []
        question.answerCanvas[i].linesCurrentlyDrawn = []
    }

    var save = {exerciseNumber:exerciseNumber,questionNumber:questionNumber,questionData:JSON.stringify(question),questionAnswers:JSON.stringify(questionAnswers)}

    console.log(save)

    $.ajax({
        type: "POST",
        url: "/editquestion",
        data: save,
        dataType: "json",
        success: function(resultData){
        alert("Save Complete");
        }
  });



}

function updateCorrectAnswer(canvas){

    //add lines currently drawn to correct on the question canvas

   // var questionUpdates = JSON.parse(JSON.stringify(question));

   
    for (var i = 0; i < canvas.length; i++){
        //clear correct answer so we can update it with current lines
        canvas[i].correctAnswer = []
        //loop through the new lines drawn and add them to correct answer
        for(var j=0; j<canvas[i].linesCurrentlyDrawn.length;j++){             
            canvas[i].correctAnswer.push(canvas[i].linesCurrentlyDrawn[j])     
        }
    }

} 

//puts the answer on the answer canvas
function getAnswers(question){

    //make a copy of the question
    var questionAnswers = JSON.parse(JSON.stringify(question));

    //add the correct answer onto the answer canvas so that it will be visible to admin
    for (var i = 0; i < questionAnswers.answerCanvas.length; i++){
        questionAnswers.answerCanvas[i].linesCurrentlyDrawn = []
        for(var j=0; j<questionAnswers.answerCanvas[i].correctAnswer.length;j++){ 
            questionAnswers.answerCanvas[i].linesCurrentlyDrawn.push(questionAnswers.answerCanvas[i].correctAnswer[j])    
        }
        
    } 

    return questionAnswers;

}




function deleteAQuestion(exerciseNumber,questionNumber){

    var send = {exerciseNumber:exerciseNumber,questionNumber:questionNumber}

    $.ajax({
        type: "POST",
        url: "/deletequestion",
        data: send,
        dataType: "json",
        success: function(resultData){
        alert("Save Complete");
        }
  });

}


//come back to this.... need to add the question correct answer to the question lines array
function updateQuestions(){

    for(var i=0;exercises.length;i++){
        for(var j=0; exercises[i].questions.length;i++){
            for(var k=0;exercises[i].questions[j].questionCanvas.length;k++){
                for(var l=0;exercises[i].questions[j].questionCanvas[k].correctAnswer.length;l++){
                    exercises[i].questions[j].questionCanvas[k].linesCurrentlyDrawn.push(exercises[i].questions[j].questionCanvas[k].correctAnswer[l]);
                }
                

            }
        }
    }
}



