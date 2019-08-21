////////////
//need a question variable to be available to all functions
//set up a question object to contain answerCanvas and QuestionCanvas
    //question = new Question();

    function adminSetupQuestions(exercise){

        setUp(exercise);
        setUpQuestionNumber(exercise);
        setUpPreviousNextButtons(exercise);
        setUpSaveButton(exercise);
        setUpDeleteButton(exercise);
        setUpNewQuestionButton(exercise); 

        switch(exercise.num){
            case 1:
                setUpFrontButtons(exercise)
                break;
            case 2:
                break;
            case 3:
                setUp3(exercise)
                break;
            case 4:
                setUp4or5(exercise)
                break;
            case 5:
                setUp4or5(exercise)
                break;
            case 6:
                break;
        }


        
    }




    ///////////////////needed for all exercises///////////////////


    function setUp(exercise){

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
    
//////////////////////////////////////////////////////////////////


    function setUpButtonsIsometric(canvasObject) { 
        
        //configure isometric button onlick events
        document.getElementById(canvasObject.canvasId + "UndoButton").onclick = function() {undoLine(canvasObject)};
        document.getElementById(canvasObject.canvasId + "ClearButton").onclick = function() {clear(canvasObject)};
              
        var solidButton = document.getElementById(canvasObject.canvasId + "SolidButton");
        var dashedButton = document.getElementById(canvasObject.canvasId + "DashedButton");
        solidButton.onclick = function() {drawSolidLine(canvasObject, solidButton, dashedButton)};
        dashedButton.onclick = function() {drawDashedLine(canvasObject, dashedButton, solidButton)};
        
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

    ///////////////////NEEDED FOR EXERCISE 1 AND 2 ///////////////////
    
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

    function setUpFrontButtons(exercise){

        for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].questionCanvas.length; i++){

            var canvasObject = exercise.questions[exercise.currentQuestion - 1].questionCanvas[i];
            
            var frontLeftButton = document.getElementById(canvasObject.canvasId + "FrontLeftButton");
            var frontRightButton = document.getElementById(canvasObject.canvasId + "FrontRightButton");
            frontLeftButton.onclick = function (){enableDrawText(canvasObject, textFront, textSlopeDownToTheRightAngle, frontLeftButton, frontRightButton)};
            frontRightButton.onclick = function (){enableDrawText(canvasObject, textFront, textSlopeUpToRightAngle, frontRightButton, frontLeftButton)};
            var undoFrontButton = document.getElementById(canvasObject.canvasId + "UndoFrontButton");
            undoFrontButton.onclick = function (){undoText(canvasObject)};
        }
        
    }


//////////////////////////////////////////////////////////////////

///////////////////NEEDED FOR EXERCISE 4 AND 5///////////////////


    function setUpButtonsAlphabetic(canvasObject) { //perhaps set up as question is a better name for function
    
        //configure isometric button onlick events
        document.getElementById(canvasObject.canvasId + "UndoButton").onclick = function() {undoAlphabeticRotation(canvasObject)};
        document.getElementById(canvasObject.canvasId + "ClearButton").onclick = function() {clearAlphabeticRotations(canvasObject)};
        
        var posXButton = document.getElementById("posX");
        var posYButton = document.getElementById("posY");
        var posZButton = document.getElementById("posZ");
        var negXButton = document.getElementById("negX");
        var negYButton = document.getElementById("negY");
        var negZButton = document.getElementById("negZ");
        posXButton.onclick = function() {addAlphabeticRotation(canvasObject, "positive", "X")};
        posYButton.onclick = function() {addAlphabeticRotation(canvasObject, "positive", "Y")};
        posZButton.onclick = function() {addAlphabeticRotation(canvasObject, "positive", "Z")};
        negXButton.onclick = function() {addAlphabeticRotation(canvasObject, "negative", "X")};
        negYButton.onclick = function() {addAlphabeticRotation(canvasObject, "negative", "Y")};
        negZButton.onclick = function() {addAlphabeticRotation(canvasObject, "negative", "Z")};    
    }

    function setUpButtonsAxes(canvasObject){
    
        document.getElementById(canvasObject.canvasId + "UndoAxisButton").onclick = function() {undoAxis(canvasObject)};
        document.getElementById(canvasObject.canvasId + "ClearAxesButton").onclick = function() {clearAxes(canvasObject)};
        
        var xAxisButton = document.getElementById(canvasObject.canvasId + "xAxis");
        var yAxisButton = document.getElementById(canvasObject.canvasId + "yAxis");
        var zAxisButton = document.getElementById(canvasObject.canvasId + "zAxis");
        xAxisButton.onclick = function() {enableDrawAxes(canvasObject, axisStringX, axisLabelX, xAxisButton, yAxisButton, zAxisButton)};
        yAxisButton.onclick = function() {enableDrawAxes(canvasObject, axisStringY, axisLabelY, yAxisButton, xAxisButton, zAxisButton)};
        zAxisButton.onclick = function() {enableDrawAxes(canvasObject, axisStringZ, axisLabelZ, zAxisButton, xAxisButton, yAxisButton)};
    }

    function setUpRotationCanvasAlpha(exercise){
        //for each rotation canvas (only one at the moment)
        for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].rotationCanvas.length; i++){
                drawAlphabeticRotations(exercise.questions[exercise.currentQuestion - 1].rotationCanvas[i]);
            }

        }

        
    function setUp4or5(exercise){
        setUpRotationCanvasAlpha(exercise)
        for(var i =0;i<exercise.questions.length;i++){
            for(var j=0;j<exercise.questions[i].rotationCanvas.length;j++){
                setUpButtonsAlphabetic(exercise.questions[i].rotationCanvas[j]);
             
            }
            for(var j=0;j<exercise.questions[i].questionCanvas.length;j++){
                setUpButtonsAxes(exercise.questions[i].questionCanvas[j]);                     
            }
        }
    }
