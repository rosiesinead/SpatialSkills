//touch functionality used by the main app, with separate touch for Isometric and Orthographic grids
//the function below have been created with help from the Mozilla Developer Network Canvas Totorials https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
//However, with use of jquery and bind events, the addition and removal of touch is much simpler than with JavaScript. 

//The code below uses the JQuery bind structure posted by Levarne Sobotker on stackoverflow: https://stackoverflow.com/questions/7069458/prevent-touchstart-when-swiping as this ensures that scrolling can be enabled, rather than a touch, if the user attempts to scroll.

//The code below also makes use of the originalevent as described by user mkoistinen on stackoverflow: https://stackoverflow.com/questions/4780837/is-there-an-equivalent-to-e-pagex-position-for-touchstart-event-as-there-is-fo as we need the original event when making use of the JQuery bind structure

/////NEED SOME REFERENCE TO TOUCHES//////////////
//keep track of touches in progress
var ongoingTouches = [];

//////ISOMETRIC TOUCH FUNCTIONS/////////////////

function enableTouch(canvas) {
    //this enables touch for the canvas object
    //Based upon JQuery bind structure posted by Levarne Sobotker on stackoverflow: https://stackoverflow.com/questions/7069458/prevent-touchstart-when-swiping
    $('#' + canvas.id).on('vmouseup', function(e){
        if(touchmoved != true){
      
         
            //find the corresponding canvasObject for the touched canvas
            var currentCanvasObject = getCurrentCanvas(canvas.id);

            //find the x and y offsets of the canvas from top left of screen
            var xOffSet = $("#" + currentCanvasObject.canvasId).offset().left;
            var yOffSet = $("#" + currentCanvasObject.canvasId).offset().top;
            //pass to logic to help determine whether to add touch, and possibly a line
            addPoint(touches.pageX - xOffSet, touches.pageY - yOffSet, currentCanvasObject);
        }
    }).on('vmousemove', function(e){
        touchmoved = true;
        
    }).on('vmousedown', function(e){
        touchmoved = false; 
        touches = e;//.originalEvent.touches[0]; //as described by user mkoistinen on stackoverflow: https://stackoverflow.com/questions/4780837/is-there-an-equivalent-to-e-pagex-position-for-touchstart-event-as-there-is-fo
    });
}
    
function disableTouch(canvas) {
    //this disables touch for the canvas object
    $('#' + canvas.id).unbind('vmouseup');
}


//loop through exercises to find current canvas
//first check answer canvases and then question canvases
function getCurrentCanvas(canvasid){
    var currentCanvasObject;

    for (var i = 0; i < exercises.length; i++){
        for (var j = 0; j < exercises[i].questions[exercises[i].currentQuestion-1].answerCanvas.length; j++){
            if(exercises[i].questions[exercises[i].currentQuestion-1].answerCanvas[j].canvasId == canvasid){
                currentCanvasObject = exercises[i].questions[exercises[i].currentQuestion-1].answerCanvas[j];
     
            }
        }
    }

    if(currentCanvasObject==undefined){
        for (var i = 0; i < exercises.length; i++){
            for (var j = 0; j < exercises[i].questions[exercises[i].currentQuestion-1].questionCanvas.length; j++){
                if(exercises[i].questions[exercises[i].currentQuestion-1].questionCanvas[j].canvasId == canvasid){
                    currentCanvasObject = exercises[i].questions[exercises[i].currentQuestion-1].questionCanvas[j];

                }
            }
        }

    }

    return currentCanvasObject;
}

//////ORTHOGRAPHIC TOUCH FUNCTIONS/////////////////

