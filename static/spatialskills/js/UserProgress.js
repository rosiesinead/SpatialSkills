
function writeToDatabase(canvasObject){

   // console.log(canvasObject)

    var stat;
  
    //loop through the exercises
    loop:
    for (var i = 0; i < exercises.length; i++){
        for (var j = 0; j < exercises[i].questions.length; j++){
            for (var k = 0; k < exercises[i].questions[j].answerCanvas.length; k++){
                var attempted = false;
                var correct = true;
                if(JSON.stringify(exercises[i].questions[j].answerCanvas[k]) == JSON.stringify(canvasObject)){
               // console.log("MATCH")    
                    if (canvasObject.correct != true){
                            correct = false;
                        }
                    if (canvasObject.attempts.length > 0){
                        attempted = true;
                        //create a progress object
                        prog = new ProgressObject('rosie',(i+1),(j+1),(k+1),Number(attempted),Number(correct),JSON.stringify(canvasObject))
                        //send prog to database
                        $.ajax({
                            type: "POST",
                            url: "/writeprogress",
                            data: prog,
                            dataType: "json",
                            success: function(resultData){
                            alert("Save Complete");
                            }
                      });
                                  
                    break loop;     
                    
                    }
                  
                }                                
               
            }
        }
        
    }

   

    
}