//////////////////////////////////////////////////////////////////

///////////////////NEEDED FOR EXERCISE 3///////////////////

    function setUpButtonsNumeric(canvasObject) { //perhaps set up as question is a better name for function
    
        //configure isometric button onlick events
        document.getElementById(canvasObject.canvasId + "UndoButton").onclick = function() {undoNumericRotation(canvasObject)};
        document.getElementById(canvasObject.canvasId + "ClearButton").onclick = function() {clearNumericRotations(canvasObject)};
        
        var pos90Button = document.getElementById("pos90");
        var pos180Button = document.getElementById("pos180");
        var pos270Button = document.getElementById("pos270");
        var neg90Button = document.getElementById("neg90");
        var neg180Button = document.getElementById("neg180");
        var neg270Button = document.getElementById("neg270");
        pos90Button.onclick = function() {addNumericRotation(canvasObject, "+90")};
        pos180Button.onclick = function() {addNumericRotation(canvasObject, "+180")};
        pos270Button.onclick = function() {addNumericRotation(canvasObject, "+270")};
        neg90Button.onclick = function() {addNumericRotation(canvasObject, "-90")};
        neg180Button.onclick = function() {addNumericRotation(canvasObject, "-180")};
        neg270Button.onclick = function() {addNumericRotation(canvasObject, "-270")};    
    }

    function setUpButtonsBlankAxes(canvasObject){
    
        document.getElementById(canvasObject.canvasId + "UndoAxisButton").onclick = function() {undoAxis(canvasObject)};
        document.getElementById(canvasObject.canvasId + "ClearAxesButton").onclick = function() {clearAxes(canvasObject)};
        
        var xAxisButton = document.getElementById(canvasObject.canvasId + "xAxis");
        var yAxisButton = document.getElementById(canvasObject.canvasId + "yAxis");
        var zAxisButton = document.getElementById(canvasObject.canvasId + "zAxis");
        xAxisButton.onclick = function() {enableDrawAxes(canvasObject, axisStringX, axisLabelBlank, xAxisButton, yAxisButton, zAxisButton)};
        yAxisButton.onclick = function() {enableDrawAxes(canvasObject, axisStringY, axisLabelBlank, yAxisButton, xAxisButton, zAxisButton)};
        zAxisButton.onclick = function() {enableDrawAxes(canvasObject, axisStringZ, axisLabelBlank, zAxisButton, xAxisButton, yAxisButton)};
    }
    
    function setUpButtonsAxisTrails(canvasObject){
        
        document.getElementById(canvasObject.canvasId + "UndoTrailButton").onclick = function() {undoTrail(canvasObject)};
        document.getElementById(canvasObject.canvasId + "ClearTrailsButton").onclick = function() {clearTrails(canvasObject)};
        
        var xTrailButton = document.getElementById(canvasObject.canvasId + "xTrail");
        var yTrailButton = document.getElementById(canvasObject.canvasId + "yTrail");
        var zTrailButton = document.getElementById(canvasObject.canvasId + "zTrail");
        xTrailButton.onclick = function() {enableDrawTrails(canvasObject, trailStringX, xTrailButton, yTrailButton, zTrailButton)};
        yTrailButton.onclick = function() {enableDrawTrails(canvasObject, trailStringY, yTrailButton, xTrailButton, zTrailButton)};
        zTrailButton.onclick = function() {enableDrawTrails(canvasObject, trailStringZ, zTrailButton, xTrailButton, yTrailButton)};
    }

    function enableDrawTrails(canvasObject, axis, pressedButton, secondButton, thirdButton) {
        var canvasElement = document.getElementById(canvasObject.canvasId);
        enableTouchTrails(canvasElement, axis);
        pressedButton.style.borderStyle = "inset";
        secondButton.style.borderStyle = ""; 
        secondButton.style.borderStyle = "";
    }
    
    function disableDrawTrails() {
        var buttonElements = document.getElementsByClassName("trailButtons");
            for(var i = 0; i < buttonElements.length; i++){
                buttonElements[i].style.borderStyle = "";  
            }
    }

    function setUpRotationCanvasNum(exercise){
        //for each rotation canvas (only one at the moment)
        for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].rotationCanvas.length; i++){
            drawNumericRotations(exercise.questions[exercise.currentQuestion - 1].rotationCanvas[i]);
           
            }
        }

        function setUp3(exercise){
            setUpRotationCanvasNum(exercise)
            for(var i =0;i<exercise.questions.length;i++){
                for(var j=0;j<exercise.questions[i].rotationCanvas.length;j++){
                    setUpButtonsNumeric(exercise.questions[i].rotationCanvas[j]);
                 
                }
                for(var j=0;j<exercise.questions[i].questionCanvas.length;j++){
                    setUpButtonsBlankAxes(exercise.questions[i].questionCanvas[j]);
                    setUpButtonsAxisTrails(exercise.questions[i].questionCanvas[j]);
                }
            }
        }



    //////////////////////////////////////////////////////////////////

