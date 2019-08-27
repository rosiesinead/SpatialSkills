//Prototype for Line object. 
//This is required to store the start and end x,y coordinates of a line
//x1 and y1 note the start of the line on the canvas
//x2 and y2 note the end of the line on the canvas
//type is used to note whether the line is solid or dashed
//color set to default as this allows colour to be changed elsewhere due to named value in drawing functions

////LINE PROPERTIES/////////////////
//set the line width for the lines that a user draws on the canvas
var lineWidth = 4;
//set the line width for axis arrows
var axisLineWidth = 2;
//set the dash width for dashed lines
var dashLineWidth = 3;
//set the space between dashes for dashed lines
var dashSpaceWidth = 5;


//set the colour of the lines that are drawn on the grid
var lineColor = 'black';
//set the color of the answer lines that are correct
var lineCorrectColor = 'green';
//set the color of the answer lines that are incorrect
var lineIncorrectColor = 'red';


function Line(x1, y1, x2, y2) {
    this.x1 = x1;
    this.y1 = y1;
    this.x2 = x2;
    this.y2 = y2;
    this.type = "solid";
    this.color = "default"
}

//function to compare two lines, based on x and y coordinates only
function compareLines(line1, line2){
    if ((line1.x1 == line2.x1) && (line1.y1 == line2.y1) && (line1.x2 == line2.x2) && (line1.y2 == line2.y2)){
        return true;
    }
    else{
        return false;
    }
}

//reverse x and y coordinates of a Line object
function reverseLine(line){
    
    var tempX = line.x1;
    var tempY = line.y1;
    line.x1 = line.x2;
    line.y1 = line.y2;
    line.x2 = tempX;
    line.y2 = tempY;
    
    return line;
}

//ISOMETRIC LINE FUNCTIONS

//function to draw all line objects in an array
function drawLines(canvasObject, lineArray) {
    //now clear the canvas by running drawDots and draw each Line object in the lines array
    drawDots(canvasObject);
    var curCtx = document.getElementById(canvasObject.canvasId).getContext("2d");
    for(var i = 0; i < lineArray.length; i++){
        //drawALine(canvasObject.ctx, lineArray[i]);
        drawALine(curCtx, lineArray[i]);
    }
    //have to make sure any canvas text is drawn too
    drawText(canvasObject);
    //have to make sure any canvas axes are drawn too
    drawAxes(canvasObject);
    //have to make sure any canvas trails are drawn too
    drawTrails(canvasObject);
}


//function to draw a line between 2 points based on a line object
function drawALine(ctx, line) { 
    //check whether drawing dashed lines
    if (line.type == "dashed"){
        ctx.setLineDash([dashLineWidth, dashSpaceWidth]);
    }
    else{
        ctx.setLineDash([]);
    }
    
    ctx.beginPath();
    ctx.moveTo(findTrueXCoord(line.x1), findTrueYCoord(line.y1));
    ctx.lineWidth = lineWidth;
    ctx.lineTo(findTrueXCoord(line.x2), findTrueYCoord(line.y2));
    if (line.color == "correct"){
        ctx.strokeStyle = lineCorrectColor;
    }
    else if (line.color == "incorrect"){
        ctx.strokeStyle = lineIncorrectColor;
    }
    else {
        ctx.strokeStyle = lineColor;
    }
    ctx.stroke();
}

//function to undo the last line drawn
function undoLine(canvasObject) {
    if (canvasObject.linesCurrentlyDrawn.length > 0){
        //remove the last item from the lines currently drawn, but add an undo line to linesAllDrawn to keep a record of the event
        canvasObject.linesAllDrawn.push(canvasObject.linesCurrentlyDrawn.pop()); 
        canvasObject.linesAllDrawn[canvasObject.linesAllDrawn.length - 1].type = "undo";
        
        drawLines(canvasObject, canvasObject.linesCurrentlyDrawn);
        //ensure any touch points become unselected
        canvasObject.tempLine.pop();
    }
}

//function to clear the canvas
function clearLines(canvasObject) {
    drawDots(canvasObject);

    //clear any touch points
    canvasObject.tempLine.pop();
    
    //remove all lines from the lines currently drawn, but add them to linesAllDrawn to keep a record of the lines cleared
    for (var i = 0; i < canvasObject.linesCurrentlyDrawn; i++){
        canvasObject.linesAllDrawn.push(canvasObject.linesCurrentlyDrawn[i]);
        canvasObject.linesAllDrawn[canvasObject.linesAllDrawn.length - 1].type = "clear";
    }
    canvasObject.linesCurrentlyDrawn.length = 0;
}

