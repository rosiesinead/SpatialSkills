/////////////////ORTHOGRAPHIC GRID ANSWER FUNCTIONS/////////////////////////////

//function to create answer from an array of values, rather than line objects
function createAnswerFromArrayOrth(canvasObject, inputArray) {
    for (var i = 0; i < inputArray.length; i++){
        //fill the correctAnswer with the correct values from the inputArray
        canvasObject.correctAnswer.push(new Line(inputArray[i][0], inputArray[i][1], inputArray[i][2], inputArray[i][3])); 
        //set type of line to solid, dashed, undo, clear
        canvasObject.correctAnswer[canvasObject.correctAnswer.length-1].type = inputArray[i][4];
    }
}

//function to check current drawing matches answer
function checkAnswerOrth(canvasObject, answerId){
    //first you have to create an attempt from the current lines array which can be compared with the coorect answer
    canvasObject.attempts.push(breakUpAllLinesOrth(canvasObject.linesCurrentlyDrawn));
    var correctAnswer = breakUpAllLinesOrth(canvasObject.correctAnswer);
    var correctLines = 0;
    var incorrectLines = 0;
    var incorrectDashedLines = false;
    
    //find bottom left x,y point of correct answer and the attempt
    var bottomLeftAttempt = findBottomLeftPointOrth(canvasObject.attempts[canvasObject.attempts.length - 1]);
    var bottomLeftCorrectAnswer = findBottomLeftPointOrth(correctAnswer);
    
    //find the x difference and y difference between the two shapes
    var xDiff = bottomLeftAttempt[0] - bottomLeftCorrectAnswer[0];
    var yDiff = bottomLeftAttempt[1] - bottomLeftCorrectAnswer[1];
    
    //loop through every line in currentAttempt
    for (var i = 0; i < canvasObject.attempts[canvasObject.attempts.length - 1].length; i++){
        //loop through every line in correctAnswerLines and compare currentAttempt[i] with correctAnswer[i]
        var found = false;
        var j = 0;
        //adjust current attempt based on how far it is assumed it is offset from correct answer based on the leftmost bottom point
        var adjustedLine = new Line((canvasObject.attempts[canvasObject.attempts.length - 1][i].x1 - xDiff), (canvasObject.attempts[canvasObject.attempts.length - 1][i].y1 - yDiff), (canvasObject.attempts[canvasObject.attempts.length - 1][i].x2 - xDiff), (canvasObject.attempts[canvasObject.attempts.length - 1][i].y2 - yDiff));
        //make sure adjusted line is also solid or dashed as appropriate
        adjustedLine.type = canvasObject.attempts[canvasObject.attempts.length - 1][i].type;
        while(!found && (j < correctAnswer.length)) {
            found = compareLines(adjustedLine, correctAnswer[j]);
            j++;
        }
        if(found == true){
            canvasObject.attempts[canvasObject.attempts.length - 1][i].color = "correct";
            correctLines++;
            
            if (adjustedLine.type != correctAnswer[j-1].type){
                incorrectDashedLines = true;
            }
        }
        else {
            canvasObject.attempts[canvasObject.attempts.length - 1][i].color = "incorrect";
            incorrectLines++;
        }
    }
    drawLinesOrth(canvasObject, canvasObject.attempts[canvasObject.attempts.length - 1]);
    canvasObject.tempLine.pop(); //more user friendly to remove any touch points
    //check if all correct lines have been drawn
    var answer = document.getElementById(answerId);
    if (correctLines == correctAnswer.length && incorrectLines == 0 && incorrectDashedLines == false){
        answer.innerHTML = correctMessage;
        //mark the answer canvas as being correct
        canvasObject.correct = true;
    }
    else if (correctLines == correctAnswer.length && incorrectLines == 0 && incorrectDashedLines == true){
        answer.innerHTML = almostCorrectMessage;
    }
    else if (incorrectLines > 0) {
        answer.innerHTML = incorrectRemoveRedMessage;
    }
    else if (correctLines < correctAnswer.length){
         answer.innerHTML = incorrectAddMoreMessage;
    }
    writeToDatabase(canvasObject)
}

//function to find the bottom left point of a shape
function findBottomLeftPointOrth(lineArray){
    
    //bottom left is the point with lowest x (if tied then it is also the point with the highest y)
    var bottomLeftX = 999; 
    var bottomLeftY = -1;
    
    for (var i = 0; i < lineArray.length; i++){
        //if x1 of line is less than current bottomLeftX
        if(lineArray[i].x1 < bottomLeftX){
            bottomLeftX = lineArray[i].x1;
            
            //vertical lines where x1 and x2 are the same
            if(lineArray[i].x1 == lineArray[i].x2){
                //if the line is vertical, x1 will be the leftmost position and y2 will be the bottom y position as vertical lines have been arranged top to bottom
                bottomLeftY = lineArray[i].y2;
            }
            //diagonal or horizontal
            else{
            //if the line is a diagonal or horizontal, x1 will be leftmost x position of the line as all diagonals and horizontals have been rearranged left to right
            //if the line is a diagonal, y1 will be the leftmost y position associated with the line as all diagonals have been rearranged left to right
            bottomLeftY = lineArray[i].y1;
            }
        }
        //If x1 of line is equal to bottomLeft
        else if((lineArray[i].x1 == bottomLeftX)){
            //vertical
            if(lineArray[i].x1 == lineArray[i].x2){
            //remember that vertical lines have been ordered from top to bottom so lowest point on canvas (which actually means a higher y value) is actually y2
                if(lineArray[i].y2 > bottomLeftY){
                    bottomLeftY = lineArray[i].y2;
                }
            }
            //diagonal or horizontal
             else {
            //remember that diagonals and horizontals are arranged from left to right so y1 corresponds to the leftmost x point
                if(lineArray[i].y1 > bottomLeftY) {
                    bottomLeftY = lineArray[i].y1;
                }
            }
        }
    }
    return [bottomLeftX, bottomLeftY];
}


