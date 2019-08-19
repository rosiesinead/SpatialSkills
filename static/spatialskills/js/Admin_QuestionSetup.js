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
                var canvas = exercise.questions[exercise.currentQuestion - 1].questionCanvas[i]
                 //  disable touch
                disableTouch(document.getElementById(exercise.questions[exercise.currentQuestion - 1].questionCanvas[i].canvasId));
                //draw dots on the isometric canvas
                drawDots(exercise.questions[exercise.currentQuestion - 1].questionCanvas[i]);
            
                //draw the question on the isometric canvas
                drawLines(exercise.questions[exercise.currentQuestion - 1].questionCanvas[i], exercise.questions[exercise.currentQuestion - 1].questionCanvas[i].correctAnswer);
                
                
                //set up the buttons for each orthographic canvas
                setUpButtonsIsometric(exercise.questions[exercise.currentQuestion - 1].questionCanvas[i]);
                
                //set up touch for the isometric  canvas
                enableTouch(document.getElementById(exercise.questions[exercise.currentQuestion - 1].questionCanvas[i].canvasId));
          
            }


        }else if(exercise.questionType == ort){

       //for each orthographic question canvas (top, front and side)
            for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].questionCanvas.length; i++){
                var canvas = exercise.questions[exercise.currentQuestion - 1].questionCanvas[i]
                //disable touch
                disableTouchOrth(document.getElementById(exercise.questions[exercise.currentQuestion - 1].questionCanvas[i].canvasId));
               // setupOrthCanvas(canvas)//draw dots on the isometric canvas
                drawDotsOrth(exercise.questions[exercise.currentQuestion - 1].questionCanvas[i]);

                //draw the question on the isometric canvas
                drawLinesOrth(exercise.questions[exercise.currentQuestion - 1].questionCanvas[i], exercise.questions[exercise.currentQuestion - 1].questionCanvas[i].correctAnswer);
                
                //set up the buttons for each orthographic canvas
                setUpButtonsOrth(exercise.questions[exercise.currentQuestion - 1].questionCanvas[i]);
            
                //set up touch for the orthographic canvas
                enableTouchOrth(document.getElementById(exercise.questions[exercise.currentQuestion - 1].questionCanvas[i].canvasId));
          //  }
          }
        }

        

        if(exercise.answerType == ort){

        //for each orthographic answer canvas (top, front and side)
            for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].answerCanvas.length; i++){
                var canvas = exercise.questions[exercise.currentQuestion - 1].answerCanvas[i]
               // setupOrthCanvas(canvas)
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
               
                
                // //clear any p tags with feedback
                // clearPTags(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i]);
                // //set up labels for feedback, only required for this exercise
            }
        }else if(exercise.answerType == iso){

                //for each isometric answer canvas (top, front and side)
            for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].answerCanvas.length; i++){
                var canvas = exercise.questions[exercise.currentQuestion - 1].answerCanvas[i]
              //  setupIsoCanvas(canvas)
               
              //  disable touch
                disableTouch(document.getElementById(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i].canvasId));
                
                //draw dots on the orthographic canvas
                drawDots(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i]);
                
                //draw the lines currently drawn on the canvas
                drawLines(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i], exercise.questions[exercise.currentQuestion - 1].answerCanvas[i].linesCurrentlyDrawn);
               
                //set up the buttons for each orthographic canvas
                setUpButtonsIsometric(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i]);
                
                //set up touch for the orthographic canvas
                enableTouch(document.getElementById(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i].canvasId));
                
                // //clear any p tags with feedback
                // clearPTags(exercise.questions[exercise.currentQuestion - 1].answerCanvas[i]);
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
        setUpSaveButton(exercise);
        setUpDeleteButton(exercise);
        setUpNewQuestionButton(exercise);   
        
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
    
    function setUpButtonsIsometric(canvasObject) { 
        

        //configure isometric button onlick events
        document.getElementById(canvasObject.canvasId + "UndoButton").onclick = function() {undoLine(canvasObject)};
        document.getElementById(canvasObject.canvasId + "ClearButton").onclick = function() {clearLines(canvasObject)};
              
        var solidButton = document.getElementById(canvasObject.canvasId + "SolidButton");
        var dashedButton = document.getElementById(canvasObject.canvasId + "DashedButton");
        solidButton.onclick = function() {drawSolidLine(canvasObject, solidButton, dashedButton)};
        dashedButton.onclick = function() {drawDashedLine(canvasObject, dashedButton, solidButton)};
        
            
        var frontLeftButton = document.getElementById(canvasObject.canvasId + "FrontLeftButton");
        var frontRightButton = document.getElementById(canvasObject.canvasId + "FrontRightButton");
        
        if(frontLeftButton!=null){
            frontLeftButton.onclick = function (){enableDrawText(canvasObject, textFront, textSlopeDownToTheRightAngle, frontLeftButton, frontRightButton)};

        }
        if(frontRightButton!=null){
            frontRightButton.onclick = function (){enableDrawText(canvasObject, textFront, textSlopeUpToRightAngle, frontRightButton, frontLeftButton)};

        }
       
        
        var undoFrontButton = document.getElementById(canvasObject.canvasId + "UndoFrontButton");
        if(undoFrontButton!=null){
            undoFrontButton.onclick = function (){undoText(canvasObject)};
        }
        
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
        
        // var orthographicCheckAnswerButton = document.getElementById(canvasObject.canvasId + "CheckAnswerButton");
        // orthographicCheckAnswerButton.onclick = function () {checkAnswerOrth(canvasObject, orthographicAnswer)};
        
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
    
    function setUpSaveButton(exercise){
    
        var saveQuestionButton = document.getElementById(exercise.name + "SaveButton");
        saveQuestionButton.onclick = function() {
            if(confirm("Are you sure you want to save changes?")){
            writeQuestionToDb(exercise.questions[exercise.currentQuestion - 1],exercise.num,exercise.currentQuestion)};
           //breakUp(exercise)
        }
    }
    
    function setUpDeleteButton(exercise){
    
        var editQuestionButton = document.getElementById(exercise.name + "DeleteButton");
        editQuestionButton.onclick = function(){
            if(confirm('Are you sure your want to delete this question?')){
                (deleteAQuestion(exercise.num,exercise.currentQuestion))
            }
        }
    }

    function setUpNewQuestionButton(exercise){
        var createNewQuestionButton = document.getElementById(exercise.name + "AddButton");
        createNewQuestionButton.onclick = function(){
            if(confirm('Create a new question?')){
                (setUpNewQuestion(exercise))
            }
        }
    }

    function setUpNewQuestion(exercise){
        //var newQ = createQuestion()
        var newQ = JSON.parse(JSON.stringify(exercise.questions[exercise.currentQuestion - 1]))
        
        for (var i = 0; i < newQ.answerCanvas.length; i++){
            newQ.answerCanvas[i].correctAnswer = newQ.answerCanvas[i].linesCurrentlyDrawn;
            newQ.answerCanvas[i].linesCurrentlyDrawn = [];
            newQ.answerCanvas[i].tempLine = [];
            newQ.answerCanvas[i].linesAllDrawn = []; 
            newQ.answerCanvas[i].dashed = false; 
        }
        for (var i = 0; i < newQ.questionCanvas.length; i++){
            newQ.questionCanvas[i].correctAnswer = newQ.questionCanvas[i].linesCurrentlyDrawn;
            newQ.questionCanvas[i].linesCurrentlyDrawn = [];
            newQ.questionCanvas[i].tempLine = [];
            newQ.questionCanvas[i].linesAllDrawn = []; 
            newQ.questionCanvas[i].dashed = false; 
        }
        
        exercise.questions.push(newQ);
        exercise.currentQuestion = exercise.questions.length
        adminSetupQuestions(exercise);
    }


    // function createQuestion(){

    //     var isometricCanvasIds = ["isometricEx1"];
    //     var orthCanvasIds = ["orthographicTopEx1", "orthographicFrontEx1", "orthographicSideEx1"];
            
        
    //         var question = new Question()
    //         question.questionType = 'isometric'
    //         question.answerType = 'orthographic'
        
    //         //create a new CanvasObject for each isometric canvas and add to the Question object's questionCanvas array
    //         for (var i = 0; i < isometricCanvasIds.length; i++){
    //             var canvasObj = new CanvasObject(isometricCanvasIds[i]);
    //             //draw isometric grid dots on the canvas
    //             question.questionCanvas.push(canvasObj);     
    //         } 
            
    //         //create a new CanvasObject for each orthographic canvas and add to the Question object's answerCanvas array
    //         for (var i = 0; i < orthCanvasIds.length; i++){
    //             var canvasObj = new CanvasObject(orthCanvasIds[i]);
    //             question.answerCanvas.push(canvasObj);
    //         } 
        
    //         // for (var i = 0; i < question.answerCanvas.length; i++){
    //         //     tempQuestion.answerCanvas[i].correctAnswer = tempQuestion.answerCanvas[i].linesCurrentlyDrawn;
    //         //     tempQuestion.answerCanvas[i].linesCurrentlyDrawn = [];
    //         //     tempQuestion.answerCanvas[i].tempLine = [];
    //         //     tempQuestion.answerCanvas[i].linesAllDrawn = []; 
    //         //     tempQuestion.answerCanvas[i].dashed = false; 
    //         // }
    //         // for (var i = 0; i < question.questionCanvas.length; i++){
    //         //     tempQuestion.questionCanvas[i].correctAnswer = tempQuestion.questionCanvas[i].linesCurrentlyDrawn;
    //         //     tempQuestion.questionCanvas[i].linesCurrentlyDrawn = [];
    //         //     tempQuestion.questionCanvas[i].tempLine = [];
    //         //     tempQuestion.questionCanvas[i].linesAllDrawn = []; 
    //         //     tempQuestion.questionCanvas[i].dashed = false; 
    //         // }
        
    //         return question;
            
    //     }


            
        
    
    
    
    