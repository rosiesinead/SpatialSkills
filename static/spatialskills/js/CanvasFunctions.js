//find the actual x coordinate based upon the grid x coordinate
function findTrueXCoord(canvasType,x){
    var xCoord = firstDotXPos + (x * canvasType.xDistBetweenDots);
    return xCoord;
}

//find the actual y coordinate based upon the grid y coordinate
function findTrueYCoord(canvasType, y){
    var yCoord = canvasType.firstDotYPos + (y * canvasType.yDistBetweenDots);
    return yCoord;
} 

//function to add touch to grid and possibly drawing a new line
function addPoint(x, y, canvasObject) {
    canvasType = canvasObject.type

    if(canvasType.name=="isometric"){
        var dotCoordinateArray = findClosestCoord(x, y);
    }
    else if (canvasType.name=="orthographic"){
        var dotCoordinateArray = findClosestCoordOrth(x, y);

    }
    
    var adjustedCoordinateX = canvasType.findTrueXCoord(dotCoordinateArray[0]);
    var adjustedCoordinateY = canvasType.findTrueYCoord(dotCoordinateArray[1]);    
    
    //if empty then this is the first touch point, otherwise it is the second touch point
    if(canvasObject.tempLine.length == 0){
        //below we used to add a new line to lines, but let's create a temp line instead so we can do some checks e.g. make sure there are 2 points, and make sure they are different
        canvasObject.tempLine[0] = new Line(dotCoordinateArray[0], dotCoordinateArray[1], 0, 0);
        //we want to set the dashed property to true if the corresponding button is pressed
       
        //draw a circle on the isometric dot that the touch is closest to
        drawACircle(canvasObject, adjustedCoordinateX, adjustedCoordinateY, lineTouchCircleWidth, lineTouchColor);
    }
    else {
        //let's check that second point is different from the first
        if((canvasObject.tempLine[0].x1 == dotCoordinateArray[0]) && (canvasObject.tempLine[0].y1 == dotCoordinateArray[1])){
            //the two points are the same so cancel the point selection by removing the Line
            canvasObject.tempLine.pop();
            drawLines(canvasObject, canvasObject.linesCurrentlyDrawn); //this will redraw the linesCurrentlyDrawn without the orange touch point
        }
        else {
            //the points are different so add the second touch point x and y values to tempLine
            canvasObject.tempLine[0].x2 = dotCoordinateArray[0];
            canvasObject.tempLine[0].y2 = dotCoordinateArray[1];
            if (canvasObject.dashed == true){
                canvasObject.tempLine[0].type = "dashed";
            }
            //if there are any lines currently drawn,loop through linesCurrentlyDrawn and check if any match the templine, if yes then remove
            //break up the templine and check each piece separately
            var lineExists = false;
            var brokenTempLine = breakUpAllLines(canvasType,canvasObject.tempLine)

            if(canvasObject.linesCurrentlyDrawn.length>0){
                for(var i=0;i<brokenTempLine.length;i++){
                    for(var j=0;j<canvasObject.linesCurrentlyDrawn.length;j++){
                            var temp = JSON.stringify(brokenTempLine[i]);
                            var reverseTemp = JSON.stringify(reverseLine(brokenTempLine[i]));
                            var line = JSON.stringify(canvasObject.linesCurrentlyDrawn[j]);                
                            if(line == temp || line == reverseTemp){
                                canvasObject.linesCurrentlyDrawn.splice(j,1)
                                lineExists = true;
                            }
 
                    } 
                }          

            }
            if(!lineExists){
                for(var i=0;i<brokenTempLine.length;i++){
                    //add tempLine to the currently drawn lines array
                    canvasObject.linesCurrentlyDrawn.push(brokenTempLine[i]);
                    //add the new line to All Lines drawn as well
                    canvasObject.linesAllDrawn.push(canvasObject.tempLine[0]);

                }

            }
            
            //let's add a new line into tempLine, using the x2 and y2 coordinates as the x1 and y1 of the new temp line
            canvasObject.tempLine[0] = new Line(dotCoordinateArray[0], dotCoordinateArray[1], 0, 0);
            drawLines(canvasObject, canvasObject.linesCurrentlyDrawn);
            //draw a circle on the isometric dot that the touch is closest to
            drawACircle(canvasObject, adjustedCoordinateX, adjustedCoordinateY, lineTouchCircleWidth, lineTouchColor);
        }
    }
}

//function to draw a circle on a canvas
function drawACircle(canvasObject, x, y, radius, color){
    var curCtx = document.getElementById(canvasObject.canvasId).getContext("2d");
        curCtx.beginPath();
        curCtx.arc(x, y, radius, 0, 2 * Math.PI, false);
        curCtx.fillStyle = color;                              
        curCtx.fill();  
}

//function to draw all line objects in an array
function drawLines(canvasObject, lineArray) {
    //now clear the canvas by running drawDots and draw each Line object in the lines array
    drawDots(canvasObject);
    var curCtx = document.getElementById(canvasObject.canvasId).getContext("2d");
    for(var i = 0; i < lineArray.length; i++){
        //drawALine(canvasObject.ctx, lineArray[i]);
        drawALine(curCtx, lineArray[i]);
    }

    if(canvasObject.type.name=="isometric"){
        //have to make sure any canvas text is drawn too
        drawText(canvasObject);
        //have to make sure any canvas axes are drawn too
        drawAxes(canvasObject);
        //have to make sure any canvas trails are drawn too
        drawTrails(canvasObject);
    }
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

function clearCanvas(canvasObject) {
    canvasType = canvasObject.type
    var curCanvas = document.getElementById(canvasObject.canvasId);
    var curCtx = curCanvas.getContext("2d");
    curCtx.clearRect(0, 0, canvasType.canvasWidth, canvasType.canvasHeight);
}

//function to clear canvas described by canvasObject
function clearCanvasOrth(canvasObject) {
    var curCtx = document.getElementById(canvasObject.canvasId).getContext("2d");
    curCtx.fillStyle = backgroundColor;
    curCtx.fillRect(0, 0, canvasOrthWidth, canvasOrthHeight);
    curCtx.fill();
}

//function to break up all the lines in the line array and return array with all smaller lines
function breakUpAllLines(canvasType,lineArray){
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
        if(canvasType.name=="isometric"){
            //pass the lineCopy to see if it needs broken up and place the lines returned into the BrokenUpLineArray - we have to check for any duplicate lines first
            var tempArray = breakUpLine(lineCopy);
        }
        else if (canvasType.name=="orthographic"){
            //pass the lineCopy to see if it needs broken up and place the lines returned into the BrokenUpLineArray - we have to check for any duplicate lines first
            var tempArray = breakUpLineOrth(lineCopy);
        }

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

