//function used before home page loads
//loops through all Questions in all Exercises and tallies up attempted and correct Questions

//ROSIE NOTE: i think this will need to get existing table data and add to it, 
//not overwrite it, in order to save progress

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
                            }
                            //if attempted and completely correct, add numbers to totals
                            if (attempted == true){
                                attemptedNumber++;
                            }
                            if (correct == true){
                                correctNumber++;
                            }
                            //create statistic and add to array
                            statistics.push(new Statistic(6,(i+1),(j+1),Number(attempted),Number(correct)))
                        }
                        //update table with exercise information
                        attemptedQs.innerHTML = attemptedNumber;
                        correctQs.innerHTML = correctNumber;
                    }

                    var saveStats = $.ajax({
                        type: "POST",
                        url: "/userstats",
                        data: {statistics:statistics},
                        dataType: "json",
                        success: function(resultData){
                            alert("Save Complete");
                        }
                  });
                    
                });