function enableTouchOrth(canvas) {
    //this enables touch for the canvas object
    //Based upon JQuery bind structure posted by Levarne Sobotker on stackoverflow: https://stackoverflow.com/questions/7069458/prevent-touchstart-when-swiping
        $('#' + canvas.id).on('vmouseup', function(e){
            if(touchmoved != true){
      
         
                //find the corresponding canvasObject for the touched canvas
                var currentCanvasObject = getCurrentCanvas(canvas.id);
               
    
               //find the x and y offsets of the canvas from top left of screen
                var xOffSet = $("#" + currentCanvasObject.canvasId).offset().left;
                var yOffSet = $("#" + currentCanvasObject.canvasId).offset().top;
                //pass to logic to help determine whether to add touch, and possibly a line
                addPointOrth(touches.pageX - xOffSet, touches.pageY - yOffSet, currentCanvasObject);
            }
        }).on('vmousemove', function(e){
            touchmoved = true;
        
        }).on('vmousedown', function(e){
            touchmoved = false; 
            touches = e;//.originalEvent.touches[0]; //as described by user mkoistinen on stackoverflow: https://stackoverflow.com/questions/4780837/is-there-an-equivalent-to-e-pagex-position-for-touchstart-event-as-there-is-fo
        });
}
    
function disableTouchOrth(canvas) {
    //this disables touch for the canvas object
    $('#' + canvas.id).unbind('vmouseup');
}

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//////OTHER TOUCH FUNCTIONS//////////////////////

//variable to help remove eventlisteners with anonymous functions as described by by user Sudipta Kumar Maiti on stackoverflow: https://stackoverflow.com/questions/33786630/removeeventlistener-and-anonymous-function-with-arguments
var myAnonymous = null

function enableTouchText(canvas, text, rotation) {
    //we have to disable drawing lines on the canvas while we add text (only isometric)
    disableTouch(canvas);
    //this enables touch for the canvas object and sets it to handle placing text with touch
    canvas.addEventListener("touchstart", function(evt){myAnonymous = arguments.callee; handleStartText(evt, text,rotation);}, false);
}
    
function disableTouchText(canvas, text, rotation) {
    //this disables touch for the canvas object in terms of placing text
    canvas.removeEventListener("touchstart", myAnonymous);
    //deselect the adding text buttons
    disableDrawText();
    //we have to then enable the drawing of lines again (only isometric)
    enableTouch(canvas);
}

function enableTouchAxes(canvas, axis, axisLabel) {
    //we have to disable drawing lines on the canvas while we add axis (only isometric)
    disableTouch(canvas);
    //this enables touch for the canvas object and sets it to handle placing axis with touch
    canvas.addEventListener("touchstart", function(evt){myAnonymous = arguments.callee; handleStartAxes(evt, axis, axisLabel);}, false);
}
    
function disableTouchAxes(canvas, axis, axisLabel) {
    //this disables touch for the canvas object in terms of placing axes
    canvas.removeEventListener("touchstart", myAnonymous);
    //deselect the adding axes buttons
    disableDrawAxes();
    //we have to then enable the drawing of lines again (only isometric)
    enableTouch(canvas);
}

function enableTouchTrails(canvas, axis) {
    //we have to disable drawing lines on the canvas while we add trail (only isometric)
    disableTouch(canvas);
    //this enables touch for the canvas object and sets it to handle placing trail with touch
    canvas.addEventListener("touchstart", function(evt){myAnonymous = arguments.callee; handleStartTrails(evt, axis);}, false);
}
    
function disableTouchTrails(canvas, axis) {
    //this disables touch for the canvas object in terms of placing trails
    canvas.removeEventListener("touchstart", myAnonymous);
    //deselect the adding trail buttons
    disableDrawTrails();
    //we have to then enable the drawing of lines again (only isometric)
    enableTouch(canvas);
}

function enableTouchMirror(canvas, mirrorCanvasObject) {
    //this enables touch for the canvas object and sets it to handle touch and mirrors on other canvas
    canvas.addEventListener("touchstart", function(evt){myAnonymous = arguments.callee; handleStartMirror(evt, mirrorCanvasObject);}, false);
}
    
function disableTouchMirror(canvas, axis) {
    //this disables touch for the canvas object in terms of placing trails
    canvas.removeEventListener("touchstart", myAnonymous);
}

