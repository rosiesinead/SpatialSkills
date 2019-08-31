//CREATED BY ROSIE FOR WRITING USER PROGRESS TO DATABASE

//loop through the exercises,questions and answer canvases. 
//check if the answer canvas matches the canvasobject passed to find its position in the exercise and question arrays
//if the canvasObject is correct, set correct to true
//if the canvasObject has been attempted, create a progress object and make a post request to send it to the database.

function writeToDatabase(canvasObject){
    loop:
    for (var i = 0; i < exercises.length; i++){
        for (var j = 0; j < exercises[i].questions.length; j++){
            var question = exercises[i].questions[j];
            for (var k = 0; k < question.answerCanvas.length; k++){
                var answerCanvas = question.answerCanvas[k];
                var correct = true;
                if(JSON.stringify(answerCanvas) == JSON.stringify(canvasObject)){
                    if (canvasObject.correct != true){
                            correct = false;
                        }
                    if (canvasObject.attempts.length > 0){
                        //create a progress object
                        prog = new Progress((i+1),(j+1),(k+1),Number(correct),JSON.stringify(canvasObject))
                        //send prog to database
                        $.ajax({
                            type: "POST",
                            url: "/writeprogress",
                            data: prog,
                            dataType: "json",
                            success: function(resultData){
                            }
                      });
                                  
                    break loop;     
                    
                    }
                  
                }                                
               
            }
        }
        
    }

   

    
}