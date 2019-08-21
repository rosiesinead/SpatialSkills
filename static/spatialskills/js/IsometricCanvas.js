function isometricCanvas(){
    this.name = "isometric";
    this.distBetweenDots = 32; //a default value just now but could possibly be changed here without affecting rest of code. This offers the potential to adjust it based on user device or even user preference without altering rest of code. This distance is the vertical distance between dots with same x position, and the distance between dots diagonally between x coordinates for isometric paper.
    //the position of the first dot in top left hand corner fixed
    this.firstDotXPos = distBetweenDots / 2;
    this.firstDotYPos  = firstDotXPos; 
    this.yDistBetweenDots = distBetweenDots / 2; //this is halfway between a dot and the dot immediately above and below
    //the xDistance between the dots on the isometric grid can be worked out by creating a right angled triangle e.g. a line from the first dot that goes halfway to the dot directly below (yDistBetweenDots), then a line from there (the hypotenuse which is distBetweenDots) to the dot directly to the right of the first, and then a line from there back to the first dot to complete the triangle. Using Pythagoras' Theorem we can work out the distance between the first dot and the dot immediately to the right of the first dot (the length of the side of the triangle).
    this.xDistBetweenDots = Math.round(Math.sqrt((distBetweenDots*distBetweenDots)-(yDistBetweenDots*yDistBetweenDots))); 
    //max canvas width and height
    this.canvasWidth = 600;
    this.canvasHeight = 600;
    this.numOfColumns = Math.floor(((canvasWidth - firstDotXPos) / xDistBetweenDots)) + 1;  
    this.numOfRows = Math.floor(((canvasHeight - firstDotYPos) / yDistBetweenDots)) + 1; 
}

