(function(){
    var config = {
        apiKey: "AIzaSyAHUhW2Nw8tVhd3wu2oEW6GaxiCkwBren0",
        authDomain: "doctorappdb.firebaseapp.com",
        databaseURL: "https://doctorappdb.firebaseio.com",
        projectId: "doctorappdb",
        storageBucket: "doctorappdb.appspot.com",
        messagingSenderId: "103948816366"
    };
    
    firebase.initializeApp(config);

}());

var speciality;

function setSpeciality(x){
    this.speciality = x
}

function getSpeciality(){
    return speciality;
}
function getAuth(){
    return firebase.auth();
}

function getDb(){
    return firebase.database();
}
