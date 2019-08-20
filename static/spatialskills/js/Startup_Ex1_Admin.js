////////////
//need a question variable to be available to all functions
//set up a question object to contain answerCanvas and QuestionCanvas
    question = new Question();
    exerciseNumber = 1;

//set up a dummy currentQuestions variable to deal with changes made for Single Page Application in the handleStart methods
//we will just add the single question above as we are only creating that one full question
    var currentQuestions = [];
    currentQuestions.push(question);

    

function startupEx1() {

    // //set up button to write question object to JSON
    var writeToDBButton = document.getElementById("writeToDBButton");
    writeToDBButton.onclick = function() {
        if(confirm("Please confirm new question is complete and ready to save.")){
            saveNewQuestion(question,exerciseNumber)};
        }

        
    var isometricCanvasIds = ["isometricEx1"];
    var orthCanvasIds = ["orthographicTopEx1", "orthographicFrontEx1", "orthographicSideEx1"];
    
    //create a new CanvasObject for each isometric canvas and add to the Question object's questionCanvas array
    for (var i = 0; i < isometricCanvasIds.length; i++){
        var canvasObj = new CanvasObject(isometricCanvasIds[i]);
        //draw isometric grid dots on the canvas
        drawDots(canvasObj);
        setUpButtonsIsometric(canvasObj);
        question.questionCanvas.push(canvasObj);
        var canvasElement = document.getElementById(question.questionCanvas[i].canvasId); 
        enableTouch(canvasElement);
        
    } 
    
    //create a new CanvasObject for each orthographic canvas and add to the Question object's answerCanvas array
    for (var i = 0; i < orthCanvasIds.length; i++){
        var canvasObj = new CanvasObject(orthCanvasIds[i]);
        //draw orthographic grid dots on the canvas
        drawDotsOrth(canvasObj);
        setUpButtonsOrth(canvasObj);
        question.answerCanvas.push(canvasObj);
        var canvasElement = document.getElementById(question.answerCanvas[i].canvasId); 
        enableTouchOrth(canvasElement);
    }  

}

function setUpButtonsIsometric(canvasObject) { //perhaps set up as question is a better name for function
    
    //configure isometric button onlick events
    document.getElementById(canvasObject.canvasId + "UndoButton").onclick = function() {undoLine(canvasObject)};
    document.getElementById(canvasObject.canvasId + "ClearButton").onclick = function() {clearLines(canvasObject)};
    
    var solidButton = document.getElementById(canvasObject.canvasId + "SolidButton");
    var dashedButton = document.getElementById(canvasObject.canvasId + "DashedButton");
    solidButton.onclick = function() {drawSolidLine(canvasObject, solidButton, dashedButton)};
    dashedButton.onclick = function() {drawDashedLine(canvasObject, dashedButton, solidButton)};
    
    var answer = canvasObject.canvasId + "Answer";
    
    var checkAnswerButton = document.getElementById(canvasObject.canvasId + "CheckAnswerButton");
    checkAnswerButton.onclick = function () {checkAnswer(canvasObject, answer)};
    
    var frontLeftButton = document.getElementById(canvasObject.canvasId + "FrontLeftButton");
    var frontRightButton = document.getElementById(canvasObject.canvasId + "FrontRightButton");
    frontLeftButton.onclick = function (){enableDrawText(canvasObject, textFront, textSlopeDownToTheRightAngle, frontLeftButton, frontRightButton)};
    frontRightButton.onclick = function (){enableDrawText(canvasObject, textFront, textSlopeUpToRightAngle, frontRightButton, frontLeftButton)};
    
    var undoFrontButton = document.getElementById(canvasObject.canvasId + "UndoFrontButton");
    undoFrontButton.onclick = function (){undoText(canvasObject)};
}

function setUpButtonsOrth(canvasObject) { //perhaps set up as answer is a better name for function
    
    
    //configure isometric button onlick events
    document.getElementById(canvasObject.canvasId + "UndoButton").onclick = function() {undoLineOrth(canvasObject)};
    document.getElementById(canvasObject.canvasId + "ClearButton").onclick = function() {clearLinesOrth(canvasObject)};
    
    var orthographicSolidButton = document.getElementById(canvasObject.canvasId + "SolidButton");
    var orthographicDashedButton = document.getElementById(canvasObject.canvasId + "DashedButton");
    orthographicSolidButton.onclick = function() {drawSolidLine(canvasObject, orthographicSolidButton, orthographicDashedButton)};
    orthographicDashedButton.onclick = function() {drawDashedLine(canvasObject, orthographicDashedButton, orthographicSolidButton)};
    
    var orthographicAnswer = canvasObject.canvasId + "Answer";
    
    //var OrthographicCheckAnswerButton = document.getElementById(canvasObject.canvasId + "CheckAnswerButton");
    //OrthographicCheckAnswerButton.onclick = function () {checkAnswerOrth(canvasObject, orthographicAnswer)};
    
}


function drawSolidLine(canvasObject, pressedButton, secondButton) {
    canvasObject.dashed = false;
    pressedButton.style.borderStyle = "inset";
    secondButton.style.borderStyle = "";  
}

function drawDashedLine(canvasObject, pressedButton, secondButton) {
    canvasObject.dashed = true;
    pressedButton.style.borderStyle = "inset";
    secondButton.style.borderStyle = "";  
}

function enableDrawText(canvasObject, text, rotation, pressedButton, secondButton) {
    var canvasElement = document.getElementById(canvasObject.canvasId);
    enableTouchText(canvasElement, text, rotation);
    pressedButton.style.borderStyle = "inset";
    secondButton.style.borderStyle = "";  
}

function disableDrawText() {
    var buttonElements = document.getElementsByClassName("textButtons");
        for(var i = 0; i < buttonElements.length; i++){
            buttonElements[i].style.borderStyle = "";  
        }
}



