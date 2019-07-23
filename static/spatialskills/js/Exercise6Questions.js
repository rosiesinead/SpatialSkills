function getExercise6Data(){
    var get = document.getElementById("dbEx6").innerHTML
    var r = get.replace(/'/g,"")
    var exercise6 = JSON.parse(r)
    return exercise6
}