//function to handleStartText - i.e. when placing some text on the canvas
function handleStartText(evt, text, rotation) { 
    //prevent mouseclick being processed too
    evt.preventDefault(); 
    //get the id of the touched canvas
    var targetId = evt.targetTouches[0].target.id;
    //find the corresponding canvasObject for the touched canvas
    var currentCanvasObject = getCurrentCanvas(targetId)
    //check if touch is on an answer canvas
    // for (var i = 0; i < question.answerCanvas.length; i++ ){
    //     if(question.answerCanvas[i].canvasId == targetId){
    //         currentCanvasObject = question.answerCanvas[i];
    //     }
    // }
    // //necessary to check if touch is actually on a question canvas (only for ADMIN)
    // if (currentCanvasObject == undefined){
    //     for (var i = 0; i < question.questionCanvas.length; i++ ){
    //         if(question.questionCanvas[i].canvasId == targetId){
    //         currentCanvasObject = question.questionCanvas[i];
    //         }
    //     }
    // }
    //track ongoing touches
    var touches = evt.changedTouches;   
    for (var i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));
        //find the x and y offsets of the canvas from top left of screen
        var xOffSet = $("#" + currentCanvasObject.canvasId).position().left;
        var yOffSet = $("#" + currentCanvasObject.canvasId).position().top;
        //pass to logic to help determine whether to add touch, and possibly a line
        addGridText(currentCanvasObject, touches[i].pageX - xOffSet, touches[i].pageY - yOffSet, text, rotation);
    }
    //remove the event listener when first touch has completed
    var canvasElement = document.getElementById(targetId);
    disableTouchText(canvasElement, text, rotation);
}

//function to handleStartText - i.e. when placing some text on the canvas
function handleStartAxes(evt, axis, axisLabel) { 
    //prevent mouseclick being processed too
    evt.preventDefault(); 
    //get the id of the touched canvas
    var targetId = evt.targetTouches[0].target.id;
    //find the corresponding canvasObject for the touched canvas
    var currentCanvasObject = getCurrentCanvas(targetId)
    //check if touch is on an answer canvas
    // for (var i = 0; i < question.answerCanvas.length; i++ ){
    //     if(question.answerCanvas[i].canvasId == targetId){
    //         currentCanvasObject = question.answerCanvas[i];
    //     }
    // }
    // //necessary to check if touch is actually on a question canvas (only for ADMIN)
    // if (currentCanvasObject == undefined){
    //     for (var i = 0; i < question.questionCanvas.length; i++ ){
    //         if(question.questionCanvas[i].canvasId == targetId){
    //         currentCanvasObject = question.questionCanvas[i];
    //         }
    //     }
    // }
    //track ongoing touches
    var touches = evt.changedTouches;   
    for (var i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));
        //find the x and y offsets of the canvas from top left of screen
        var xOffSet = $("#" + currentCanvasObject.canvasId).position().left;
        var yOffSet = $("#" + currentCanvasObject.canvasId).position().top;
        //pass to logic to help determine whether to add touch, and possibly a line
        addGridAxis(currentCanvasObject, touches[i].pageX - xOffSet, touches[i].pageY - yOffSet, axis, axisLabel);
    }
    //remove the event listener when first touch has completed
    var canvasElement = document.getElementById(targetId);
    disableTouchAxes(canvasElement, axis, axisLabel);
}

//function to handleStartTrails - i.e. when placing trails on the canvas
function handleStartTrails(evt, axis) { 
    //prevent mouseclick being processed too
    evt.preventDefault(); 
    //get the id of the touched canvas
    var targetId = evt.targetTouches[0].target.id;
    //find the corresponding canvasObject for the touched canvas
    var currentCanvasObject = getCurrentCanvas(targetId)
    //check if touch is on an answer canvas
    // for (var i = 0; i < question.answerCanvas.length; i++ ){
    //     if(question.answerCanvas[i].canvasId == targetId){
    //         currentCanvasObject = question.answerCanvas[i];
    //     }
    // }
    // //necessary to check if touch is actually on a question canvas (only for ADMIN)
    // if (currentCanvasObject == undefined){
    //     for (var i = 0; i < question.questionCanvas.length; i++ ){
    //         if(question.questionCanvas[i].canvasId == targetId){
    //         currentCanvasObject = question.questionCanvas[i];
    //         }
    //     }
    // }
    //track ongoing touches
    var touches = evt.changedTouches;   
    for (var i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));
        //find the x and y offsets of the canvas from top left of screen
        var xOffSet = $("#" + currentCanvasObject.canvasId).position().left;
        var yOffSet = $("#" + currentCanvasObject.canvasId).position().top;
        //pass to logic to help determine whether to add touch, and possibly a line
        addGridTrails(currentCanvasObject, touches[i].pageX - xOffSet, touches[i].pageY - yOffSet, axis);
    }
    //remove the event listener when first touch has completed
    var canvasElement = document.getElementById(targetId);
    disableTouchTrails(canvasElement, axis);
}

