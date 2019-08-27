//////AXIS PROPERTIES////////////////
var xDistBetweenDots = getxDistBetweenDots();
var yDistBetweenDots = getyDistBetweenDots();

//set the label for x axis that appears on canvas
var axisLabelX = "X";
//set the label for y axis that appears on canvas
var axisLabelY = "Y";
//set the label for z axis that appears on canvas
var axisLabelZ = "Z";
//set the string for blank axis
var axisLabelBlank = "blank";
//set the string for x axis
var axisStringX = "X";
//set the string for y axis
var axisStringY = "Y";
//set the string for z axis
var axisStringZ = "Z";
//set axis arrow lineWidth
var axisArrowLineWidth = 2;
//set axis arrow length
var axisArrowLength = 2* yDistBetweenDots; //original 2*
//set arrow offset
var axisArrowOffset = -yDistBetweenDots/2; //yDistBetweenDots/2; //original 1*
//set width of arrow head
var axisArrowHeadWidth = yDistBetweenDots/2;
//set width of arrow head
var axisArrowHeadHeight = yDistBetweenDots/2;
//set color of axis arrow head
var axisArrowHeadColor = 'black';
//set color of axis arrow tail
var axisArrowTailColor = 'black';
//set axis text color
var axisTextColor = 'black';
//set axis text pixels
var axisTextPixels = xDistBetweenDots;
//set axis text style
var axisTextStyle = 'sans-serif';
//set x axis arrow text offset height
var axisXTextOffsetHeight = yDistBetweenDots/2;
//set x axis arrow text offset Width
var axisXTextOffsetWidth = (-(distBetweenDots/4));
//set y axis arrow text offset height
var axisYTextOffsetHeight = yDistBetweenDots;
//set y axis arrow text offset Width
var axisYTextOffsetWidth = distBetweenDots/4;
//set z axis arrow text offset height
var axisZTextOffsetHeight = 2 * (distBetweenDots/3);
//set z axis arrow text offset Width
var axisZTextOffsetWidth = 0;
//set xAxis rotation
var axisXRotation = 120;
//set xAxis rotation
var axisYRotation = 0;
//set zAxis rotation
var axisZRotation = 240;


//Prototype for axis object. 
//This is required for axes in rotation questions.
//x1 and y1 parameters note the start cooridnates of the axis on the canvas
//the axis parameter is X, Y or Z
//the label parameter is 'X', 'Y', 'Z' or 'blank'

function Axis(x1, y1, axis, axisLabel){
    this.x1 = x1;
    this.y1 = y1;
    this.axis = axis;
    this.axisLabel = axisLabel;
}

////////////////AXES////////////////////////////////////////////////////

function addGridAxis(canvasObject, x, y, axis, axisLabel) {
    
    var dotCoordinateArray = findClosestCoord(x, y);
    canvasObject.axes.push(new Axis(dotCoordinateArray[0], dotCoordinateArray[1], axis, axisLabel));
    //drawText(canvasObject);
    drawLines(canvasObject, canvasObject.linesCurrentlyDrawn);
}

//function to add axis to the canvas at the touch point////
function drawAxes(canvasObject){
    for (var i = 0; i < canvasObject.axes.length; i++){
        var trueX = findTrueXCoord(canvasObject.axes[i].x1);
        var trueY = findTrueYCoord(canvasObject.axes[i].y1);
        var curCtx = document.getElementById(canvasObject.canvasId).getContext("2d");
        var axis = canvasObject.axes[i].axis;
        var axisLabel = canvasObject.axes[i].axisLabel;
        var rotation = 0;
        var textHeightOffset = axisYTextOffsetHeight;
        var textWidthOffset = axisYTextOffsetWidth;
        
        if (canvasObject.axes[i].axis == axisStringX){
            rotation = axisXRotation;
            textHeightOffset = axisXTextOffsetHeight;
            textWidthOffset = axisXTextOffsetWidth;
        }
        if (canvasObject.axes[i].axis == axisStringZ){
            rotation = axisZRotation;
            textHeightOffset = axisZTextOffsetHeight;
            textWidthOffset = axisZTextOffsetWidth;
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
        
        //draw the arrow line
        curCtx.beginPath();
        curCtx.moveTo(trueX, trueY + axisArrowOffset);
        curCtx.lineWidth = axisArrowLineWidth;
        curCtx.lineTo(trueX, trueY - axisArrowLength);
        curCtx.strokeStyle = axisArrowTailColor;
        curCtx.stroke();
        
        //draw the arrow head
        curCtx.lineTo(trueX - (axisArrowHeadWidth/2), trueY - axisArrowLength);
        curCtx.lineTo(trueX, trueY - axisArrowLength - axisArrowHeadHeight);
        curCtx.lineTo(trueX + (axisArrowHeadWidth/2), trueY - axisArrowLength);
        curCtx.lineTo(trueX, trueY - axisArrowLength);
        curCtx.strokeStyle = axisArrowHeadColor;
        curCtx.stroke();
        curCtx.fillStyle = axisArrowHeadColor;
        curCtx.fill();
        
        if (canvasObject.axes[i].axisLabel != axisLabelBlank) {
        
            curCtx.translate(trueX - textWidthOffset, trueY - axisArrowLength - axisArrowHeadHeight - textHeightOffset);
        
            //rotate back so that that text is not rotated
            curCtx.rotate((Math.PI / 180) * (-(rotation)));
        
            //set the font and color
            curCtx.fillStyle = axisTextColor;
            curCtx.font = '' + axisTextPixels + 'px ' + axisTextStyle;
        
        
            //draw the text
            curCtx.fillText(canvasObject.axes[i].axisLabel, 0, 0);
        }
        
        //restore the canvas
        curCtx.restore();
        
    }
}

//function to undo the last axis drawn
function undoAxis(canvasObject) {
    canvasObject.axes.pop();
    drawLines(canvasObject, canvasObject.linesCurrentlyDrawn);        
}

//function to clear axes
function clearAxes(canvasObject){
    canvasObject.axes.length = 0;
    drawLines(canvasObject, canvasObject.linesCurrentlyDrawn);
}