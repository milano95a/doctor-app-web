(function(){

    var tableBody = document.getElementById('tableBody');
    clean(tableBody);
    
    //Get my patients 
    firebase.database().ref('currentEdit').on('child_added', snapshot=>{

        console.log('----------Patients currentEdit----------' + snapshot.val());
        var connectionsDb = firebase.database().ref('connections').orderByChild('doctor').equalTo(snapshot.val());
        connectionsDb.on('child_added', snapshot =>{
            var connection = snapshot.val();
            var id = snapshot.key;
            
            var tr = document.createElement('tr');

            var th = document.createElement('th');
            th.innerHTML = id;
            tr.appendChild(th);

            var tdFulllName = document.createElement('td');
            tdFulllName.innerHTML = connection.pfullname;
            tr.appendChild(tdFulllName);

            var tdMobile = document.createElement('td');
            tdMobile.innerHTML = 'none';
            tr.appendChild(tdMobile);

            var tdEmail = document.createElement('td');
            tdEmail.innerHTML = connection.patient;
            tr.appendChild(tdEmail);

            var tdEdit = document.createElement('td');

            var a = document.createElement('a');
            a.className = 'btn btn-primary';
            a.addEventListener('click', e=>{
                console.log('-----doctor-----' + connection.doctor);

                // firebase.database().ref('doctors').orderByChild('email').equalTo(connection.doctor).on('child_added', snapshot=>{
                    firebase.database().ref('currentEdit').set({
                        doctor:connection.doctor,
                        patient:connection.patient,
                    });
                // });

                window.location.href = 'inbox.html';
            });
            var i = document.createElement('i');
            i.className = 'fa fa-edit';
            a.appendChild(i);
            tdEdit.appendChild(a);
            tr.appendChild(tdEdit);

            tableBody.appendChild(tr);

            console.log(id + connection.patient + connection.pfullname);                        
        });                         
    });

}());

function clean(node){
    while (node.hasChildNodes()) {
        node.removeChild(node.lastChild);
    }
}