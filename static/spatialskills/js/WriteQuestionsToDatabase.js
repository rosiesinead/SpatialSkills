
function saveAQuestion(question,exerciseNumber,questionNumber){

    var questionData = JSON.parse(JSON.stringify(question));

    //add the correct answer onto the answer canvas so that it will be visible to admin
    for (var i = 0; i < questionData.answerCanvas.length; i++){
        questionData.answerCanvas[i].correctAnswer = [];
        questionData.answerCanvas[i].linesAllDrawn = [];
        questionData.answerCanvas[i].tempLine = [];
        linesOnToCorrect(questionData.answerCanvas[i])
        //console.log(question.answerCanvas[i])
    }
        
    //add the correct answer onto the question canvas so that it can be edited
    for (var i = 0; i < questionData.questionCanvas.length; i++){
        questionData.questionCanvas[i].correctAnswer = [];
        questionData.questionCanvas[i].linesAllDrawn = [];
        questionData.questionCanvas[i].tempLine = [];
        linesOnToCorrect(questionData.questionCanvas[i])

    }


    //make a copy of ther question which contains
    var questionAnswers = JSON.parse(JSON.stringify(questionData));


    //clear lines on answer canvas so ready for user
    for(var i=0;i<questionData.answerCanvas.length;i++){
        questionData.answerCanvas[i].linesAllDrawn = []
        questionData.answerCanvas[i].linesCurrentlyDrawn = []
        
    }


    saveToDatabase(exerciseNumber,questionNumber,JSON.stringify(questionData),JSON.stringify(questionAnswers))
}

//removed original code for write a question

//1.clear the correct answer and copy lines currently drawn into the correct answer on both answer and question canvases
//2.make a copy to save as the question answers
//3.remove lines drawn from the answer canvas to save as the question
// function prepareForSave(question){

    //update the question with the new answers
//     function getAnswers(question){
//         console.log("get!!")
   



//     return question;



// }

 //add lines currently drawn to correct on the question canvas
 //to be used when editing/creating a question

// //puts the answer on the answer canvas
// function makeAnswers(question){


function linesOnToCorrect(canvas){
    for (var i = 0; i < canvas.linesCurrentlyDrawn.length; i++){
        //loop through the new lines drawn and add them to correct answer       
            canvas.correctAnswer.push(canvas.linesCurrentlyDrawn[i])     
    }

} 


function saveToDatabase(exerciseNumber,questionNumber,questionData,questionAnswers){ 
  
    var save = {exerciseNumber:exerciseNumber,questionNumber:questionNumber,questionData:questionData,questionAnswers:questionAnswers}

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
            console.log(response)
            alert("Delete Complete");
            if (response.redirect !== undefined && response.redirect) {
                window.location.href = response.redirect_url;
            }
        }
   
  });

}








////////////////////////////////////////////////////////////////////////////////////////////////////
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




//puts the answer on the answer canvas
function getAnswers(question){

    //make a copy of the question
    var questionAnswers = JSON.parse(JSON.stringify(question));

    //add the correct answer onto the answer canvas so that it will be visible to admin
    for (var i = 0; i < questionAnswers.answerCanvas.length; i++){
        correctOnToLines(questionAnswers.answerCanvas[i])
    }
    //add the correct answer onto the question canvas so that it can be edited
    for (var i = 0; i < questionAnswers.questionCanvas.length; i++){
        correctOnToLines(questionAnswers.questionCanvas[i])
    }
    return questionAnswers;

}


function correctOnToLines(canvasObject){
    //first clear linesCurrentlyDrawn
    canvasObject.linesCurrentlyDrawn = []
    for(var j=0;j<canvasObject.correctAnswer.length;j++){
        //add correct answer to linesCurrentlyDrawn
        canvasObject.linesCurrentlyDrawn.push(canvasObject.correctAnswer[j]);
    }
}


