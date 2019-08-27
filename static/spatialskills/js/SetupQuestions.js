    
    var role;
    var iso = 'isometric';
    var ort = 'orthographic';
    
    function setupQuestions(role, exercise){
        this.role = role;
        setup1(exercise);

    }

    function setup1 (exercise){

        setup2(exercise);
        
        //set up specific admin functions
        if(role=='admin'){
            switch(exercise.num){
                case 1:
                    setUpFrontButtons(exercise)
                    break;
                case 3:
                    setupExercise3(exercise)
                    break;
                case 4:
                    setupExercise4or5(exercise)
                    break;
                case 5:
                    setupExercise4or5(exercise)
                    break;
            }


        }
    }


/////////////////////////////////////////////////////////////////////////////////
//FUNCTIONS REQUIRED FOR ALL EXERCISES//////////////////////////////////////////

    
    //set up canvases and buttons
    function setup2(exercise){
        var currentQuestion = exercise.questions[exercise.currentQuestion-1]
        var questionCanvas = currentQuestion.questionCanvas;
        var answerCanvas = currentQuestion.answerCanvas;
        setUpQuestionNumber(exercise);
        setUpPreviousNextButtons(exercise);
        setUpRotationCanvasNum(exercise);
        setUpRotationCanvasAlpha(exercise);
        setupCanvas(exercise.questionType,questionCanvas);
        setupCanvas(exercise.answerType,answerCanvas);
        setupTouchCanvas(exercise.questionType,answerCanvas);
        if(role=='admin'){
            setupTouchCanvas(exercise.questionType,questionCanvas);
            setUpSaveButton(exercise);
            setUpDeleteButton(exercise);
            setUpNewQuestionButton(exercise); 
        }
        else if(role=='user'){
            setUpFeedback();

        }
    }   
    
    function setUpQuestionNumber(exercise){
        var qNumPTag = document.getElementById("questionNumber" + exercise.name);
        qNumPTag.innerHTML = exercise.currentQuestion + " of " + exercise.questions.length;
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
        setup1(exercise);
    }
    
    function loadNext(exercise) {
        //increment currentQuestion by 1
        exercise.currentQuestion++;
        setup1(exercise);
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

    function setUpLineButtons(canvasObject) { 

        var solidButton = document.getElementById(canvasObject.canvasId + "SolidButton");
        var dashedButton = document.getElementById(canvasObject.canvasId + "DashedButton");
        if(solidButton !=undefined){
            solidButton.onclick = function() {drawSolidLine(canvasObject, solidButton, dashedButton)};
        }
        if(dashedButton !=undefined){
        dashedButton.onclick = function() {drawDashedLine(canvasObject, dashedButton, solidButton)};
        
        }
}
    function clearPTags(canvasObj){
        var answer = document.getElementById(canvasObj.canvasId + "Answer");
        if(answer !=undefined){
            answer.innerHTML="";
        }
    }


    function setupCanvas(type, canvasArray){

        for (var i = 0; i < canvasArray.length; i++){

            var canvas = canvasArray[i]

            setUpLineButtons(canvas)
            //if there is any feedback, clear
            clearPTags(canvas);

            if(type==iso){
                //  disable touch
              //  disableTouch(document.getElementById(canvas.canvasId));
                //draw dots on the isometric canvas
                drawDots(canvas);
                //draw correct answer lines on canvas
                drawLines(canvas, canvas.correctAnswer);
                 //set up buttons for drawing lines
                setUpIsometricButtons(canvas);
    
            }
            else if(type==ort){
                // disable touch
               // disableTouchOrth(document.getElementById(canvas.canvasId));
                //draw dots on the orthographic canvas
                drawDotsOrth(canvas);
                //draw correct answer lines on canvas
                drawLinesOrth(canvas, canvas.correctAnswer);
                //set up buttons for drawing lines
                setUpButtonsOrth(canvas);
            }
        }

    }

    function setupTouchCanvas(type, canvasArray){

        for (var i = 0; i < canvasArray.length; i++){
            var canvas = canvasArray[i]

            if(type==iso){
                //  disable touch
                //disableTouch(document.getElementById(canvas.canvasId));
                enableTouch(document.getElementById(canvas.canvasId));
            }
            else if(type==ort){
                // disable touch
               // disableTouchOrth(document.getElementById(canvas.canvasId));
                enableTouchOrth(document.getElementById(canvas.canvasId));

            }
        }

    }


    function setUpSaveButton(exercise){   
        var saveQuestionButton = document.getElementById(exercise.name + "SaveButton");
        saveQuestionButton.onclick = function() {
            if(confirm("Are you sure you want to save changes?")){
                prepareForSave(exercise.questions[exercise.currentQuestion - 1],exercise.num,exercise.currentQuestion)};
           
        }
    }
    
    function setUpDeleteButton(exercise){   
        var deleteQuestionButton = document.getElementById(exercise.name + "DeleteButton");
        deleteQuestionButton.onclick = function(){
            if(confirm('Are you sure your want to delete this question?')){
                deleteFromDatabase(exercise.num,exercise.currentQuestion)
            }
        }
    }

    function setUpNewQuestionButton(exercise){
        var createNewQuestionButton = document.getElementById(exercise.name + "AddButton");
        createNewQuestionButton.onclick = function(){
            if(confirm('Create a new question?')){
                setUpNewQuestion(exercise);    
            }
        }
    }

    function setUpNewQuestion(exercise){
        //make a copy of current question
        var newQ = JSON.parse(JSON.stringify(exercise.questions[exercise.currentQuestion-1]))
      
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

    //clear canvas attributes to use for new question
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

    function setUpIsometricButtons(canvasObject) { 
        //configure isometric button onlick events
        var undoButton = document.getElementById(canvasObject.canvasId + "UndoButton");
        if(undoButton!=undefined){
            undoButton.onclick = function() {undoLine(canvasObject)};
        }
        var clearButton = document.getElementById(canvasObject.canvasId + "ClearButton");
        if(clearButton!=undefined){
            clearButton.onclick = function() {clearLines(canvasObject)};
        }

        var isometricCheckAnswerButton = document.getElementById(canvasObject.canvasId + "CheckAnswerButton");
        if(isometricCheckAnswerButton!=undefined){
            var isometricAnswer = canvasObject.canvasId + "Answer";
            isometricCheckAnswerButton.onclick = function () {checkAnswerOrth(canvasObject, isometricAnswer)};
        }

    }
        

    function setUpButtonsOrth(canvasObject) { //perhaps set up as answer is a better name for function
        //configure isometric button onlick events
        var undoButton = document.getElementById(canvasObject.canvasId + "UndoButton");
        if(undoButton!=undefined){
            undoButton.onclick = function() {undoLineOrth(canvasObject)};
        }
        var clearButton = document.getElementById(canvasObject.canvasId + "ClearButton");
        if(clearButton!=undefined){
            clearButton.onclick = function() {clearLinesOrth(canvasObject)};
        }

        var orthographicCheckAnswerButton = document.getElementById(canvasObject.canvasId + "CheckAnswerButton");
        if(orthographicCheckAnswerButton!=undefined){
            var orthographicAnswer = canvasObject.canvasId + "Answer";
            orthographicCheckAnswerButton.onclick = function () {checkAnswerOrth(canvasObject, orthographicAnswer)};

        }

    }


/////////////////////////////////////////////////////////////////////////////////
//FUNCTIONS REQUIRED FOR EXERCISE 1 ////////////////////////////////////////////
    
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

      //only required for exercise 1 to differentiate between feedback
      function setUpFeedback(){
        var topFeedback = document.getElementById("orthographicEx1FeedbackTop");
        var frontFeedback = document.getElementById("orthographicEx1FeedbackFront");
        var sideFeedback = document.getElementById("orthographicEx1FeedbackSide");
        
        topFeedback.innerHTML = "Top: ";
        topFeedback.style.visibility = "hidden";
        frontFeedback.innerHTML = "Front: ";
        frontFeedback.style.visibility = "hidden";
        sideFeedback.innerHTML = "Side: ";
        sideFeedback.style.visibility = "hidden";
        
        var checkButton = document.getElementById("Ex1CheckAnswerButton");
        checkButton.onclick = function () {provideFeedback()};
        
    }
    
    //only required for exercise 1 to differentiate between feedback
    function provideFeedback(){
        var topFeedback = document.getElementById("orthographicEx1FeedbackTop");
        var frontFeedback = document.getElementById("orthographicEx1FeedbackFront");
        var sideFeedback = document.getElementById("orthographicEx1FeedbackSide");
        
        topFeedback.style.visibility = "visible";
        frontFeedback.style.visibility = "visible";
        sideFeedback.style.visibility = "visible";
        
        document.getElementById('orthographicTopEx1CheckAnswerButton').click();
        document.getElementById('orthographicFrontEx1CheckAnswerButton').click();
        document.getElementById('orthographicSideEx1CheckAnswerButton').click();
    }



/////////////////////////////////////////////////////////////////////////////////
//FUNCTIONS REQUIRED FOR EXERCISE 3 ////////////////////////////////////////////

    function setUpButtonsNumeric(exercise) { 

        for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].rotationCanvas.length; i++){
           
            var canvasObject = exercise.questions[exercise.currentQuestion - 1].rotationCanvas[i];

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
    }

    function setUpButtonsBlankAxes(exercise){
        
        for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].questionCanvas.length; i++){
    
            var canvasObject = exercise.questions[exercise.currentQuestion - 1].questionCanvas[i];   
        
            document.getElementById(canvasObject.canvasId + "UndoAxisButton").onclick = function() {undoAxis(canvasObject)};
            document.getElementById(canvasObject.canvasId + "ClearAxesButton").onclick = function() {clearAxes(canvasObject)};
            
            var xAxisButton = document.getElementById(canvasObject.canvasId + "xAxis");
            var yAxisButton = document.getElementById(canvasObject.canvasId + "yAxis");
            var zAxisButton = document.getElementById(canvasObject.canvasId + "zAxis");
            xAxisButton.onclick = function() {enableDrawAxes(canvasObject, axisStringX, axisLabelBlank, xAxisButton, yAxisButton, zAxisButton)};
            yAxisButton.onclick = function() {enableDrawAxes(canvasObject, axisStringY, axisLabelBlank, yAxisButton, xAxisButton, zAxisButton)};
            zAxisButton.onclick = function() {enableDrawAxes(canvasObject, axisStringZ, axisLabelBlank, zAxisButton, xAxisButton, yAxisButton)};
        }
    }
    
    function setUpButtonsAxisTrails(exercise){
        
        for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].questionCanvas.length; i++){
    
            var canvasObject = exercise.questions[exercise.currentQuestion - 1].questionCanvas[i];

            document.getElementById(canvasObject.canvasId + "UndoTrailButton").onclick = function() {undoTrail(canvasObject)};
            document.getElementById(canvasObject.canvasId + "ClearTrailsButton").onclick = function() {clearTrails(canvasObject)};
            
            var xTrailButton = document.getElementById(canvasObject.canvasId + "xTrail");
            var yTrailButton = document.getElementById(canvasObject.canvasId + "yTrail");
            var zTrailButton = document.getElementById(canvasObject.canvasId + "zTrail");
            xTrailButton.onclick = function() {enableDrawTrails(canvasObject, trailStringX, xTrailButton, yTrailButton, zTrailButton)};
            yTrailButton.onclick = function() {enableDrawTrails(canvasObject, trailStringY, yTrailButton, xTrailButton, zTrailButton)};
            zTrailButton.onclick = function() {enableDrawTrails(canvasObject, trailStringZ, zTrailButton, xTrailButton, yTrailButton)};
        }
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

        function setupExercise3(exercise){
               // setUpRotationCanvasNum(exercise)
                setUpButtonsNumeric(exercise);
                setUpButtonsBlankAxes(exercise);
                setUpButtonsAxisTrails(exercise);

        }


        