//function to break up all the lines in the line array and return array with all smaller lines
function breakUpAllLines(lineArray){
    //create an array to hold smaller lines which make up the Line objects in the lineArray
    var brokenUpLineArray = [];
    //every line will be ordered from left to right (low x to high x)
    //any vertical line will be ordered from top to bottom (low y to high y)
    for(var i = 0; i < lineArray.length; i++){
        //create a copy of the Line object at lineArray[i] so as not to alter the original drawing
        var lineCopy = new Line(lineArray[i].x1, lineArray[i].y1, lineArray[i].x2, lineArray[i].y2);
        lineCopy.type = lineArray[i].type;
        
        //order left to right if necessary
        if (lineCopy.x1 > lineCopy.x2){
            lineCopy = reverseLine(lineCopy);
        }
        
        //order top to bottom if necessary
        if ((lineCopy.x1 == lineCopy.x2) && (lineCopy.y1 > lineCopy.y2)){
            lineCopy = reverseLine(lineCopy);
        }
        //pass the lineCopy to see if it needs broken up and place the lines returned into the BrokenUpLineArray - we have to check for any duplicate lines first
        var tempArray = breakUpLine(lineCopy);
        //only need to check for duplicates if brokenUpLineArray is not empty
        if (brokenUpLineArray.length > 0){
            for (var j = 0; j < tempArray.length; j++) {
                var found = false;
                var k = 0;
                while(!found && (k < brokenUpLineArray.length)) {
                    found = compareLines(tempArray[j], brokenUpLineArray[k]);
                    k++;
                }
                //if tempArray Line not found, add to brokenUpLineArray
                if (!found){
                    brokenUpLineArray.push(tempArray[j]);
                }
            }
        }
        else {
            brokenUpLineArray.push.apply(brokenUpLineArray, tempArray);
        }
        //brokenUpLineArray.push.apply(brokenUpLineArray, breakUpLine(lineCopy));
    }
    return brokenUpLineArray;
}


