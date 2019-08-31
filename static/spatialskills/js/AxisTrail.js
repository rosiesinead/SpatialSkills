///////////TRAIL PROPERTIES/////////////////////////////
//set the string for x axis
var trailStringX = "X";
//set the string for y axis
var trailStringY = "Y";
//set the string for z axis
var trailStringZ = "Z";
//set axis arrow length
var trailLength = 2* yDistBetweenDots; //original 2*yDistBetweenDots
//set trail offset
var trailOffset = -yDistBetweenDots/2; //original 1* yDistBetweenDots
//set trail color
var trailColor = 'black';
//set trail lineWidth
var trailLineWidth = 2;
//set trail rotation
var trailXRotation = 300;
//set xAxis rotation
var trailYRotation = 180;
//set zAxis rotation
var trailZRotation = 60;

//Prototype for axis trail object. 
//This is required for axes in rotation questions.
//Parameters x1 and y1 note the start coordinates of the axis trail on the canvas
//the axis is X, Y or Z

function AxisTrail(x1, y1, axis){
    this.x1 = x1;
    this.y1 = y1;
    this.axis = axis;
}

/////////////////////////////TRAILS//////////////////////////////////////////////

function addGridTrails(canvasObject, x, y, axis) {
    
    var dotCoordinateArray = findClosestCoord(x, y);
    canvasObject.axisTrails.push(new AxisTrail(dotCoordinateArray[0], dotCoordinateArray[1], axis));
    //drawText(canvasObject);
    drawLines(canvasObject, canvasObject.linesCurrentlyDrawn);
}

//function to add trail to the canvas at the touch point////
function drawTrails(canvasObject){
    for (var i = 0; i < canvasObject.axisTrails.length; i++){
        var trueX = findTrueXCoord(canvasObject.axisTrails[i].x1);
        var trueY = findTrueYCoord(canvasObject.axisTrails[i].y1);
        var curCtx = document.getElementById(canvasObject.canvasId).getContext("2d");
        var axis = canvasObject.axisTrails[i].axis;
        var rotation = trailYRotation;
        
        if (canvasObject.axisTrails[i].axis == trailStringX){
            rotation = trailXRotation;
        }
        if (canvasObject.axisTrails[i].axis == trailStringZ){
            rotation = trailZRotation;
        }
        
        //may need some rotation
        //save the current canvas state
        curCtx.save();
        //move the canvas origin to the start of the arrow
        curCtx.translate(trueX, trueY);
        //do the rotation
        curCtx.rotate((Math.PI / 180) * rotation);
        //move the canvas origin to the start of the canvas again
        curCtx.translate(-(trueX), -(trueY));
        
        //draw the trail line
        curCtx.beginPath();
        curCtx.moveTo(trueX, trueY + trailOffset);
        curCtx.lineWidth = trailLineWidth;
        curCtx.lineTo(trueX, trueY - trailLength);
        curCtx.strokeStyle = trailColor;
        curCtx.stroke();
        
        //restore the canvas
        curCtx.restore();
        
    }
}

//function to undo the last trail drawn
function undoTrail(canvasObject) {
    canvasObject.axisTrails.pop();
    drawLines(canvasObject, canvasObject.linesCurrentlyDrawn);        
}

//function to clear trails
function clearTrails(canvasObject){
    canvasObject.axisTrails.length = 0;
    drawLines(canvasObject, canvasObject.linesCurrentlyDrawn);
}