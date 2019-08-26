//Prototype for RotationsCanvas object. 
//This is needed to display rotation instructions

//canvasId is the id tag of the rotation canvas
//ctx is the context of the rotation canvas
//numericRotations is an array of any numeric rotation instructions
//alphabeticRotations is an array of any alphabetic instructions

//////ROTATION PROPRTIES///////////
//set the rotation instruction pixel size
var rotationPixelSize = 20;
//set the rotation instructions color
var rotationColor = 'black';
//set the rotation instruction style
var rotationStyle = 'sans-serif';
//set rotationCanvas background color
var rotationsBackgroundColor = 'white';
//set rotation arrow lineWidth
var rotationArrowLineWidth = 2;
//set rotation arrow length
var rotationArrowLength = 52;
//set width of arrow head
var rotationArrowHeadWidth = 8;
//set width of arrow head
var rotationArrowHeadHeight = 8;
//set color of rotation arrow head
var rotationArrowHeadColor = 'black';
//set color of rotation arrow tail
var rotationArrowTailColor = 'black';
//set rotation arrow text offset height
var rotationTextOffsetHeight = 8;
//set rotation arrow text offset Width
var rotationTextOffsetWidth = 16;


function RotationCanvas(canvasId) {
    this.canvasId = canvasId;
    this.ctx = document.getElementById(this.canvasId).getContext("2d");
    
    this.numericRotations = [];
    this.alphabeticRotations = [];
}

//Prototype for NumericRotation object. 
//This is required for rotation degree information displayed in rotation questions.

function NumericRotation(degrees){
    this.degrees = degrees;
}

//Prototype for AlphabeticRotation object. 
//This is required for arrow code rotation information displayed in the rotation canvas in rotation questions.
//the direction denotes whether the rotation is 'positive' or 'negative'
//the axis is X, Y or Z

function AlphabeticRotation(direction, axis){
    this.direction = direction;
    this.axis = axis;
}

///////////ADD NUMERIC ROTATIONS TO A CANVAS/////////////////

//function to add numeric rotation instruction
function addNumericRotation(rotationCanvas, degrees){
    rotationCanvas.numericRotations.push(new NumericRotation(degrees));
    drawNumericRotations(rotationCanvas);
}

//function to undo a numeric rotation instruction
function undoNumericRotation(rotationCanvas) {
    rotationCanvas.numericRotations.pop();
    drawNumericRotations(rotationCanvas);
}

//function to clear numeric rotation instructions
function clearNumericRotations(rotationCanvas){
    rotationCanvas.numericRotations.length = 0;
    clearRotationCanvas(rotationCanvas);
}

//function to clear the rotationsCanvas
function clearRotationCanvas(rotationCanvas){
    var rotationCanvasWidth = document.getElementById(rotationCanvas.canvasId).width;
    var rotationCanvasHeight = document.getElementById(rotationCanvas.canvasId).height;
    var curCtx = document.getElementById(rotationCanvas.canvasId).getContext("2d");
    curCtx.fillStyle = rotationsBackgroundColor;
    curCtx.fillRect(0, 0, rotationCanvasWidth, rotationCanvasHeight);
    curCtx.fill();
}

function drawNumericRotations(rotationCanvas){
    clearRotationCanvas(rotationCanvas);
    var width = document.getElementById(rotationCanvas.canvasId).width;
    var height = document.getElementById(rotationCanvas.canvasId).height;
    var curCtx = document.getElementById(rotationCanvas.canvasId).getContext("2d");
    curCtx.fillStyle = rotationColor;
    curCtx.font = '' + rotationPixelSize + 'px ' + rotationStyle;
    
    for (var i = 0; i < rotationCanvas.numericRotations.length; i++){
        curCtx.fillText(rotationCanvas.numericRotations[i].degrees + " degrees", width/3, rotationPixelSize + (rotationPixelSize * i));
        curCtx.strokeText(rotationCanvas.numericRotations[i].degrees + " degrees", width/3, rotationPixelSize + (rotationPixelSize * i));
        
    }
}


///////////ADD ALPHABETIC ROTATIONS TO A CANVAS/////////////////

//function to add alphabetic rotation instruction
function addAlphabeticRotation(rotationCanvas, direction, axis){
    rotationCanvas.alphabeticRotations.push(new AlphabeticRotation(direction, axis));
    drawAlphabeticRotations(rotationCanvas);
}

