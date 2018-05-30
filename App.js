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
             <td class="plan">${asist.plan}</td>
           </tr>
          `;

  $('#asistencia tbody').prepend(row);
	row = "";
  cnt++
});

function addAsist(uid) {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth();
  var day = date.getDate();
  var hour = date.getHours();
  var minute = date.getMinutes();

  clientes.child(uid).once("value", snap => {
    var plan = snap.val().plan -1;
    var nombre = snap.val().nombre;
    var apellido = snap.val().apellido;

    var asist = {
      nombre,
      apellido,
      plan,
      year,
      month,
      day,
      hour,
      minute
    };

    clientes.child(uid).update({plan: plan});
    asistencia.push().set(asist, error => {
      if (error) {
        console.log(error, 'La sincronizacion fallo');
      }
    });
  }, error => {
    console.log("The read failed: " + error.code);
  });
}
