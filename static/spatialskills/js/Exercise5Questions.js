function getExercise5Data(){
    var get = document.getElementById("dbEx5").innerHTML
    var r = get.replace(/'/g,"")
    var exercise5 = JSON.parse(r)
    return exercise5
}
