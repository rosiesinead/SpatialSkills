////////////
//need a question variable to be available to all functions
//set up a question object to contain answerCanvas and QuestionCanvas
    //question = new Question();



    function adminSetupQuestions(exercise){

        var iso = 'isometric'
        var ort = 'orthographic'
        
        
        if(exercise.questionType == iso){
                                //for each isometric question canvas (only 1 at the moment)
            for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].questionCanvas.length; i++){
                //draw dots on the isometric canvas
                drawDots(exercise.questions[exercise.currentQuestion - 1].questionCanvas[i]);
            
                //draw the question on the isometric canvas
                drawLines(exercise.questions[exercise.currentQuestion - 1].questionCanvas[i], exercise.questions[exercise.currentQuestion - 1].questionCanvas[i].correctAnswer);
            }

        }else if(exercise.questionType == ort){

                //for each orthographic question canvas (top, front and side)
            for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].questionCanvas.length; i++){
                //draw dots on the isometric canvas
                drawDotsOrth(exercise.questions[exercise.currentQuestion - 1].questionCanvas[i]);
            
                //draw the question on the isometric canvas
                drawLinesOrth(exercise.questions[exercise.currentQuestion - 1].questionCanvas[i], exercise.questions[exercise.currentQuestion - 1].questionCanvas[i].correctAnswer);
            }
        }

        if(exercise.answerType == ort){

        //for each orthographic answer canvas (top, front and side)
            for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].answerCanvas.length; i++){
                //disable touch
                disableTouchOrth(document.getElementById(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i].canvasId));
                
                //draw dots on the orthographic canvas
                drawDotsOrth(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i]);
                
                //draw the currentLinesDrawn on the canvas
                drawLinesOrth(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i], exercise.questions[exercise.currentQuestion - 1].answerCanvas[i].linesCurrentlyDrawn);
                
                //set up the buttons for each orthographic canvas
                setUpButtonsOrth(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i]);
                
                //set up touch for the orthographic canvas
                enableTouchOrth(document.getElementById(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i].canvasId));
                
                //clear any p tags with feedback
                clearPTags(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i]);
                //set up labels for feedback, only required for this exercise
            }
        }else if(exercise.answerType == iso){

                //for each isometric answer canvas (top, front and side)
            for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].answerCanvas.length; i++){
                //disable touch
                disableTouch(document.getElementById(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i].canvasId));
                
                //draw dots on the orthographic canvas
                drawDots(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i]);
                
                //draw the lines currently drawn on the canvas
                drawLines(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i], exercise.questions[exercise.currentQuestion - 1].answerCanvas[i].linesCurrentlyDrawn);
               
                //set up the buttons for each orthographic canvas
                setUpButtonsIsometric(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i]);
                
                //set up touch for the orthographic canvas
                enableTouch(document.getElementById(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i].canvasId));
                
                //clear any p tags with feedback
                clearPTags(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i]);
            }
        }

        //for each rotation canvas (only one at the moment)
        for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].rotationCanvas.length; i++){
            if(exercise.questions[exercise.currentQuestion - 1].rotationCanvas[i].alphabeticRotations.length>0){
                drawAlphabeticRotations(exercise.questions[exercise.currentQuestion - 1].rotationCanvas[i]);
            }
            if(exercise.questions[exercise.currentQuestion - 1].rotationCanvas[i].numericRotations.length>0){
            //draw rotation instructions for the question on the rotations canvas
            drawNumericRotations(exercise.questions[exercise.currentQuestion - 1].rotationCanvas[i]);
            }
        }
    
        setUpQuestionNumber(exercise);
        setUpPreviousNextButtons(exercise);
        setUpEditButton(exercise);
        setUpDeleteButton(exercise);      
        
    }
    
    function setUpQuestionNumber(exercise){
        var qNumPTag = document.getElementById("questionNumber" + exercise.name);
        qNumPTag.innerHTML = exercise.currentQuestion + " of " + exercise.questions.length;
    }
    
    function clearPTags(canvasObj){
        document.getElementById(canvasObj.canvasId + "Answer").innerHTML = "";
    }
    
    
    function setUpPreviousNextButtons(exercise){
        var previousButton = document.getElementById(exercise.name + "PreviousButton");
        var nextButton = document.getElementById(exercise.name + "NextButton");
        
        //if exercise.currentQuestion is greater than 1, show and set up previous button
        if(exercise.currentQuestion > 1){
            previousButton.style.visibility = "visible";
            previousButton.onclick = function () {loadPrevious(exercise)};
        }
        else {
            previousButton.style.visibility = "hidden";
        }
        
        //if exerciseCurrentQuestion is less than exercis.currentQuestion, show and set up next button
        if(exercise.currentQuestion < exercise.questions.length){
            nextButton.style.visibility = "visible";
            nextButton.onclick = function () {loadNext(exercise)};
        }
        else {
            nextButton.style.visibility = "hidden";
        }
    }
    
    function loadPrevious(exercise) {
        //decrement currentQuestion by 1
        exercise.currentQuestion--;
        adminSetupQuestions(exercise);
    }
    
    function loadNext(exercise) {
        //increment currentQuestion by 1
        exercise.currentQuestion++;
        adminSetupQuestions(exercise);
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
        
    }
    
    function setUpButtonsOrth(canvasObject) { //perhaps set up as answer is a better name for function
        
        
        //configure isometric button onlick events
        document.getElementById(canvasObject.canvasId + "UndoButton").onclick = function() {undoLineOrth(canvasObject)};
        document.getElementById(canvasObject.canvasId + "ClearButton").onclick = function() {clearLinesOrth(canvasObject)};
        
        var orthographicSolidButton = document.getElementById(canvasObject.canvasId + "SolidButton");
        $(orthographicSolidButton).addClass('ui-btn-active');
        var orthographicDashedButton = document.getElementById(canvasObject.canvasId + "DashedButton");
        $(orthographicDashedButton).removeClass('ui-btn-active');
        orthographicSolidButton.onclick = function() {drawSolidLine(canvasObject, orthographicSolidButton, orthographicDashedButton)};
        orthographicDashedButton.onclick = function() {drawDashedLine(canvasObject, orthographicDashedButton, orthographicSolidButton)};
        
        var orthographicAnswer = canvasObject.canvasId + "Answer";
        
        var orthographicCheckAnswerButton = document.getElementById(canvasObject.canvasId + "CheckAnswerButton");
        orthographicCheckAnswerButton.onclick = function () {checkAnswerOrth(canvasObject, orthographicAnswer)};
        
    }
    
    
    function drawSolidLine(canvasObject, pressedButton, secondButton) {
        canvasObject.dashed = false;
        pressedButton.style.borderStyle = "inset";
        secondButton.style.borderStyle = ""; 
        $('#' + pressedButton.id).addClass('ui-btn-active');
        $('#' + secondButton.id).removeClass('ui-btn-active');
    }
    
    function drawDashedLine(canvasObject, pressedButton, secondButton) {
        canvasObject.dashed = true;
        pressedButton.style.borderStyle = "inset";
        secondButton.style.borderStyle = "";  
        $(pressedButton).addClass('ui-btn-active');
        $(secondButton).removeClass('ui-btn-active');
    }
    
    // for admin pages 
    
    function setUpEditButton(exercise){
    
        var editQuestionButton = document.getElementById(exercise.name + "EditButton");
        editQuestionButton.onclick = function() {
            if(confirm("Are you sure you want to save changes?"))
            editAQuestion(exercise.questions[exercise.currentQuestion - 1],exercise.num,exercise.currentQuestion)};
        
        }
    
    function setUpDeleteButton(exercise){
    
        var editQuestionButton = document.getElementById(exercise.name + "DeleteButton");
        editQuestionButton.onclick = function(){
            if(confirm('Are you sure your want to delete this question?')){
                (deleteAQuestion(exercise.num,exercise.currentQuestion))
            }
        }
    }
        
        
    
    
    
    