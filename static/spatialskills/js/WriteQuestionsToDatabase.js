function saveNewQuestion(question,exerciseNumber){
    //Create a copy of the Question object so that we can modify this before outputting to JSON format
    var tempQuestion = JSON.parse(JSON.stringify(question));
    
    for (var i = 0; i < question.answerCanvas.length; i++){
        tempQuestion.answerCanvas[i].correctAnswer = tempQuestion.answerCanvas[i].linesCurrentlyDrawn;
        tempQuestion.answerCanvas[i].linesCurrentlyDrawn = [];
        tempQuestion.answerCanvas[i].tempLine = [];
        tempQuestion.answerCanvas[i].linesAllDrawn = []; 
        tempQuestion.answerCanvas[i].dashed = false; 
    }
    for (var i = 0; i < question.questionCanvas.length; i++){
        tempQuestion.questionCanvas[i].correctAnswer = tempQuestion.questionCanvas[i].linesCurrentlyDrawn;
        tempQuestion.questionCanvas[i].linesCurrentlyDrawn = [];
        tempQuestion.questionCanvas[i].tempLine = [];
        tempQuestion.questionCanvas[i].linesAllDrawn = []; 
        tempQuestion.questionCanvas[i].dashed = false; 
    }
    
    var questionAnswers = getAnswers(tempQuestion)
    var save = {exerciseNumber:exerciseNumber,questionData:JSON.stringify(tempQuestion),questionAnswers:JSON.stringify(questionAnswers)}

    $.ajax({
        type: "POST",
        url: "/newquestion",
        data: save,
        dataType: "json",
        success: function(resultData){
        alert("Save Complete");
        }
  });
  
}

function editAQuestion(question,exerciseNumber,questionNumber){

    for(var i=0;i<question.answerCanvas.length;i++){
        question.answerCanvas[i].linesAllDrawn = []
    }
    
    var questionAnswers = getAnswers(question)
    var save = {exerciseNumber:exerciseNumber,questionNumber:questionNumber,questionData:JSON.stringify(question),questionAnswers:JSON.stringify(questionAnswers)}

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

function getAnswers(question){
        // add the answers
        var questionAnswers = JSON.parse(JSON.stringify(question));

        for (var i = 0; i < questionAnswers.answerCanvas.length; i++){
            for(var j=0; j<questionAnswers.answerCanvas[i].correctAnswer.length;j++){
                questionAnswers.answerCanvas[i].linesCurrentlyDrawn = []
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
