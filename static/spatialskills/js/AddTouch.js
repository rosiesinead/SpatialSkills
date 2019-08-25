//touch functionality used by the main app, with separate touch for Isometric and Orthographic grids
//the function below have been created with help from the Mozilla Developer Network Canvas Totorials https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
//However, with use of jquery and bind events, the addition and removal of touch is much simpler than with JavaScript. 

//The code below uses the JQuery bind structure posted by Levarne Sobotker on stackoverflow: https://stackoverflow.com/questions/7069458/prevent-touchstart-when-swiping as this ensures that scrolling can be enabled, rather than a touch, if the user attempts to scroll.

//The code below also makes use of the originalevent as described by user mkoistinen on stackoverflow: https://stackoverflow.com/questions/4780837/is-there-an-equivalent-to-e-pagex-position-for-touchstart-event-as-there-is-fo as we need the original event when making use of the JQuery bind structure


//////ISOMETRIC TOUCH FUNCTIONS/////////////////

// function enableTouch(canvas) {
//     //this enables touch for the canvas object
//     //Based upon JQuery bind structure posted by Levarne Sobotker on stackoverflow: https://stackoverflow.com/questions/7069458/prevent-touchstart-when-swiping
//     $('#' + canvas.id).on('vmouseup', function(e){
//         if(touchmoved != true){
      
         
//             //find the corresponding canvasObject for the touched canvas
//             var currentCanvasObject = getCurrentCanvas(canvas.id);

//             //find the x and y offsets of the canvas from top left of screen
//             var xOffSet = $("#" + currentCanvasObject.canvasId).offset().left;
//             var yOffSet = $("#" + currentCanvasObject.canvasId).offset().top;
//             //pass to logic to help determine whether to add touch, and possibly a line
//             addPoint(touches.pageX - xOffSet, touches.pageY - yOffSet, currentCanvasObject);
//         }
//     }).on('vmousemove', function(e){
//         touchmoved = true;
        
//     }).on('vmousedown', function(e){
//         touchmoved = false; 
//         touches = e;//.originalEvent.touches[0]; //as described by user mkoistinen on stackoverflow: https://stackoverflow.com/questions/4780837/is-there-an-equivalent-to-e-pagex-position-for-touchstart-event-as-there-is-fo
//     });
// }

