function getExercise1Data(){
    var get = document.getElementById("dbEx1").innerHTML
    var r = get.replace(/'/g,"")
    var exercise1 = JSON.parse(r)
    return exercise1
}

//DELETE THESE?