//function used before home page loads
//loops through all Questions in all Exercises and tallies up attempted and correct Questions

//ROSIE NOTE: i think this will need to get existing table data and add to it, 
//not overwrite it, in order to save progress
//just had a thought though - number have to match up. can't complete more than exists...

$(document).on('pagebeforeshow', '#home', function (){ 

                    var statistics = [];

                    //loop through the exercises
                    for (var i = 0; i < exercises.length; i++){
                        var numOfQs = document.getElementById("tdQuestions" + exercises[i].name);
                        var attemptedQs = document.getElementById("tdAttempted" + exercises[i].name);
                        var correctQs = document.getElementById("tdCorrect" + exercises[i].name);
                        
                        //count the number of questions
                        numOfQs.innerHTML = exercises[i].questions.length;
                        
                        //count the number of questions attempted (i.e. at least one attempt)
                        var attemptedNumber = 0;
                        var correctNumber = 0;
                        for (var j = 0; j < exercises[i].questions.length; j++){
                            var attempted = false;
                            var correct = true;
                            //loop through each answer canvas to see if there are any attempts
                            for (var k = 0; k < exercises[i].questions[j].answerCanvas.length; k++){
                                if (exercises[i].questions[j].answerCanvas[k].attempts.length > 0){
                                    attempted = true;
                                }
                                if (exercises[i].questions[j].answerCanvas[k].correct != true){
                                    correct = false;
                                }

                                 //create a statistic object and add to array
                            statistics.push(new Statistic('rosie',(i+1),(j+1),(k+1),Number(attempted),Number(correct),JSON.stringify(exercises[i].questions[j].answerCanvas[k])))                         
                            
                            }

                           

                            //if attempted and completely correct, add numbers to totals
                            if (correct == true){
                                correctNumber++;
                            }
                            
                            if (attempted == true){
                                attemptedNumber++;
                              
                                
                            }

                            
                            
                            
                        }
                        //update table with exercise information
                        attemptedQs.innerHTML = attemptedNumber;
                        correctQs.innerHTML = correctNumber;
                    }

                    

                    //console.log(statistics)

                    var saveStats = $.ajax({
                        type: "POST",
                        url: "/userstats",
                        data: JSON.stringify(statistics),
                        dataType: "text",
                        success: function(resultData){
                           // alert("Save Complete");
                        }
                  });
                    
                });