function enableTouch(flag,canvas,var3,var4) {
    //this enables touch for the canvas object
    //Based upon JQuery bind structure posted by Levarne Sobotker on stackoverflow: https://stackoverflow.com/questions/7069458/prevent-touchstart-when-swiping
    $('#' + canvas.id).on('vmouseup', function(e){
        if(touchmoved != true){

            //find the corresponding canvasObject for the touched canvas
            var currentCanvasObject = getCurrentCanvas(canvas.id);

            //find the x and y offsets of the canvas from top left of screen
            var xOffSet = $("#" + currentCanvasObject.canvasId).offset().left;
            var yOffSet = $("#" + currentCanvasObject.canvasId).offset().top;
            switch(flag){
                case "isometric":
                    //pass to logic to help determine whether to add touch, and possibly a line
                    addPoint(touches.pageX - xOffSet, touches.pageY - yOffSet, currentCanvasObject);
                    break;
                case "orthographic":
                    //pass to logic to help determine whether to add touch, and possibly a line
                    addPointOrth(touches.pageX - xOffSet, touches.pageY - yOffSet, currentCanvasObject);
                    break;
                case "text":
                    text = var3;
                    rotation = var4;
                     //this enables touch for the canvas object and sets it to handle placing text with touch
                    addGridText(currentCanvasObject, touches.pageX - xOffSet, touches.pageY - yOffSet, text, rotation);
                    disableTouch(canvas)
                    disableDrawText();
                    break;
                case "axes":
                    axis = var3;
                    axisLabel = var4;
                    //this enables touch for the canvas object and sets it to handle placing text with touch
                    addGridAxis(currentCanvasObject, touches.pageX - xOffSet, touches.pageY - yOffSet, axis, axisLabel);
                    disableTouch(canvas)
                    disableDrawAxes();
                    break;
                case "trails":
                    axis = var3;
                    //this enables touch for the canvas object and sets it to handle placing text with touch
                    addGridTrails(currentCanvasObject, touches.pageX - xOffSet, touches.pageY - yOffSet, axis);
                    disableTouch(canvas)
                    disableDrawTrails();
                    break;
                case "mirror":
                    mirrorCanvasObject = var3;
                    addPoint(touches.pageX - xOffSet, touches.pageY - yOffSet, currentCanvasObject);
                    //add the same touches to the mirror canvas to help with admin
                    addPoint(touches.pageX - xOffSet, touches.pageY - yOffSet, mirrorCanvasObject);
                    disableTouch(canvas)
                    disableTouch(mirrorCanvasObject)
                    break;
            }
            
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

// function enableTouchOrth(canvas) {
//     //this enables touch for the canvas object
//     //Based upon JQuery bind structure posted by Levarne Sobotker on stackoverflow: https://stackoverflow.com/questions/7069458/prevent-touchstart-when-swiping
//         $('#' + canvas.id).on('vmouseup', function(e){
//             if(touchmoved != true){
      
         
//                 //find the corresponding canvasObject for the touched canvas
//                 var currentCanvasObject = getCurrentCanvas(canvas.id);
               
    
//                //find the x and y offsets of the canvas from top left of screen
//                 var xOffSet = $("#" + currentCanvasObject.canvasId).offset().left;
//                 var yOffSet = $("#" + currentCanvasObject.canvasId).offset().top;
//                 //pass to logic to help determine whether to add touch, and possibly a line
//                 addPointOrth(touches.pageX - xOffSet, touches.pageY - yOffSet, currentCanvasObject);
//             }
//         }).on('vmousemove', function(e){
//             touchmoved = true;
        
//         }).on('vmousedown', function(e){
//             touchmoved = false; 
//             touches = e;//.originalEvent.touches[0]; //as described by user mkoistinen on stackoverflow: https://stackoverflow.com/questions/4780837/is-there-an-equivalent-to-e-pagex-position-for-touchstart-event-as-there-is-fo
//         });
// }
    
// function disableTouchOrth(canvas) {
//     //this disables touch for the canvas object
//     $('#' + canvas.id).unbind('vmouseup');
// }

///////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////
//////OTHER TOUCH FUNCTIONS//////////////////////

//variable to help remove eventlisteners with anonymous functions as described by by user Sudipta Kumar Maiti on stackoverflow: https://stackoverflow.com/questions/33786630/removeeventlistener-and-anonymous-function-with-arguments
// var myAnonymous = null

// function enableTouchText(canvas, text, rotation) {
//     disableTouch(canvas);

//     $('#' + canvas.id).on('vmouseup', function(e){
//         if(touchmoved != true){
       
//             //find the corresponding canvasObject for the touched canvas
//             var currentCanvasObject = getCurrentCanvas(canvas.id);

//             //find the x and y offsets of the canvas from top left of screen
//             var xOffSet = $("#" + currentCanvasObject.canvasId).offset().left;
//             var yOffSet = $("#" + currentCanvasObject.canvasId).offset().top;

//            //this enables touch for the canvas object and sets it to handle placing text with touch
//             addGridText(currentCanvasObject, touches.pageX - xOffSet, touches.pageY - yOffSet, text, rotation);
//             disableTouch(canvas)
//             disableDrawText();
        
//         }
        
//     }).on('vmousemove', function(e){
//         touchmoved = true;
        
//     }).on('vmousedown', function(e){
//         touchmoved = false; 
//         touches = e;//.originalEvent.touches[0]; //as described by user mkoistinen on stackoverflow: https://stackoverflow.com/questions/4780837/is-there-an-equivalent-to-e-pagex-position-for-touchstart-event-as-there-is-fo
//     });
// }

    
// function disableTouchText(canvas, text, rotation) {
//     //this disables touch for the canvas object in terms of placing text
//     canvas.removeEventListener("touchstart", myAnonymous);
//     //deselect the adding text buttons
//     disableDrawText();
//     //we have to then enable the drawing of lines again (only isometric)
//     enableTouch(canvas);
// }

// function enableTouchAxes(canvas, axis, axisLabel) {
//     //we have to disable drawing lines on the canvas while we add axis (only isometric)
//     disableTouch(canvas);
//     $('#' + canvas.id).on('vmouseup', function(e){
//         if(touchmoved != true){
       
//             //find the corresponding canvasObject for the touched canvas
//             var currentCanvasObject = getCurrentCanvas(canvas.id);

//             //find the x and y offsets of the canvas from top left of screen
//             var xOffSet = $("#" + currentCanvasObject.canvasId).offset().left;
//             var yOffSet = $("#" + currentCanvasObject.canvasId).offset().top;

//            //this enables touch for the canvas object and sets it to handle placing text with touch
//            addGridAxis(currentCanvasObject, touches.pageX - xOffSet, touches.pageY - yOffSet, axis, axisLabel);
//            disableTouch(canvas)
//            disableDrawAxes();
        
//         }
//     }).on('vmousemove', function(e){
//         touchmoved = true;
        
//     }).on('vmousedown', function(e){
//         touchmoved = false; 
//         touches = e;//.originalEvent.touches[0]; //as described by user mkoistinen on stackoverflow: https://stackoverflow.com/questions/4780837/is-there-an-equivalent-to-e-pagex-position-for-touchstart-event-as-there-is-fo
//     });

//     //this enables touch for the canvas object and sets it to handle placing axis with touch
//    // canvas.addEventListener("touchstart", function(evt){myAnonymous = arguments.callee; handleStartAxes(evt, axis, axisLabel);}, false);
// }
    

// function enableTouchTrails(canvas, axis) {
//     //we have to disable drawing lines on the canvas while we add trail (only isometric)
//     disableTouch(canvas);
//     $('#' + canvas.id).on('vmouseup', function(e){
//         if(touchmoved != true){
       
//             //find the corresponding canvasObject for the touched canvas
//             var currentCanvasObject = getCurrentCanvas(canvas.id);

//             //find the x and y offsets of the canvas from top left of screen
//             var xOffSet = $("#" + currentCanvasObject.canvasId).offset().left;
//             var yOffSet = $("#" + currentCanvasObject.canvasId).offset().top;

//            //this enables touch for the canvas object and sets it to handle placing text with touch
//            addGridTrails(currentCanvasObject, touches.pageX - xOffSet, touches.pageY - yOffSet, axis);
//         //    var canvasElement = document.getElementById(canvasId);
//         //    disableTouchTrails(canvasElement, axis);
//             disableTouch(canvas)
//             disableDrawTrails();
//            // comsole.log("test")
        
//         }
//     }).on('vmousemove', function(e){
//         touchmoved = true;
        
//     }).on('vmousedown', function(e){
//         touchmoved = false; 
//         touches = e;//.originalEvent.touches[0]; //as described by user mkoistinen on stackoverflow: https://stackoverflow.com/questions/4780837/is-there-an-equivalent-to-e-pagex-position-for-touchstart-event-as-there-is-fo
//     });
    // //this enables touch for the canvas object and sets it to handle placing trail with touch
    // canvas.addEventListener("touchstart", function(evt){myAnonymous = arguments.callee; handleStartTrails(evt, axis);}, false);
//}
    
function disableTouchTrails(canvas, axis) {
    //this disables touch for the canvas object in terms of placing trails
    canvas.removeEventListener("touchstart", myAnonymous);
    //deselect the adding trail buttons
    disableDrawTrails();
    //we have to then enable the drawing of lines again (only isometric)
    enableTouch(canvas);
}

function enableTouchMirror(canvas, mirrorCanvasObject) {

    disableTouch(canvas);
    $('#' + canvas.id).on('vmouseup', function(e){
        if(touchmoved != true){
       
            //find the corresponding canvasObject for the touched canvas
            var currentCanvasObject = getCurrentCanvas(canvas.id);

            //find the x and y offsets of the canvas from top left of screen
            var xOffSet = $("#" + currentCanvasObject.canvasId).offset().left;
            var yOffSet = $("#" + currentCanvasObject.canvasId).offset().top;

               //pass to logic to help determine whether to add touch, and possibly a line
    addPoint(touches.pageX - xOffSet, touches.pageY - yOffSet, currentCanvasObject);
    //add the same touches to the mirror canvas to help with admin
    addPoint(touches.pageX - xOffSet, touches.pageY - yOffSet, mirrorCanvasObject);
    disableTouch(canvas)
    disableTouch(mirrorCanvasObject)

}
    }).on('vmousemove', function(e){
        touchmoved = true;
        
    }).on('vmousedown', function(e){
        touchmoved = false; 
        touches = e;//.originalEvent.touches[0]; //as described by user mkoistinen on stackoverflow: https://stackoverflow.com/questions/4780837/is-there-an-equivalent-to-e-pagex-position-for-touchstart-event-as-there-is-fo
    });


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