//take in a larger line and break it up into smaller lines
function breakUpLine(line){
    
    var smallerLines = [];
    var xDiff = line.x2 - line.x1;
    var yDiff = line.y2 - line.y1;
    
    //Check to see if line is horizontal or vertical first
    //if a line is vertical, x will always be the same value
    //if the difference between y2 and y1 is greater than 2, the line is made up of many smaller lines
    if (line.x1 == line.x2){
        if ((line.y2 - line.y1) > 2) {
            for(var i = 0; i < ((line.y2 - line.y1) / 2); i++){
                smallerLines[i] = new Line(line.x1, (line.y1 + (2 * i)), line.x1, (line.y1 + (2 * i) + 2));
                smallerLines[i].type = line.type;
            }
        }
        else {
            smallerLines[0] = line;
            smallerLines[0].type = line.type;
        }
        return smallerLines;
    }
    //if a line is horizontal, y will always be the same value
    //if the difference between x2 and x1 is greater than 2, the line is made up of many smaller lines
    if (line.y1 == line.y2){
        if ((line.x2 - line.x1) > 2) {
            for(var i = 0; i < ((line.x2 - line.x1) / 2); i++){
                smallerLines[i] = new Line((line.x1 + (2 * i)), line.y1, (line.x1 + (2 * i) + 2), line.y1);
                smallerLines[i].type = line.type;
            }
        }
        else {
            smallerLines[0] = line;
            smallerLines[0].type = line.type;
        }
        return smallerLines;
    }
    //Diagonals
    
    //work out the gradient based upon whether xdiff or ydiff is higher
    //y can be negative so use the absolute value for testing
    var gradient;
    //Check to see whether the diagonal line doesn't need breaking up and return it if this is the case
    if(xDiff == 1 && Math.abs(yDiff) == 1){
        smallerLines[0] = line;
        smallerLines[0].type = line.type;
    }
    //x grows at the same rate as y
    else if (xDiff == Math.abs(yDiff)){
        //diagonal that slopes downwards
        if(yDiff > 0){
            for (var i = 0; i < xDiff; i++ ){
                smallerLines[i] = new Line((line.x1 + i), (line.y1 + i), (line.x1 + i + 1), (line.y1 + i + 1));
                smallerLines[i].type = line.type;
            }
        }
        //diagonal that slopes upwards
        else if(yDiff < 0){
            for (var i = 0; i < xDiff; i++ ){
                smallerLines[i] = new Line((line.x1 + i), (line.y1 - i), (line.x1 + i + 1), (line.y1 - i - 1));
                smallerLines[i].type = line.type;
            }
        }
    }
    //x grows faster than y
    else if (xDiff > Math.abs(yDiff)){
        gradient = ((line.x2 - line.x1)/(line.y2 - line.y1))
        //if gradient is a whole number then the line will cut across other dots and therefore need to be broken into smaller lines
        if (gradient % 1 === 0){
            
            if( gradient > 0){
                for (var i = 0; i < (xDiff / gradient); i++ ){
                    smallerLines[i] = new Line((line.x1 + (i * gradient)), (line.y1 + i), (line.x1 + (i * gradient) + gradient), (line.y1 + i + 1)); 
                    smallerLines[i].type = line.type;
                }
            }
            //if gradient is negative then diagonal goes up to the right
            else if( gradient < 0){
                for (var i = 0; i < (xDiff / Math.abs(gradient)); i++ ){
                    smallerLines[i] = new Line((line.x1 + (i * Math.abs(gradient))), (line.y1 - i), (line.x1 + (i * Math.abs(gradient)) + Math.abs(gradient)), (line.y1 - i - 1));
                    smallerLines[i].type = line.type;
                }
            }
        }
        //else if gradient is not a whole number
        else {
            smallerLines[0] = line;
            smallerLines[0].type = line.type;
        }  
    }
    // y grows faster than x
    else if (xDiff < Math.abs(yDiff)){
        gradient = ((line.y2 - line.y1)/(line.x2 - line.x1))
        //if gradient is a whole number then the line will cut across other dots and therefore need to be broken into smaller lines
        if (gradient % 1 === 0){
            
            if( gradient > 0){
                for (var i = 0; i < (yDiff / gradient); i++ ){
                    smallerLines[i] = new Line((line.x1 + i), (line.y1 + (i * gradient)), (line.x1 + i + 1), (line.y1 + (i * gradient) + gradient)); 
                    smallerLines[i].type = line.type;
                }
            }
            //if gradient is negative then diagonal goes up to the right
            else if( gradient < 0){
                for (var i = 0; i < (Math.abs(yDiff / gradient)); i++ ){
                    smallerLines[i] = new Line((line.x1 + i), (line.y1 - (i * Math.abs(gradient))), (line.x1 + i + 1), (line.y1 - (i * Math.abs(gradient)) - Math.abs(gradient)));
                    smallerLines[i].type = line.type;
                }
            }
        }
        //else if gradient is not a whole number
        else {
            smallerLines[0] = line;
            smallerLines[0].type = line.type;
        }        
    }
    else {
        // smallerLines.add(line);
    }
    
    return smallerLines; 
}

//ORTHOGRAPHIC LINE FUNCTIONS

//function to draw all line objects in an array
function drawLinesOrth(canvasObject, lineArray) {
    //now clear the canvas by running drawDotsOrth and draw each Line object in the lines array
    drawDotsOrth(canvasObject);
    var curCtx = document.getElementById(canvasObject.canvasId).getContext("2d");
    for(var i = 0; i < lineArray.length; i++){
        drawALineOrth(curCtx, lineArray[i]);
    }
}

//function to draw a line between 2 points based on a line object
function drawALineOrth(ctx, line) { 
    //check whether drawing dashed lines
    if (line.type == "dashed"){
        ctx.setLineDash([dashLineWidth, dashSpaceWidth]);
    }
    else{
        ctx.setLineDash([]);
    }
    
    ctx.beginPath();
    ctx.moveTo(findTrueXCoordOrth(line.x1), findTrueYCoordOrth(line.y1));
    ctx.lineWidth = lineWidth;
    ctx.lineTo(findTrueXCoordOrth(line.x2), findTrueYCoordOrth(line.y2));
    if (line.color == "correct"){
        ctx.strokeStyle = lineCorrectColor;
    }
    else if (line.color == "incorrect"){
        ctx.strokeStyle = lineIncorrectColor;
    }
    else {
        ctx.strokeStyle = lineColor;
    }
    ctx.stroke();
}

