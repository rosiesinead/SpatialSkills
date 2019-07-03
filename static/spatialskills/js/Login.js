//basic functions to simulate login and logout

function login(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    
    localStorage.setItem('user', username.value);
    
    //set all elements with specific class to "Hello " + username
    var helloMessages = document.getElementsByClassName("hello");
    for (var i = 0; i < helloMessages.length; i++){
        helloMessages[i].innerHTML = "Hello " + localStorage.getItem('user') + "!";
    }

    if ( (username == "rosie" && password == "tester")
    ||(username == "quintin" && password == "cutts")
    ||(username == "jack" && password == "parkinson")) {
    
        //window.location.href ="#home";
        $.mobile.pageContainer.pagecontainer("change", "#home", {transition:"none"});
    }
    else alert ("Login unsuccessful. Try again");
    
}

function logout(){
    var helloMessages = document.getElementsByClassName("hello");
    for (var i = 0; i < helloMessages.length; i++){
        helloMessages[i].innerHTML = "";
    }
    localStorage.removeItem('user');
    //window.location.href = "#login";
    $.mobile.pageContainer.pagecontainer("change", "#login", {transition:"none"});
}
