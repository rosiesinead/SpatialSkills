function getExercise3Data(){
    var get = document.getElementById("dbEx3").innerHTML
    var r = get.replace(/'/g,"")
    var exercise3 = JSON.parse(r)
    return exercise3
}