//function to undo the last line drawn
function undoLineOrth(canvasObject) {
    if (canvasObject.linesCurrentlyDrawn.length > 0){
        //remove the last item from the lines currently drawn, but add an undo line to linesAllDrawn to keep a record of the event
        canvasObject.linesAllDrawn.push(canvasObject.linesCurrentlyDrawn.pop()); 
        canvasObject.linesAllDrawn[canvasObject.linesAllDrawn.length - 1].type = "undo";
        
        drawLinesOrth(canvasObject, canvasObject.linesCurrentlyDrawn);
        //ensure any touch points become unselected
        canvasObject.tempLine.pop();
    }
}

//function to clear the canvas
function clearLinesOrth(canvasObject) {
    drawDotsOrth(canvasObject);

    //clear any touch points
    canvasObject.tempLine.pop();
    //remove all lines from the lines currently drawn, but add them to linesAllDrawn to keep a record of the lines cleared
    for (var i = 0; i < canvasObject.linesCurrentlyDrawn; i++){
        canvasObject.linesAllDrawn.push(canvasObject.linesCurrentlyDrawn[i]);
        canvasObject.linesAllDrawn[canvasObject.linesAllDrawn.length - 1].type = "clear";
    }
    canvasObject.linesCurrentlyDrawn.length = 0;
}

//function to break up all the lines in the line array and return array with all smaller lines
function breakUpAllLinesOrth(lineArray){

    //create an array to hold smaller lines which make up the Line objects in the lineArray
    var brokenUpLineArray = [];
    //every line will be ordered from left to right (low x to high x)
    //any vertical line will be ordered from top to bottom (low y to high y)
    
    for(var i = 0; i < lineArray.length; i++){
        //create a copy of the Line object at lineArray[i] so as not to alter the original drawing
        var lineCopy = new Line(lineArray[i].x1, lineArray[i].y1, lineArray[i].x2, lineArray[i].y2);
        lineCopy.type = lineArray[i].type;
        
        
        //order left to right if necessary
        if (lineCopy.x1 > lineCopy.x2){
            lineCopy = reverseLine(lineCopy);
        }
        
        //order top to bottom if necessary
        if ((lineCopy.x1 == lineCopy.x2) && (lineCopy.y1 > lineCopy.y2)){
            lineCopy = reverseLine(lineCopy);
        }
        //pass the lineCopy to see if it needs broken up and place the lines returned into the BrokenUpLineArray - we have to check for any duplicate lines first
        var tempArray = breakUpLineOrth(lineCopy);
        //only need to check for duplicates if brokenUpLineArray is not empty
        if (brokenUpLineArray.length > 0){
            for (var j = 0; j < tempArray.length; j++) {
                var found = false;
                var k = 0;
                while(!found && (k < brokenUpLineArray.length)) {
                    found = compareLines(tempArray[j], brokenUpLineArray[k]);
                    k++;
                }
                //if tempArray Line not found, add to brokenUpLineArray
                if (!found){
                    brokenUpLineArray.push(tempArray[j]);
                }
            }
        }
        else {
            brokenUpLineArray.push.apply(brokenUpLineArray, tempArray);
        }
        //brokenUpLineArray.push.apply(brokenUpLineArray, breakUpLine(lineCopy));
    }
    
    return brokenUpLineArray;
}

