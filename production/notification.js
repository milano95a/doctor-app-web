(function(){
  
  const db = getDb();
  const auth = getAuth();
  
//Check for invitations
    firebase.auth().onAuthStateChanged(user =>{
        if(user){
            console.log(user.email);

            firebase.database().ref('currentEdit').set({
                doctor:user.email,
            });

            console.log('user email: ' + user.email);
            inboxMessages(user.email); 
            if(user.displayName){
                console.log('user has display name');
            }else{
                console.log('user does not have display name');                
                firebase.database().ref('doctors').orderByChild('email').equalTo(user.email).on('child_added', snapshot=>{
                    
                    curUser = snapshot.val();
                    user.updateProfile({
                        displayName:curUser.firstname + ' ' + curUser.lastname,                    
                    }).then(function(){
                        console.log('Profile updated');
                    },function(error){
                        console.log('error while updating progile')
                        console.log(error);
                    });
                });
            }           
        }else{
            console.log('else');
        }
    });

//Invitation
    var notificationBtn = document.getElementById('notificationBtn');
    notificationBtn.addEventListener('click', e=>{
        invitation(firebase.auth().currentUser.email);

        var changeInvitationDb = db.ref('invitations');
        changeInvitationDb.on('child_changed', function(snapshot){
            invitation(firebase.auth().currentUser.email);
        });      
    });
        
    }());

function invitation(userEmail){
  const db = firebase.database();
  var newIvitaionsDb = db.ref('invitations').orderByChild('toAndStatus').equalTo(userEmail + '_new');
  
  var invitationsList = document.getElementById('menu1');  
  clearList(invitationsList);
  
  newIvitaionsDb.on('child_added', snapshot=>{      
      var invitation = snapshot.val();

      var li = document.createElement('li');

      var div1 = document.createElement('div');
      div1.style.cssFloat = 'left';
      li.appendChild(div1);
      
      var img = document.createElement('img');
      img.src = 'images/img.jpg';
      img.width = '55';
      img.height = '55';      
      div1.appendChild(img);

      var div2 = document.createElement('div');
      li.appendChild(div2);
      div2.className = 'message-content';

      var h6 = document.createElement('h6');
      h6.className = 'message-text';
      h6.innerHTML = invitation.sender;      
      div2.appendChild(h6);

      var accept = document.createElement('input');
      accept.type = 'button';
      accept.value = 'Accept';
      accept.className = 'btn btn-success';
      div2.appendChild(accept);
      accept.addEventListener('click', e=>{
          console.log(snapshot.key);
          db.ref('invitations/' + snapshot.key).set({
              from:invitation.from,
              to:invitation.to,
              sender:invitation.sender,
              toAndStatus:invitation.to + '_accepted'
          });

        //   db.ref('connections/' + new Date().getTime()).set({
        //       patient:invitation.from,
        //       me:invitation.to,
        //       pfullname:invitation.sender,                            
        //       st:invitation.from +'_'+ invitation.to,                          
        //   }); 
          db.ref('connections/' + new Date().getTime() +1).set({
              patient:invitation.from,            
              doctor:invitation.to,
              pfullname:invitation.sender,              
              st:invitation.to +'_'+ invitation.from,                          
          });        
      });

      var reject = document.createElement('input');
      reject.type = 'button';
      reject.value = 'Reject';
      reject.className = 'btn btn-danger';
      div2.appendChild(reject);
      reject.addEventListener('click', e=>{
        db.ref('invitations/' + snapshot.key).set({
              from:invitation.from,
              to:invitation.to,
              sender:invitation.sender,
              toAndStatus:invitation.to + '_rejected'
          });
      });

      menu1.appendChild(li);
  });
};

function clearList(ul){
    clearList
    var child = ul.firstChild;
    while(child){
        ul.removeChild(child);
        child = ul.firstChild;
    }   
};

function inboxMessages(user){

    // console.log('inboxMessage is called');        

    document.getElementById('profileName').innerHTML = user;

    var counter = 0;
    numberOfNewMessages = document.getElementById('numberOfNewMessages');
    numberOfNewMessages.innerHTML = counter;

    var newIvitaionsDbAccepted = firebase.database().ref('invitations').orderByChild('toAndStatus').equalTo(user + '_accepted');
    newIvitaionsDbAccepted.on('child_added', function(snapshot){
        counter--;
        if(counter < 0){
            counter = 0;
            numberOfNewMessages.innerHTML = counter;
        }else{
            numberOfNewMessages.innerHTML = counter;
        }
    });
    var newIvitaionsDbAccepted = firebase.database().ref('invitations').orderByChild('toAndStatus').equalTo(user + '_rejected');
    newIvitaionsDbAccepted.on('child_added', function(snapshot){
        counter--;
        if(counter < 0){
            counter = 0;
            numberOfNewMessages.innerHTML = counter;
        }else{
            numberOfNewMessages.innerHTML = counter;
        }
    });

    var newIvitaionsDb = firebase.database().ref('invitations').orderByChild('toAndStatus').equalTo(user + '_new');
    newIvitaionsDb.on('child_added', function(snapshot){
        counter ++;
        numberOfNewMessages.innerHTML = counter;
    });

}