//function to undo a alphabetic rotation instruction
function undoAlphabeticRotation(rotationCanvas) {
    rotationCanvas.alphabeticRotations.pop();
    drawAlphabeticRotations(rotationCanvas);
}

//function to clear alphabetic rotation instructions
function clearAlphabeticRotations(rotationCanvas){
    rotationCanvas.alphabeticRotations.length = 0;
    clearRotationCanvas(rotationCanvas);
}

function drawAlphabeticRotations(rotationCanvas){
    ("alpha called")
    clearRotationCanvas(rotationCanvas);
    var width = document.getElementById(rotationCanvas.canvasId).width;
    var height = document.getElementById(rotationCanvas.canvasId).height;
    
    for (var i = 0; i < rotationCanvas.alphabeticRotations.length; i++){
        if (rotationCanvas.alphabeticRotations[i].direction == "positive"){
            drawPositiveAlphabeticArrow(rotationCanvas, rotationCanvas.alphabeticRotations[i], width/3, rotationPixelSize + (rotationPixelSize * i));
        }
        else {
            drawNegativeAlphabeticArrow(rotationCanvas, rotationCanvas.alphabeticRotations[i],  width/3, rotationPixelSize + (rotationPixelSize * i));
        }
    }
}

function drawNegativeAlphabeticArrow(rotationCanvas, alphabeticRotation, width, height){
    var curCtx = document.getElementById(rotationCanvas.canvasId).getContext("2d");
    curCtx.beginPath();
    curCtx.moveTo(width, height);
    curCtx.lineWidth = rotationArrowLineWidth;
    
    //draw the arrow head
    curCtx.lineTo(width , height - (rotationArrowHeadWidth/2));
    curCtx.lineTo(width - rotationArrowHeadHeight, height);
    curCtx.lineTo(width , height + (rotationArrowHeadWidth/2));
    curCtx.lineTo(width , height);
    curCtx.strokeStyle = rotationArrowHeadColor;
    curCtx.stroke();
    curCtx.fillStyle = rotationArrowHeadColor;
    curCtx.fill();
    
    
    
    curCtx.lineTo(width + rotationArrowLength, height);
    curCtx.strokeStyle = rotationArrowTailColor;
    curCtx.stroke();
    
    curCtx.font = '' + rotationPixelSize + 'px ' + rotationStyle;
    curCtx.fillStyle = rotationColor;
    curCtx.fillText(alphabeticRotation.axis, width + rotationArrowLength + rotationTextOffsetWidth, height + rotationTextOffsetHeight);
    curCtx.strokeStyle = rotationColor;
    curCtx.strokeText(alphabeticRotation.axis, width + rotationArrowLength + rotationTextOffsetWidth, height + rotationTextOffsetHeight);
    
}
    
function drawPositiveAlphabeticArrow(rotationCanvas, alphabeticRotation, width, height){
    var curCtx = document.getElementById(rotationCanvas.canvasId).getContext("2d");
    curCtx.beginPath();
    curCtx.moveTo(width, height);
    curCtx.lineWidth = rotationArrowLineWidth;
    
    curCtx.lineTo(width + rotationArrowLength, height);
    curCtx.strokeStyle = rotationArrowTailColor;
    curCtx.stroke();
    
    //draw the arrow head
    curCtx.lineTo(width + rotationArrowLength, height - (rotationArrowHeadWidth/2));
    curCtx.lineTo(width + rotationArrowLength + rotationArrowHeadHeight, height);
    curCtx.lineTo(width + rotationArrowLength, height + (rotationArrowHeadWidth/2));
    curCtx.lineTo(width + rotationArrowLength, height);
    curCtx.strokeStyle = rotationArrowHeadColor;
    curCtx.stroke();
    curCtx.fillStyle = rotationArrowHeadColor;
    curCtx.fill();
    
    
    curCtx.font = '' + rotationPixelSize + 'px ' + rotationStyle;
    curCtx.fillText(alphabeticRotation.axis, width + rotationArrowLength + rotationTextOffsetWidth, height + rotationTextOffsetHeight);
    curCtx.strokeText(alphabeticRotation.axis, width + rotationArrowLength + rotationTextOffsetWidth, height + rotationTextOffsetHeight);
    
}