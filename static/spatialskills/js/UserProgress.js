//CREATED BY ROSIE FOR WRITING USER PROGRESS TO DATABASE

function writeToDatabase(canvasObject){

    //loop through the exercises
    loop:
    for (var i = 0; i < exercises.length; i++){
        for (var j = 0; j < exercises[i].questions.length; j++){
            for (var k = 0; k < exercises[i].questions[j].answerCanvas.length; k++){
                var correct = true;
                if(JSON.stringify(exercises[i].questions[j].answerCanvas[k]) == JSON.stringify(canvasObject)){
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