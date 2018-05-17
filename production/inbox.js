(function(){

    firebase.database().ref('currentEdit').once('value', currentEditObj=>{
        firebase.database().ref('doctors').orderByChild('email').equalTo(currentEditObj.val().doctor).on('child_added', snapshot=>{
            firebase.database().ref('currentEdit').update({
                speciality:snapshot.val().speciality
            });
        });
    });


    const cardContent = document.getElementById('cardContent');
    // firebase.database().ref('currentEdit').once('value', currentEditObj=>{    
        firebase.database().ref('currentEdit').once('value', currentEditObj=>{
            
            firebase.database().ref('cards').orderByChild('patient').equalTo(currentEditObj.val().patient).once('child_added', card=>{
                firebase.database().ref('cards/' + card.key).orderByChild('time').on('child_added', cardItem=>{
                    if(cardItem.val().time){
                        if(cardItem.val().doctor.includes(currentEditObj.val().doctor)){
                                                        
                            var cardItemValue = cardItem.val();

                            var divHeader = document.createElement('div');
                            divHeader.style.cssFloat = 'left';
                            cardContent.appendChild(divHeader);
                            
                            var h4 = document.createElement('h4');
                            h4.innerHTML = cardItemValue.doctorName;
                            divHeader.appendChild(h4);

                            divHeader.style.cssFloat = 'left';
                            cardContent.appendChild(divHeader);
                            
                        
                            var divTime = document.createElement('div');
                            divTime.className = 'text-right';
                            var date = new Date(cardItemValue.time);
                            divTime.innerHTML = date.getDay() + '/' + date.getMonth() + '/' + date.getFullYear();
                            cardContent.appendChild(divTime);
                            
                            var clearDiv = document.createElement('div');
                            clearDiv.className = 'clearfix';
                            cardContent.appendChild(clearDiv);
                            
                            var diagnosisDiv = document.createElement('div');
                            diagnosisDiv.innerHTML = cardItemValue.diagnosis;
                            cardContent.appendChild(diagnosisDiv);

                            cardContent.appendChild(document.createElement('br'));
                        }          
                    }else{
                        console.log('skip patient email');
                    }
                })
            }); 
        });
    // })

    // Write to cards
    var editor = document.getElementById('editor');
    var sendBtn = document.getElementById('send');
    sendBtn.addEventListener('click', e=>{ 
        // Get patient email
        console.log('send button is clicked');
        firebase.database().ref('currentEdit').once('value', currentEditObj=>{
            var item = currentEditObj.val();
            console.log('curent object is retrieved');
            console.log(item);
            // Go throug cards 
            firebase.database().ref('cards').orderByChild('patient').equalTo(currentEditObj.val().patient).once('child_added', card=>{ 
                    firebase.database().ref('cards/' + card.key + '/' + new Date().getTime()).set({
                            doctor:item.doctor,
                            diagnosis:editor.innerHTML,
                            doctorName:firebase.auth().currentUser.displayName,
                            author:item.doctor,
                            type:item.speciality,
                            time:new Date().getTime()
                });
                editor.innerHTML = "";
            });


        });        
    });     
}());