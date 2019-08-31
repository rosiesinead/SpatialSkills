//touch functionality used by the main app, with separate touch for Isometric and Orthographic grids
//the function below have been created with help from the Mozilla Developer Network Canvas Totorials https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
//However, with use of jquery and bind events, the addition and removal of touch is much simpler than with JavaScript. 

//The code below uses the JQuery bind structure posted by Levarne Sobotker on stackoverflow: https://stackoverflow.com/questions/7069458/prevent-touchstart-when-swiping as this ensures that scrolling can be enabled, rather than a touch, if the user attempts to scroll.

//The code below also makes use of the originalevent as described by user mkoistinen on stackoverflow: https://stackoverflow.com/questions/4780837/is-there-an-equivalent-to-e-pagex-position-for-touchstart-event-as-there-is-fo as we need the original event when making use of the JQuery bind structure
 //Based upon JQuery bind structure posted by Levarne Sobotker on stackoverflow: https://stackoverflow.com/questions/7069458/prevent-touchstart-when-swiping

 //ROSIE: this function has been been updated to eliminate code repetition. There is now one single enableTouch function used by both the admin and user interface.
 //The switch statement checks the type of touch and calls the relevant function.

 function enableTouch(typeOfTouch,canvasElement,variable3,variable4) {
    //need to disable touch first to prevent lines and axes/trails/text being drawn at the same time
    disableTouch(canvasElement);

    $('#' + canvasElement.id).on('vmouseup', function(e){
        if(touchmoved != true){
            //find the corresponding canvasObject for the touched canvas
            var currentCanvasObject = getCurrentCanvas(canvasElement.id);
            //find the x and y offsets of the canvas from top left of screen
            var xOffSet = $("#" + currentCanvasObject.canvasId).offset().left;
            var yOffSet = $("#" + currentCanvasObject.canvasId).offset().top;

            switch(typeOfTouch){
                case 'isometric':
                    //pass to logic to help determine whether to add touch, and possibly a line
                    addPoint(touches.pageX - xOffSet, touches.pageY - yOffSet, currentCanvasObject);
                    break;
                case 'orthographic':
                    //pass to logic to help determine whether to add touch, and possibly a line
                    addPointOrth(touches.pageX - xOffSet, touches.pageY - yOffSet, currentCanvasObject);
                    break;
                case "text":
                    text = variable3;
                    rotation = variable4;
                     //this enables touch for the canvas object and sets it to handle placing text with touch
                    addGridText(currentCanvasObject, touches.pageX - xOffSet, touches.pageY - yOffSet, text, rotation);
                    disableTouch(canvasElement)
                    disableDrawText()
                    prepareForNewLine(currentCanvasObject,canvasElement);
                    break;
                case "axes":
                    axis = variable3;
                    axisLabel = variable4;
                    //this enables touch for the canvas object and sets it to handle placing text with touch
                    addGridAxis(currentCanvasObject, touches.pageX - xOffSet, touches.pageY - yOffSet, axis, axisLabel);
                    disableTouch(canvasElement)
                    disableDrawAxes();
                    prepareForNewLine(currentCanvasObject,canvasElement);
                    break;
                case "trails":
                    axis = variable3;
                    //this enables touch for the canvas object and sets it to handle placing text with touch
                    addGridTrails(currentCanvasObject, touches.pageX - xOffSet, touches.pageY - yOffSet, axis);
                    disableTouch(canvasElement)
                    disableDrawTrails();
                    prepareForNewLine(currentCanvasObject,canvasElement);
                    
                    break;
                case "mirror":
                    mirrorCanvasObject = variable3;
                    addPoint(touches.pageX - xOffSet, touches.pageY - yOffSet, currentCanvasObject);
                    //add the same touches to the mirror canvas to help with admin
                    addPoint(touches.pageX - xOffSet, touches.pageY - yOffSet, mirrorCanvasObject);
                    disableTouch(canvasElement)
                    disableTouch(mirrorCanvasObject)
                    break;
            }
            
            
        }
    }).on('vmousemove', function(e){
        touchmoved = true;
        
    }).on('vmousedown', function(e){
        touchmoved = false; 
        touches = e;//https://stackoverflow.com/questions/4780837/is-there-an-equivalent-to-e-pagex-position-for-touchstart-event-as-there-is-fo
    });
}

    
function disableTouch(canvas) {
    //this disables touch for the canvas object
    $('#' + canvas.id).unbind('vmouseup');
}

// this clears the temp line so that the point will start in a new place and then enables touch 
function prepareForNewLine(currentCanvasObject,canvasElement){
    currentCanvasObject.tempLine = []
    enableTouch("isometric",canvasElement)
    
}

// function disableTouchText(canvas, text, rotation) {
//     //this disables touch for the canvas object in terms of placing text
//     canvas.removeEventListener("touchstart", myAnonymous);
//     //deselect the adding text buttons
//     disableDrawText();
//     //we have to then enable the drawing of lines again (only isometric)
//     enableTouch(canvas);
// }

    
// function disableTouchTrails(canvas, axis) {
//     //this disables touch for the canvas object in terms of placing trails
//     canvas.removeEventListener("touchstart", myAnonymous);
//     //deselect the adding trail buttons
//     disableDrawTrails();
//     //we have to then enable the drawing of lines again (only isometric)
//     enableTouch(canvas);
// }


//loop through exercises to find current canvas
//first check answer canvases and then question canvases
function getCurrentCanvas(canvasid){
    var currentCanvasObject;

    for (var i = 0; i < exercises.length; i++){
        var currentQuestion = exercises[i].questions[exercises[i].currentQuestion-1];
        for (var j = 0; j < currentQuestion.answerCanvas.length; j++){
            var answerCanvas = currentQuestion.answerCanvas[j];
            if(answerCanvas.canvasId == canvasid){
                currentCanvasObject = answerCanvas;
     
            }
        }
    }

    if(currentCanvasObject==undefined){
        for (var i = 0; i < exercises.length; i++){
            var currentQuestion = exercises[i].questions[exercises[i].currentQuestion-1]
            for (var j = 0; j < currentQuestion.questionCanvas.length; j++){
                var questionCanvas = currentQuestion.questionCanvas[j]
                if(questionCanvas.canvasId == canvasid){
                    currentCanvasObject = questionCanvas;

                }
            }
        }

    }

    return currentCanvasObject;
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