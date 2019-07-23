function getExercise2Data(){
    var get = document.getElementById("dbEx2").innerHTML
    var r = get.replace(/'/g,"")
    var exercise2 = JSON.parse(r)
    return exercise2
}
