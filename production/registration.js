(function(){

    const auth = getAuth();
    const db = getDb();
    var currentLocation = 0;

    var menu2 = document.getElementById('menu2');
    var specialityList = document.getElementById('specialityList');
    addItemToList(menu2, specialityList, 'General');
    addItemToList(menu2, specialityList, 'Psychology');
    addItemToList(menu2, specialityList, 'Ophthalmology');
    addItemToList(menu2, specialityList, 'Cardiology');

    var menu1 = document.getElementById('menu1');
    var clinicsList = document.getElementById('clinicsList');
    addItemToList(menu1, clinicsList, 'Red Health');
    addItemToList(menu1, clinicsList, 'Oxygen medical');
    addItemToList(menu1, clinicsList, 'Nurmed');
    addItemToList(menu1, clinicsList, 'Salom Med');

    var signUpBtn = document.getElementById('signUpBtn');
    signUpBtn.addEventListener('click', e =>{
      var div = document.getElementById('errorMessageDiv');
      var p = document.getElementById('errorMessagePar');

      var firstName = document.getElementById('firstname');
      if(firstName.value == ''){
          onError(div,p,'Firstname field is empty');
          return;
      }
      var lastname = document.getElementById('lastname');
      if(lastname.value == ''){
          onError(div,p,'Lastname field is empty');
          return;
      }
      var specialityMenu = document.getElementById('menu2');     
      var speciality = specialityMenu.innerHTML;      
      if(speciality.includes('Speciality')){
          onError(div,p,'Plase select your speciality');
          return;
      } 
      var clinicMenu = document.getElementById('menu1');      
      var clinic = clinicMenu.innerHTML;
      if(clinic.includes('Clinics')){
          onError(div,p,'Plase select your clinic');
          return;
      } 
      var email = document.getElementById('email');
      var password = document.getElementById('password');

      const promise = auth.createUserWithEmailAndPassword(email.value,password.value);
      console.log(clinic + ' ' + speciality);
      promise.then(function(snapshot){
          db.ref('doctors/' + getTimeStamp()).set({
              firstname:firstName.value,
              lastname:lastname.value,
              speciality:speciality,
              clinic:clinic,
              email:email.value,                          
          });

          window.location.href = "patients.html"                  
      },function(error){
          onError(div,p,error.message);
      })
    }); 

    var signInBtn = document.getElementById('signInBtn');
    signInBtn.addEventListener('click', e=>{
      const email = document.getElementById('emailLogin');
      const password = document.getElementById('passwordLogin');
            
      const promise = auth.signInWithEmailAndPassword(email.value,password.value);
      promise.then(user =>{
          console.log(user);
          console.log(user.email);
          window.location.href = "patients.html"                  
      }).catch(e =>{
          onError(document.getElementById('errorMessageDivLogin'), document.getElementById('errorMessageParLogin'),e.message);                  
      });              
    });

}());

function addItemToList(menu,list, value){
    var li = document.createElement('li');
    var a = document.createElement('a');
    a.innerHTML = value;
    a.addEventListener('click', e=>{
        var span = document.createElement('span');
        span.className = 'caret';
        menu.innerHTML = value;
        // menu.appendChild(span);     
    });
    li.appendChild(a);    
    list.appendChild(li);    
}

function getTimeStamp(){
    return new Date().getTime();
}

function onError(div,p,e){
    console.log('onError');
    div.style.display = 'block';
    p.innerHTML = e;
}