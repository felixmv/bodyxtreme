$(function () {
  // Materialize
  $('.button-collapse').sideNav({
    menuWidth: 256
  });

  $('#modalCliente').modal({
    dismissible: false
  });

  $('#modalPlan').modal({
    dismissible: false
  });

  $('#modalEPlan').modal({
    dismissible: false
  })

  $('.datepicker').pickadate({
    selectMonths: true,
    selectYears: 50,
    min: new Date(1970,1,1),
    max: true,
    today: false,
    clear: 'Clear',
    close: 'Ok',
    closeOnSelect: false
  });
});

// Initialize Firebase
var config = {
  apiKey: "AIzaSyBdMoV5eR4i61cWMo_EtiYrlxELaOdfiO0",
  authDomain: "bodyxtreme-b1c33.firebaseapp.com",
  databaseURL: "https://bodyxtreme-b1c33.firebaseio.com",
  projectId: "bodyxtreme-b1c33"
};
firebase.initializeApp(config);

const db = firebase.database().ref();
const clientes = db.child('clientes');
const asistencia = db.child('asistencia');
/*const electron = require('electron')
const {ipcRenderer} = electron

ipcRenderer.on('portList', (e, data) => {
  console.log('ports', data)
})

ipcRenderer.on('deviceData', (e, data) => {
  var uid = data
  addAsist(uid)
})*/

var cnt = 1;
asistencia.on('child_added', snapshot => {
  var asist = snapshot.val();
  var row = "";

  var opts = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: 'numeric',
    minute: 'numeric'
  };

  row += `
           <tr>
             <td>${cnt}</td>
             <td class="nombre">${asist.nombre}</td>
             <td class="apellido">${asist.apellido}</td>
             <td class="fecha">${new Date(asist.year, asist.month, asist.day, asist.hour, asist.minute).toLocaleDateString("es", opts)}</td>
             <td class="plan">${asist.duracionPlan}</td>
           </tr>
          `;

  $('#asistencia tbody').prepend(row);
	row = "";
  cnt++
});

var date = new Date();
var year = date.getFullYear();
var month = date.getMonth();
var day = date.getDate();
var hour = date.getHours();
var minute = date.getMinutes();

function addAsist(uid) {
  clientes.child(uid).once("value", snap => {
    var duracionPlan = snap.val().duracionPlan;
    var nombre = snap.val().nombre;
    var apellido = snap.val().apellido;

    var asist = {
      nombre,
      apellido,
      duracionPlan,
      year,
      month,
      day,
      hour,
      minute
    };

    asistencia.push().set(asist, error => {
      if (error) {
        console.log(error, 'La sincronizacion fallo');
      }
    });
  }, error => {
    console.log("The read failed: " + error.code);
  });
}

var search = function() {
 // Declare variables
 var input, filter, table, tr, td, i;
 input = document.getElementById("search");
 filter = input.value.toUpperCase();
 table = document.getElementById("asistencia");
 tr = table.getElementsByTagName("tr");
 // Loop through all table rows, and hide those who don't match the search query
 for (i = 0; i < tr.length; i++) {
   td = tr[i].getElementsByTagName("td")[3];
   if (td) {
     if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
       tr[i].style.display = "";
     } else {
       tr[i].style.display = "none";
     }
   }
 }
}
const fecha = db.child('fecha')

function discount() {
  let fch
  let clnt

  fecha.once('value', snapshot => {
    fch = snapshot.val()
    if (day > fch.dia || month > fch.mes) {
      clientes.once('value', snapshot => {
        clnt = snapshot.val()

        for (c in clnt) {
          if (clnt[c].duracionPlan > 0) {
            clientes.child(c).update({duracionPlan: clnt[c].duracionPlan - 1})
          }
        }
      })
      fecha.update({mes: month, dia: day})
    }
  })
}

discount()
