//Prototype for gridText object. 
//This is needed for any text that has to be displayed on the canvas e.g. 'FRONT'.
//x1 and y1 note the start of the text on the canvas
//text is used to store the text that will be displayed
//rotation is used to indicate the rotation in degrees of the text on the canvas

////TEXT PROPERTIES//////////////
//set text pixel size
var textPixels = 20;
//set text style
var textStyle = 'sans-serif';
//set text color
var textColor = 'black';
//set message to signify front of an isometric shape
var textFront = "FRONT";
//set canvas rotation for text that slopes up to the right along z axis
var textSlopeUpToRightAngle = -30;
//set canvas rotation for text that slopes down to the right along x axis
var textSlopeDownToTheRightAngle = 30;

function GridText(x1, y1, text, rotation){
    this.x1 = x1;
    this.y1 = y1;
    this.text = text;
    this.rotation = rotation;
}

///////////ADD GRID TEXT TO A CANVAS////////////////

function addGridText(canvasObject, x, y, text, rotation) {
    
    var dotCoordinateArray = findClosestCoord(x, y);
    canvasObject.gridText.push(new GridText(dotCoordinateArray[0], dotCoordinateArray[1], text, rotation));
    drawLines(canvasObject, canvasObject.linesCurrentlyDrawn);
}

//function to add text to the canvas at the touch point////
function drawText(canvasObject){
    for (var i = 0; i < canvasObject.gridText.length; i++){
        var trueX = findTrueXCoord(canvasObject.gridText[i].x1);
        var trueY = findTrueYCoord(canvasObject.gridText[i].y1);
        var curCtx = document.getElementById(canvasObject.canvasId).getContext("2d");
        //need some rotation
        //save the current canvas state
        curCtx.save();
        //move the canvas origin to the start of the text
        curCtx.translate(trueX, trueY);
        //do the rotation
        curCtx.rotate((Math.PI / 180) * canvasObject.gridText[i].rotation);
        
        //set the font and color
        curCtx.fillStyle = textColor;
        curCtx.font = '' + textPixels + 'px ' + textStyle;
        
        //draw the text
        curCtx.fillText(canvasObject.gridText[i].text, 0, 0);
        
        //restore the canvas
        curCtx.restore();
    }
}

//function to undo the last text drawn
function undoText(canvasObject) {
    if (canvasObject.gridText.length > 0){
        //remove the last item from the text currently drawn 
        canvasObject.gridText.pop();
        
        drawLines(canvasObject, canvasObject.linesCurrentlyDrawn);        
    }
}

function clearText(canvasObject) {
    drawDots(canvasObject);
    //clear any touch points
    canvasObject.tempLine.pop();    
    //remove all lines from the lines currently drawn, but add them to linesAllDrawn to keep a record of the lines cleared
    canvasObject.gridText = [];
}