//////////////ISOMETRIC GRID VARIABLES////////////////////////


//ROSIE NOTE: THESE SHOULD BE ATTRIBUTES OF AN ISOMETRIC CANVAS OBJECT

var distBetweenDots = 32; //a default value just now but could possibly be changed here without affecting rest of code. This offers the potential to adjust it based on user device or even user preference without altering rest of code. This distance is the vertical distance between dots with same x position, and the distance between dots diagonally between x coordinates for isometric paper.

//the position of the first dot in top left hand corner fixed
var firstDotXPos = distBetweenDots / 2;
var firstDotYPos  = firstDotXPos; 

 //this is halfway between a dot and the dot immediately above and below
function getyDistBetweenDots(){
    var yDistBetweenDots = distBetweenDots / 2;

    return yDistBetweenDots
} 

var yDistBetweenDots = getyDistBetweenDots();

//the xDistance between the dots on the isometric grid can be worked out by creating a right angled triangle e.g. a line from the first dot that goes halfway to the dot directly below (yDistBetweenDots), then a line from there (the hypotenuse which is distBetweenDots) to the dot directly to the right of the first, and then a line from there back to the first dot to complete the triangle. Using Pythagoras' Theorem we can work out the distance between the first dot and the dot immediately to the right of the first dot (the length of the side of the triangle).
function getxDistBetweenDots(){
    var xDistBetweenDots = Math.round(lengthOfSide(distBetweenDots, yDistBetweenDots)); 

    return xDistBetweenDots
} 

var xDistBetweenDots = getxDistBetweenDots();

 
//work out how many dots there are on the isometric canvas in terms of rows and columns
//var canvas = document.getElementById("isometricEx6"); 
//max canvas width and height
var canvasWidth = 600;
var canvasHeight = 600;
var numOfColumns = Math.floor(((canvasWidth - firstDotXPos) / xDistBetweenDots)) + 1;  
var numOfRows = Math.floor(((canvasHeight - firstDotYPos) / yDistBetweenDots)) + 1;

////DOT PROPERTIES/////////////////
var dotWidth = 2;
//set the lineTouchCircleWidth
var lineTouchCircleWidth = 4;
var backgroundColor = 'white';
//set the colour of the grid dots
var dotColor = 'black';
//set the color of the circle to indicate a touch has occurred
var lineTouchColor = 'orange';


///////////ISOMETRIC GRID HELPER FUNCTIONS//////////////////////////////

//function to work out the length of one side of a triangle
function lengthOfSide(hypotenuse, side) {
    //hypotenuse squared = side1 squared + side2 squared
    var side2 = Math.sqrt(((hypotenuse * hypotenuse) - (side * side)));
    return side2;
}

//Function to obtain the length of the hypotenuse
function lengthOfHypotenuse(side1, side2){
    
    //hypotenuse squared = side1 squared + side2 squared
    var hypotenuse = Math.sqrt((side1 * side1) + (side2 * side2));
    return hypotenuse;
}

//////FINDING GRID COORDINATES/////

//This function will make use of other functions to determine the closest coord (i.e. closest dot) based on the touch coordinates x and y.
function findClosestCoord(x, y){
    //find the x grid coordinate
    var xCoord = findXCoord(x);
        
    //If the value returned by findXCoord(x) is a whole number, then the closest dot will be based on y coordinate only. This is because the x Distance to another point can never be smaller than the y distance to another point.
    //Is x a whole number?
    if(xCoord % 1 === 0){
        //find the yCoord 
        yCoord = findYCoord(y);
        //if x is even then the closest y coord must be even
        if(xCoord == 0 || xCoord % 2 == 0){
            //check to see if yCoord is whole even number
            //////MIGHT NOT NEED THIS BIT AS if it is exact, math.round and math.floor in the else statements will work it out anyway but you would still need a check to prevent divide by 0
            if (yCoord == 0 || yCoord % 2 == 0){
                return [xCoord, yCoord];
            }
            //round to the nearest even number
            else {
                yCoord = 2 * Math.round(yCoord / 2);
                return [xCoord, yCoord];
            } 
            
        }
        //if x is odd the the y coord must be odd
        else if (xCoord % 2 != 0) {
            //check to see if yCoord is whole odd number
            if ((yCoord + 1) % 2 == 0){
                return [xCoord, yCoord];
            }
            //round to the nearest odd number
            else {
                yCoord = 2 * Math.floor(yCoord / 2) + 1;
                //test
                return [xCoord, yCoord];
            }    
        }
    }
    
    //Now we need some logic to deal with x when it is not a whole number
    //we would like to find out which numbers the xCoord is between
    else {
        var xCoordLeft = Math.floor(xCoord);
        var yCoord = findYCoord(y);
        var closestLeftDotY;
        var closestRightDotY
        //If the whole x value on the left of xCoord is even...
        if (xCoordLeft == 0 || xCoordLeft % 2 == 0){
            // need a separate check for y == 0
            //Find the closest dot on the left based on y
            closestLeftDotY = 2 * Math.round(yCoord / 2);  
            //find the closest dot on the right
            closestRightDotY = 2 * Math.floor(yCoord / 2) + 1;
        }
        //else if the whole x value on the left is odd...
        else {
            //find closest dot on the left
            closestRightDotY = 2 * Math.round(yCoord / 2);  
            //find the closest dot on the right
            closestLeftDotY = 2 * Math.floor(yCoord / 2) + 1;
            
        }
        //find the actual lengths from these dots to the touch point
        var lengthFromLeftDotX = x - (findTrueXCoord(xCoordLeft));
        var lengthFromLeftDotY = y - (findTrueYCoord(closestLeftDotY)); //negative won't matter
        var lengthFromRightDotX = (findTrueXCoord(xCoordLeft + 1)) - x;
        var lengthFromRightDotY = y - (findTrueYCoord(closestRightDotY)); //negative won't matter
            
        //find out the distance to the points which will be the hypotenuse of a triangle
        var lengthFromLeftDiagonal = lengthOfHypotenuse(lengthFromLeftDotX, lengthFromLeftDotY);
        var lengthFromRightDiagonal = lengthOfHypotenuse(lengthFromRightDotX, lengthFromRightDotY);
            
        //if distance from left is shorter then the dot on the left is closest
        if (lengthFromLeftDiagonal < lengthFromRightDiagonal){
            return [xCoordLeft, closestLeftDotY];
        }
        //otherwise the dot on the right is closest
        else {
            return [xCoordLeft + 1, closestRightDotY];
        }
    }
}

