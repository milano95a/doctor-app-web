(function(){
    var signOutBtn = document.getElementById('signOutBtn');
    signOutBtn.addEventListener('click', e=>{
        console.log('sign out is clicked');
        firebase.auth().signOut();  
        window.location.href = "index.html"    
    });
}());