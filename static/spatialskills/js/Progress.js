function displayProgress(){

                    var received;
                    $.ajax({
                        async: false, //seems like this is necessary in order to use the received variable outside the scope
                        url: "/getprogress",
                        type: 'GET',
                        dataType: 'json',
                        success: function(res) {
                            received = JSON.parse(res)
                            //console.log(received)
                            //alert(res);
                        }
                    });
                    
                    //NOTE: this is not technically accurate as not all canvases may have been correct but does it matter?
                    //infact should it count as correct if only part of the solution is correct?? I think no
                    
                    //loop through database data and update the matching exercise.question.answercanvas with correct or not
                    for (var l = 0; l < received.length; l++){
                        var k =0
                        var current = received[l]
                        exercises[current.exercise_number-1].questions[current.question_number-1].answerCanvas[k].correct=current.complete
                        k++
                    }
                   
                
                //loop through the exercises
                for (var i = 0; i < exercises.length; i++){
                        var numOfQs = document.getElementById("tdQuestions" + exercises[i].name);
                        var attemptedQs = document.getElementById("tdAttempted" + exercises[i].name);
                        var correctQs = document.getElementById("tdCorrect" + exercises[i].name);
                    
                    //count the number of questions
                    numOfQs.innerHTML = exercises[i].questions.length;
                    
                    //loop through database data and count the number of questions attempted & number correct
                    var attemptedNumber = 0;
                    var correctNumber = 0;
                    for (var j = 0; j < received.length; j++){
                        if(received[j].exercise_number == (i+1)){
                            attemptedNumber += received[j].attempted;
                            correctNumber += received[j].complete
                        }

                                          
                  
                    }

                    

                    //update table with exercise information
                    attemptedQs.innerHTML = attemptedNumber;
                    correctQs.innerHTML = correctNumber;
                }
}