/////////////////////////////////////////////////////////////////////////////////
//FUNCTIONS REQUIRED FOR EXERCISES 4 & 5 ////////////////////////////////////////


    function setUpButtonsAlphabetic(exercise) { //perhaps set up as question is a better name for function
    
        for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].rotationCanvas.length; i++){
            var canvasObject = exercise.questions[exercise.currentQuestion - 1].rotationCanvas[i];

            document.getElementById(canvasObject.canvasId + "UndoButton").onclick = function() {undoAlphabeticRotation(canvasObject)};
            document.getElementById(canvasObject.canvasId + "ClearButton").onclick = function() {clearAlphabeticRotations(canvasObject)};
            
            var posXButton = document.getElementById(exercise.name + "posX");
            var posYButton = document.getElementById(exercise.name + "posY");
            var posZButton = document.getElementById(exercise.name + "posZ");
            var negXButton = document.getElementById(exercise.name + "negX");
            var negYButton = document.getElementById(exercise.name + "negY");
            var negZButton = document.getElementById(exercise.name + "negZ");
            posXButton.onclick = function() {addAlphabeticRotation(canvasObject, "positive", "X")};
            posYButton.onclick = function() {addAlphabeticRotation(canvasObject, "positive", "Y")};
            posZButton.onclick = function() {addAlphabeticRotation(canvasObject, "positive", "Z")};
            negXButton.onclick = function() {addAlphabeticRotation(canvasObject, "negative", "X")};
            negYButton.onclick = function() {addAlphabeticRotation(canvasObject, "negative", "Y")};
            negZButton.onclick = function() {addAlphabeticRotation(canvasObject, "negative", "Z")};    
        }
    }

    function setUpButtonsAxes(exercise){

        for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].questionCanvas.length; i++){
    
            var canvasObject = exercise.questions[exercise.currentQuestion - 1].questionCanvas[i];
            
            document.getElementById(canvasObject.canvasId + "UndoAxisButton").onclick = function() {undoAxis(canvasObject)};
            document.getElementById(canvasObject.canvasId + "ClearAxesButton").onclick = function() {clearAxes(canvasObject)};
            
            var xAxisButton = document.getElementById(canvasObject.canvasId + "xAxis");
            var yAxisButton = document.getElementById(canvasObject.canvasId + "yAxis");
            var zAxisButton = document.getElementById(canvasObject.canvasId + "zAxis");
            xAxisButton.onclick = function() {enableDrawAxes(canvasObject, axisStringX, axisLabelX, xAxisButton, yAxisButton, zAxisButton)};
            yAxisButton.onclick = function() {enableDrawAxes(canvasObject, axisStringY, axisLabelY, yAxisButton, xAxisButton, zAxisButton)};
            zAxisButton.onclick = function() {enableDrawAxes(canvasObject, axisStringZ, axisLabelZ, zAxisButton, xAxisButton, yAxisButton)};
        }
    }

    function setUpRotationCanvasAlpha(exercise){
        //for each rotation canvas (only one at the moment)
        for (var i = 0; i < exercise.questions[exercise.currentQuestion - 1].rotationCanvas.length; i++){
                drawAlphabeticRotations(exercise.questions[exercise.currentQuestion - 1].rotationCanvas[i]);
            }

        }

        function setupExercise4or5(exercise){
           // setUpRotationCanvasAlpha(exercise)
            setUpButtonsAlphabetic(exercise);
            setUpButtonsAxes(exercise);
   
        }

/////////////////////////////////////////////////////////////////////////////////
//FUNCTIONS REQUIRED FOR EXERCISES 3, 4 & 5 /////////////////////////////////////

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
