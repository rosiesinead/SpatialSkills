function getExercise4Data(){
    var get = document.getElementById("dbEx4").innerHTML
    var r = get.replace(/'/g,"")
    var exercise4 = JSON.parse(r)
    return exercise4
}