//function to find and return the x grid coordinate on the isometric grid system based on the actual x coordinate given
function findXCoord(x){
    var xCoord;
    var xAdjustment = x - firstDotXPos;
    
    //if x touch coord is equal to or less than firstDotXPos x coord is 0
    if(xAdjustment <= 0){
        xCoord = 0;
    }
    //else if x coord is equal to or greater than last column x coord is the last column
    else if(xAdjustment / xDistBetweenDots >= (numOfColumns - 1) ){
        xCoord = numOfColumns -1;
    }
    //else work out the value for the x coord based on the touch coord given
    else {
        xCoord = xAdjustment / xDistBetweenDots;
    }
        
    //return the xCoord value
    return xCoord;
}

//function to find and return the y grid coordinate on the isometric grid system based on the actual y coordinate given
function findYCoord(y){
    var yCoord;
    var yAdjustment = y - firstDotYPos;
    
    //if y touch coord is equal to or less than firstDotYPos y coord is 0
    if(yAdjustment <= 0){
        yCoord = 0;
    }
    //else if y coord is equal to or greater than last row y coord is the last row
    else if(yAdjustment / yDistBetweenDots >= (numOfRows - 1) ){
        yCoord = numOfRows -1;
    }
    //else work out the value for the y coord based on the touch coord given
    else {
        yCoord = yAdjustment / yDistBetweenDots;
    }
        
    //return the xCoord value
    return yCoord;
}

//find the actual x coordinate based upon the grid x coordinate
function findTrueXCoord(x){
    var xCoord = firstDotXPos + (x * xDistBetweenDots);
    return xCoord;
}

//find the actual y coordinate based upon the grid y coordinate
function findTrueYCoord(y){
    var yCoord = firstDotYPos + (y * yDistBetweenDots);
    return yCoord;
} 



/////////////ISOMETRIC CANVAS DRAWING FUNCTIONS//////////////////////

//function to draw the Isometric dots, which clears the canvas first
function drawDots(canvasObject) {
    clearCanvas(canvasObject);
    
    //loop through the number of dot rows on the isometric grid
    for (var i = 0; i < numOfRows; i++) {
        var start = 1;
        //if i is even, j will be even, else if i is odd, j will be odd
        if (i == 0 || ((i % 2) == 0)) {
            start = 0;
        }
        //loop through dots in row i, increment j in steps of 2
        for (j = start; j < numOfColumns; (j+=2)) {
            drawACircle(canvasObject, firstDotXPos + (j * xDistBetweenDots), firstDotYPos + (i * yDistBetweenDots), dotWidth, dotColor); 
        }
    }
}

function clearCanvas(canvasObject) {
    var curCanvas = document.getElementById(canvasObject.canvasId);
    var curCtx = curCanvas.getContext("2d");
    curCtx.clearRect(0, 0, canvasWidth, canvasHeight);
}

//function to add touch to grid and possibly drawing a new line
function addPoint(x, y, canvasObject) {
    var dotCoordinateArray = findClosestCoord(x, y);
    var adjustedCoordinateX = findTrueXCoord(dotCoordinateArray[0]);
    var adjustedCoordinateY = findTrueYCoord(dotCoordinateArray[1]);    
    
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
            var brokenTempLine = breakUpAllLines(canvasObject.tempLine)

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





function clear(canvasObject){
    clearLines(canvasObject);
    clearAxes(canvasObject);
    clearTrails(canvasObject);
    clearText(canvasObject);

}





////////////////ADDITIONAL ISOMETRIC FUNCTIONS//////////////////////











