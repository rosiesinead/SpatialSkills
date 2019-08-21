
//removed original code for write a question

function writeQuestionToDb(question,exerciseNumber,questionNumber){

    // //update answer with any changes to question canvas
    updateCorrectAnswer(question.questionCanvas)
    // //update answer with any changes to answer canvas
    updateCorrectAnswer(question.answerCanvas)
   
    // make a copy to save as answers
    var questionAnswers = JSON.parse(JSON.stringify(question));

    //var questionAnswers = getAnswers(question)

    //clear lines on answer canvas so ready for user
    for(var i=0;i<question.answerCanvas.length;i++){
        question.answerCanvas[i].linesAllDrawn = []
        question.answerCanvas[i].linesCurrentlyDrawn = []
    }

    var save = {exerciseNumber:exerciseNumber,questionNumber:questionNumber,questionData:JSON.stringify(question),questionAnswers:JSON.stringify(questionAnswers)}

    // console.log(save)

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

 //add lines currently drawn to correct on the question canvas
 //to be used when editing/creating a question

function updateCorrectAnswer(canvas){

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
        writeCorrectAnswerToLinesCurrentlyDrawn(questionAnswers.answerCanvas[i])
    }
    //add the correct answer onto the question canvas so that it can be edited
    for (var i = 0; i < questionAnswers.questionCanvas.length; i++){
        writeCorrectAnswerToLinesCurrentlyDrawn(questionAnswers.questionCanvas[i])
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
        alert("Delete Complete");
        }
  });

}

// first break up the correct answer and put it back
// get the answers and copy them on the canvases
// save this as the answers
// then remove correct answer from answer canvas 
function breakUp(exercise){
    // console.log(exercise.num)
    for(var i=0;i<exercise.questions.length;i++){
        breakLinesForDB(exercise.questions[i].answerCanvas,exercise.answerType)
        breakLinesForDB(exercise.questions[i].questionCanvas,exercise.questionType)
        writeQuestionToDb(exercise.questions[i],exercise.num,i+1)
   
    }

    
}

// come back to this.... need to add the question correct answer to the question lines array

// this basically breaks up the correct answer and copies in back into correct answer and then also into linesCurrentlyDRawn
function breakLinesForDB(canvasArray,type){
    
//loop through each canvas and break up correct answer and then put it back again
    for(var i=0;i<canvasArray.length;i++){ 
        

        if(type =="isometric"){
            var breakCorrect = breakUpAllLines(canvasArray[i].correctAnswer);

        }else if(type=="orthographic"){
            var breakCorrect = breakUpAllLinesOrth(canvasArray[i].correctAnswer);

        }      
        //clear the correct answer and add the broken correct answer
        canvasArray[i].correctAnswer = []
        for(var j=0;j<breakCorrect.length;j++){
            canvasArray[i].correctAnswer.push(breakCorrect[j]);
        }
    }             
}

function writeCorrectAnswerToLinesCurrentlyDrawn(canvasObject){
    //first clear linesCurrentlyDrawn
    canvasObject.linesCurrentlyDrawn = []
    for(var j=0;j<canvasObject.correctAnswer.length;j++){
        //add correct answer to linesCurrentlyDrawn
        canvasObject.linesCurrentlyDrawn.push(canvasObject.correctAnswer[j]);
    }
}