///////////////////NEEDED FOR EXERCISE 3, 4 AND 5///////////////////

    function enableDrawAxes(canvasObject, axis, axisLabel, pressedButton, secondButton, thirdButton) {
        var canvasElement = document.getElementById(canvasObject.canvasId);
        enableTouchAxes(canvasElement, axis, axisLabel);
        pressedButton.style.borderStyle = "inset";
        secondButton.style.borderStyle = ""; 
        secondButton.style.borderStyle = "";
    }
    
    function disableDrawAxes() {
        var buttonElements = document.getElementsByClassName("axisButtons");
            for(var i = 0; i < buttonElements.length; i++){
                buttonElements[i].style.borderStyle = "";  
            }
    }




    
    
    

    
    
//////////////////////////////////////////////////////////////////


    //////////ajax/////////////
    
    function setUpSaveButton(exercise){
    
        var saveQuestionButton = document.getElementById(exercise.name + "SaveButton");
        saveQuestionButton.onclick = function() {
            if(confirm("Are you sure you want to save changes?")){
                writeQuestionToDb(exercise.questions[exercise.currentQuestion - 1],exercise.num,exercise.currentQuestion)};
           
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
                (setUpNewQuestion(exercise));
                //breakUp(exercise);
            }
        }
    }

    function setUpNewQuestion(exercise){
        //make a copy of current question
        var newQ = JSON.parse(JSON.stringify(exercise.questions[exercise.currentQuestion - 1]))
      
        //clear all the attributes so its blank and ready to use
        clearCanvasAttributes(newQ.answerCanvas);
        clearCanvasAttributes(newQ.questionCanvas);

        //clear the rotation canvas elements as well if there are an
        for (var i = 0; i < newQ.rotationCanvas.length; i++){
            newQ.rotationCanvas[i].numericRotations = [];
            newQ.rotationCanvas[i].alphabeticRotations = [];
        }
        //add new question to exercise array
        exercise.questions.push(newQ);
        //set the current question to the new question
        exercise.currentQuestion = exercise.questions.length
        //set the question up as per the exercise requirements
        adminSetupQuestions(exercise);
    }
        
    
    function clearCanvasAttributes(canvasArray){
        for (var i = 0; i < canvasArray.length; i++){
            canvasArray[i].correctAnswer = [];
            canvasArray[i].linesCurrentlyDrawn = [];
            canvasArray[i].tempLine = [];
            canvasArray[i].linesAllDrawn = []; 
            canvasArray[i].dashed = false; 
            canvasArray[i].attempts = []; 
            canvasArray[i].justChecked = false; 
            canvasArray[i].gridText = [];
            canvasArray[i].axes = [];
            canvasArray[i].axisTrails = [];
            
        }
    }
        
    
    
    
    