//take in a larger line and break it up into smaller lines
function breakUpLineOrth(line){
    
    var smallerLines = [];
    
    var xDiff = line.x2 - line.x1;
    var yDiff = line.y2 - line.y1;
    
    //Check to see if line is horizontal or vertical first
    //if a line is vertical, x will always be the same value
    //if the difference between y2 and y1 is greater than 1, the line is made up of many smaller lines
    if (line.x1 == line.x2){
        if ((line.y2 - line.y1) > 1) {
            for(var i = 0; i < (line.y2 - line.y1); i++){
                smallerLines[i] = new Line(line.x1, (line.y1 + i), line.x1, (line.y1 + i + 1));
                smallerLines[i].type = line.type;
            }
        }
        else {
            smallerLines[0] = line;
            smallerLines[0].type = line.type;
        }
        return smallerLines;
    }
    //if a line is horizontal, y will always be the same value
    //if the difference between x2 and x1 is greater than 1, the line is made up of many smaller lines
    if (line.y1 == line.y2){
        if ((line.x2 - line.x1) > 1) {
            for(var i = 0; i < (line.x2 - line.x1); i++){
                smallerLines[i] = new Line((line.x1 + i), line.y1, (line.x1 + i + 1), line.y1);
                smallerLines[i].type = line.type;
            }
        }
        else {
            smallerLines[0] = line;
            smallerLines[0].type = line.type;
        }
        return smallerLines;
    }
    
    //Diagonals
    
    //work out the gradient based upon whether xdiff or ydiff is higher
    //y can be negative so use the absolute value for testing
    var gradient;
    
    //Check to see whether the diagonal line doesn't need breaking up and return it if this is the case
    if(xDiff == 1 && Math.abs(yDiff) == 1){
        smallerLines[0] = line;
        smallerLines[0].type = line.type;
    }
    
    
    
    //x grows at the same rate as y
    else if (xDiff == Math.abs(yDiff)){
        //diagonal that slopes downwards
        if(yDiff > 0){
            for (var i = 0; i < xDiff; i++ ){
                smallerLines[i] = new Line((line.x1 + i), (line.y1 + i), (line.x1 + i + 1), (line.y1 + i + 1));
                smallerLines[i].type = line.type;
            }
        }
        else if(yDiff < 0){
            //diagonal that slopes upwards
            for (var i = 0; i < xDiff; i++ ){
                smallerLines[i] = new Line((line.x1 + i), (line.y1 - i), (line.x1 + i + 1), (line.y1 - i - 1));
                smallerLines[i].type = line.type;
            }
        }
    }
    //x grows faster than y
    else if (xDiff > Math.abs(yDiff)){
        gradient = ((line.x2 - line.x1)/(line.y2 - line.y1))
        //if gradient is a whole number then the line will cut across other dots and therefore need to be broken into smaller lines
        if (gradient % 1 === 0){
            
            if( gradient > 0){
                for (var i = 0; i < (xDiff / gradient); i++ ){
                    smallerLines[i] = new Line((line.x1 + (i * gradient)), (line.y1 + i), (line.x1 + (i * gradient) + gradient), (line.y1 + i + 1)); 
                    smallerLines[i].type = line.type;
                }
            }
            //if gradient is negative then diagonal goes up to the right
            else if( gradient < 0){
                for (var i = 0; i < (xDiff / Math.abs(gradient)); i++ ){
                    smallerLines[i] = new Line((line.x1 + (i * Math.abs(gradient))), (line.y1 - i), (line.x1 + (i * Math.abs(gradient)) + Math.abs(gradient)), (line.y1 - i - 1)); 
                    smallerLines[i].type = line.type;
                }
            }
        }
        //else if gradient is not a whole number
        else {
            smallerLines[0] = line;
            smallerLines[0].type = line.type;
        }
    
        
    }
    // y grows faster than x
    else if (xDiff < Math.abs(yDiff)){
        gradient = ((line.y2 - line.y1)/(line.x2 - line.x1))
        //if gradient is a whole number then the line will cut across other dots and therefore need to be broken into smaller lines
        if (gradient % 1 === 0){
            
            if( gradient > 0){
                for (var i = 0; i < (yDiff / gradient); i++ ){
                    smallerLines[i] = new Line((line.x1 + i), (line.y1 + (i * gradient)), (line.x1 + i + 1), (line.y1 + (i * gradient) + gradient)); 
                    smallerLines[i].typed = line.typed;
                }
            }
            //if gradient is negative then diagonal goes up to the right
            else if( gradient < 0){
                for (var i = 0; i < (Math.abs(yDiff / gradient)); i++ ){
                    smallerLines[i] = new Line((line.x1 + i), (line.y1 - (i * Math.abs(gradient))), (line.x1 + i + 1), (line.y1 - (i * Math.abs(gradient)) - Math.abs(gradient))); 
                    smallerLines[i].typed = line.typed;
                }
            }
        }
        //else if gradient is not a whole number
        else {
            smallerLines[0] = line;
            smallerLines[0].type = line.type;
        }
    
    }
    
    else {
        // smallerLines.add(line);
    }
    
    return smallerLines;
}