//function to handleStart during a mirror admin
//touch will only take place on question and mirror Canvas
function handleStartMirror(evt, mirrorCanvasObject) { 
    //prevent mouseclick being processed too
    evt.preventDefault(); 
    //get the id of the touched canvas
    var targetId = evt.targetTouches[0].target.id;
    //find the corresponding canvasObject for the touched canvas
    var currentCanvasObject = getCurrentCanvas(targetId)
    //check if touch is on an answer canvas
    // for (var i = 0; i < question.answerCanvas.length; i++ ){
    //     if(question.answerCanvas[i].canvasId == targetId){
    //         currentCanvasObject = question.answerCanvas[i];
    //     }
    // }
    // //necessary to check if touch is actually on a question canvas (only for ADMIN)
    // if (currentCanvasObject == undefined){
    //     for (var i = 0; i < question.questionCanvas.length; i++ ){
    //         if(question.questionCanvas[i].canvasId == targetId){
    //         currentCanvasObject = question.questionCanvas[i];
    //         }
    //     }
    // }
    //track ongoing touches
    var touches = evt.changedTouches;   
    for (var i = 0; i < touches.length; i++) {
        ongoingTouches.push(copyTouch(touches[i]));
        //find the x and y offsets of the canvas from top left of screen
        var xOffSet = $("#" + currentCanvasObject.canvasId).offset().left;
        var yOffSet = $("#" + currentCanvasObject.canvasId).offset().top;
        //pass to logic to help determine whether to add touch, and possibly a line
        addPoint(touches[i].pageX - xOffSet, touches[i].pageY - yOffSet, currentCanvasObject);
        //add the same touches to the mirror canvas to help with admin
        addPoint(touches[i].pageX - xOffSet, touches[i].pageY - yOffSet, mirrorCanvasObject);
    }
}

////////The following functions are directly from the Mozilla Developer Network Tutorial https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/////////////////

//////////Not Currently used but template left here in case necessary/////////
function handleMove(evt) {
  evt.preventDefault();

  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier); 

    if (idx >= 0) {
      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
    } else {
    
    }
  }
}

///////////Not Currently used but template left here in case necessary//////////        
function handleEnd(evt) {
  evt.preventDefault();

  var touches = evt.changedTouches;

  for (var i = 0; i < touches.length; i++) {
   
    var idx = ongoingTouchIndexById(touches[i].identifier); 

    if (idx >= 0) {
        ongoingTouches.splice(idx, 1); //remove
    } else {
     
    }
  }
}

////////////Not Currently used but template left here in case necessary//////////
function handleCancel(evt) {
  evt.preventDefault();

  var touches = evt.changedTouches;
  
  for (var i = 0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);  
    ongoingTouches.splice(idx, 1);  //remove
  }
}
        
////////////////The following are convenience functions////////////////////////////
        
//Some browsers (e.g. mobile Safari) reuse touch objects between events, so it's best to copy the bits you care about, rather than referencing the entire object.    
function copyTouch(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}
        
//The ongoingTouchIndexById() function below scans through the ongoingTouches array to find the touch matching the given identifier, then returns that touch's index into the array.      
function ongoingTouchIndexById(idToFind) {
  for (var i = 0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;
    
    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}