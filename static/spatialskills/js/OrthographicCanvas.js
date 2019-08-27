function orthographicCanvas(){
    this.name = "orthographic";
    //Orthographic distances defined separately as there may be a need to have different canvas sizes depending on context
    this.distBetweenDots = 25; //this will be the distance between dots in both the x and y axis
    //the position of the first dot in top left hand corner fixed
    this.firstDotXPos = distBetweenDots / 2;
    this.firstDotYPos = firstDotXPos;
    //max canvas width and height
    this.canvasWidth = 600;
    this.canvasHeight = 600;
    this.numOfColumns = Math.floor(((canvasWidth - firstDotXPos) / distBetweenDots)) + 1;  
    this.numOfRows = Math.floor(((canvasHeight - firstDotYPos) / distBetweenDots)) + 1; 

}