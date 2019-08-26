//CREATED BY ROSIE FOR PREPARING QUESTIONS FOR SAVING AND DELETING FROM DATABASE


function saveToDatabase(exerciseNumber,questionNumber,questionData,questionAnswers){ 
  
    var save = new DatabaseExercise(exerciseNumber,questionNumber,JSON.stringify(questionData),JSON.stringify(questionAnswers));

    console.log(save)
    
    $.ajax({
        type: "POST",
        url: "/savequestion",
        data: save,
        dataType: "json",
        success: function(resultData){
        alert("Save Complete");
        
        }
  });
}

function deleteFromDatabase(exerciseNumber,questionNumber){

    var send = {exerciseNumber:exerciseNumber,questionNumber:questionNumber}

    $.ajax({
        type: "POST",
        url: "/deletequestion",
        data: send,
        dataType: "json",
        success: function(response){
            alert("Delete Complete");
            if (response.redirect !== undefined && response.redirect) {
                window.location.href = response.redirect_url;
            }
        }
   
  });

}

// 1. make a copy of the question to work on and save as questionData
// 2. get the correct answer from linesCurrentlyDrawn and copy into correctAnswer for both answer and question canvas
// 3. make a copy of the questionData to save as questionAnswers
// 4. clear the lines drawn from the answer canvas so the answer does not appear to users
// 5. save to database

function prepareForSave(question,exerciseNumber,questionNumber){

    var questionData = JSON.parse(JSON.stringify(question));

    addCorrectToCanvas(questionData.answerCanvas);
    addCorrectToCanvas(questionData.questionCanvas);

    var questionAnswers = JSON.parse(JSON.stringify(questionData));

    clearLinesDrawn(questionData.answerCanvas);

    saveToDatabase(exerciseNumber,questionNumber,questionData,questionAnswers);
}

//clear correct answer and update with new lines drawn. linesAllDrawn and tempLine must be cleared as well.
function addCorrectToCanvas(canvasArray){
    for (var i = 0; i < canvasArray.length; i++){
        canvasArray[i].correctAnswer = [];
        canvasArray[i].linesAllDrawn = [];
        canvasArray[i].tempLine = [];
        linesOnToCorrect(canvasArray[i])
    }

}
//loop through the new lines drawn and add them to correct answer   
function linesOnToCorrect(canvasObject){
    for (var i = 0; i < canvasObject.linesCurrentlyDrawn.length; i++){    
        canvasObject.correctAnswer.push(canvasObject.linesCurrentlyDrawn[i])     
    }
} 

//clears any lines drawn on the canvas
function clearLinesDrawn(canvasArray){
    for(var i=0;i<canvasArray.length;i++){
        canvasArray[i].linesAllDrawn = [];
        canvasArray[i].linesCurrentlyDrawn = [];
        canvasArray[i].tempLine = []; 
    }
}

//THESE FUNCTONS WERE REQUIRED TO BREAK UP THE LINES ON THE EXERCISES THAT WERE ALREADY IN THE DATABASE

////////////////////////////////////////////////////////////////////////////////////////////////////
// 1. loop through the questions within an exercise
// 2. make a copy of the question to work on
// 3. break up the correct answer on both the answer and question canvas and replace correct answer with it
// 4. clear any lines drawn on the canvas
// 5. make a copy of the questionData and save as questionAnswers
// 6. on questionAnswers: copy the correct answer into linesCurrentlyDrawn on both the answer and question canvases so that it will be visible to admin
// 7. save updated question to database

function breakUp(exercise){
    //loop through questions and break correct lines on both answer and question canvas
    for(var i=0;i<exercise.questions.length;i++){
        var questionData = JSON.parse(JSON.stringify(exercise.questions[i]));
        breakCorrectLines(questionData.answerCanvas,exercise.answerType);
        breakCorrectLines(questionData.questionCanvas,exercise.questionType);
        clearLinesDrawn(questionData.answerCanvas);
        clearLinesDrawn(questionData.questionCanvas);
        var questionAnswers = JSON.parse(JSON.stringify(questionData));
        addCorrectAnswerToLinesDrawn(questionAnswers.answerCanvas);
        addCorrectAnswerToLinesDrawn(questionAnswers.questionCanvas);
        saveToDatabase(exercise.num,i+1,questionData,questionAnswers);
    }

}

//copy the correct answer into linesdrawn so that they will be visible to admin
function addCorrectAnswerToLinesDrawn(canvasArray){
    for (var i = 0; i < canvasArray.length; i++){
        correctOnToLines(canvasArray[i]);
    }

}

//loop through the new correct answer and add to linesCurrentlyDrawn   
function correctOnToLines(canvasObject){
    for(var i=0;i<canvasObject.correctAnswer.length;i++){
        canvasObject.linesCurrentlyDrawn.push(canvasObject.correctAnswer[i]);
    }
}
// this breaks up the correct answer and copies in back into correct answer and then also into linesCurrentlyDRawn
function breakCorrectLines(canvasArray,type){
    
//loop through each canvas and break up correct answer and then put it back again
    for(var i=0;i<canvasArray.length;i++){ 
        
        //break up the lines and add to breakCorrect
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

//this function was used to update the linescurrentlydrawn in the question canvases
//to make the lines visable.
function updatelines(exercise){
    for(var i=0;i<exercise.questions.length;i++){
        var questionData = JSON.parse(JSON.stringify(exercise.questions[i]));
        for(j=0;j<questionData.questionCanvas;j++){
            correctOnToLines(questionData.questionCanvas[j])

        }
        var questionAnswers = JSON.parse(JSON.stringify(questionData));
        clearLinesDrawn(questionData.answerCanvas)

        saveToDatabase(exercise.num,i+1,questionData,questionAnswers)
    }
}
