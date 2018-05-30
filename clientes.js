const planes = db.child('planes')

$(function () {
  planes.on('value', snapshot => {
    let snap = snapshot.val()

    for(p in snap) {
      $('#planList').append(`<option value=${snap[p].duracion}>${snap[p].descripcion}</option>`)
    }

    $('select').material_select()
  })
})

function clearForm() {
  $('#formCliente').trigger('reset');
}

function getValuesForm() {
  var plan = parseInt($('#planList').val());
  var nombre = $('#nombre').val();
  var apellido = $('#apellido').val();
  var identificacion = parseInt($('#identificacion').val());
  var email = $('#email').val();
  var telefono = $('#telefono').val();
  var profesion = $('#profesion').val();
  var direccion = $('#direccion').val();
  var birthday = $('#birthday').val();

  var values = {
    plan,
    nombre,
    apellido,
    identificacion,
    email,
    telefono,
    profesion,
    direccion,
    birthday
  };

  return values;
}

function foco(variable) {
  $(variable).focus()
}

var guardarCliente = function() {
  var mensaje = $(document.createElement('div')).addClass("card-panel red white-text");
  var cliente = getValuesForm();
  var expr = /^[a-zA-Z0-9_\.\-]+@[a-zA-Z0-9\-]+\.[a-zA-Z0-9\-\.]+$/;
  var exprNombre = /^[a-zA-Z\s]*$/;
  var expresion = /^3[\d]{9}$/;

  if (isNaN(cliente.plan) == true || cliente.plan == ''){
    $(mensaje).append("<strong>¡Error!</strong> Por favor, selecciona un plan").delay(1000).fadeOut();
    $("#planList").after(mensaje);
    foco($('#planList'))
  } else if (cliente.nombre.length < 2 || cliente.nombre.length > 20 || !exprNombre.test(cliente.nombre)) {
    $(mensaje).append("<strong>¡Error!</strong> Por favor, coloca los nombres aqui").delay(1000).fadeOut();
    $("#nombre").after(mensaje);
    foco($('#nombre'))
  } else if (cliente.apellido.length < 2 || !exprNombre.test(cliente.apellido)) {
    $(mensaje).append("<strong>¡Error!</strong> Por favor, coloca los apellidos aqui").delay(1000).fadeOut();
    $("#apellido").after(mensaje);
    foco($('#apellido'))
  } else if (isNaN(cliente.identificacion) == true || cliente.identificacion == '' || cliente.identificacion.length > 8){
    $(mensaje).append("<strong>¡Error!</strong> Por favor, coloca un numero de identificaion correcto").delay(1000).fadeOut();
    $("#identificacion").after(mensaje);
    foco($('#identificacion'))
  } else if (!expr.test(cliente.email)){
    $(mensaje).append("<strong>¡Error!</strong> Por favor, coloca una direccion de correo correcta").delay(1000).fadeOut();
    $("#email").after(mensaje);
    foco($('#email'))
  } else if (isNaN(cliente.telefono) == true || cliente.telefono == ''){
    $(mensaje).append("<strong>¡Error!</strong> Por favor, coloca un numero de telefono correcto").delay(1000).fadeOut();
    $("#telefono").after(mensaje);
    foco($('#telefono'))
  } else if (cliente.profesion.length < 2 || cliente.profesion.length > 20 || !exprNombre.test(cliente.profesion)){
    $(mensaje).append("<strong>¡Error!</strong> Por favor, coloca una profesion correcta").delay(1000).fadeOut();
    $("#profesion").after(mensaje);
    foco($('#profesion'))
  } else if (cliente.direccion.length < 5 || cliente.direccion.length > 20){
    $(mensaje).append("<strong>¡Error!</strong> Por favor, coloca una direccion correcta").delay(1000).fadeOut();
    $("#direccion").after(mensaje);
    foco($('#direccion'))
  } else if (cliente.birthday == ""){
    $(mensaje).append("<strong>¡Error!</strong> Por favor, coloca una fecha").delay(1000).fadeOut();
    $("#birthday").after(mensaje);
    foco($('#birthday'))
  } else {
    clientes.push().set(cliente, error => {
      if (error) {
        console.log(error, 'La sincronizacion fallo');
      } else {
        $('#modalCliente').modal('close');
        clearForm();
      }
    });
  }
}

 $('#cancelarCliente').click(() => {
   $('#modalCliente').modal('close');
   clearForm();
 });

 $('#btnCliente').click(guardarCliente);

 clientes.on('value', snapshot => {
   var snap = snapshot.val();
   $('#clientes tbody').empty();
   var row = "";

   for (cliente in snap) {
     row += `
             <tr data-hash='${cliente}'>
               <td class="nombre">${snap[cliente].nombre}</td>
               <td class="apellido">${snap[cliente].apellido}</td>
               <td class="identificacion">${snap[cliente].identificacion}</td>
               <td class="email">${snap[cliente].email}</td>
               <td class="telefono">${snap[cliente].telefono}</td>
               <td class="profesion">${snap[cliente].profesion}</td>
               <td class="direccion">${snap[cliente].direccion}</td>
               <td class="plan">${snap[cliente].plan}</td>
               <td>
                 <a class="btn-flat waves-effect modal-trigger" href="#modalCliente" id="editarCliente"><i class="material-icons orange-text">mode_edit</i></a>
                 <a class="btn-flat waves-effect" id="eliminarCliente"><i class="material-icons red-text">delete</i></a>
                 <a class="btn-flat waves-effect" id="nfc"><i class="material-icons blue-text">nfc</i></a>
               </td>
             </tr>
            `;
   }


   $('#clientes tbody').append(row);
   row = "";
 })

 function editarCliente() {
   var clienteId = $(this).closest('tr').data('hash');
   var clienteRef = clientes.child(clienteId);
   console.log(clienteId);

   clienteRef.once('value')
   .then(function (data) {
     var clienteData = data.val();

     $(".titulo-modal").text("Editar Cliente");
     $("#btnCliente").text('Editar').unbind('click').click(function () {
       clienteRef.update({
         plan: clienteData.plan,
         nombre: $("#nombre").val(),
         apellido: $("#apellido").val(),
         identificacion: $("#identificacion").val(),
         email: $("#email").val(),
         telefono: $("#telefono").val(),
         profesion: $("#profesion").val(),
         direccion: $("#direccion").val(),
         birthday: $("#birthday").val()
       }, function () {
         $('#modalCliente').modal('close');
         $(".titulo-modal").text("Agregar Cliente");
         $("#btnCliente").text('Guardar').unbind('click').click(guardarCliente);
         clearForm();
       })
     });

     $("#cancelarCliente").unbind('click').click(function () {
       $('#modalCliente').modal('close');
       $(".titulo-modal").text("Agregar Cliente");
       $("#btnCliente").text('Guardar').unbind('click').click(guardarCliente);
       clearForm();
     });

     // $("#planList").val(clienteData.plan);
     $("#nombre").val(clienteData.nombre);
     $("#apellido").val(clienteData.apellido);
     $("#identificacion").val(clienteData.identificacion);
     $("#email").val(clienteData.email);
     $("#telefono").val(clienteData.telefono);
     $("#profesion").val(clienteData.profesion);
     $("#direccion").val(clienteData.direccion);
     $("#birthday").val(clienteData.birthday);
     $('#modalCliente').modal('open');

   }, function (error) {
     console.log(error);
   })
 }

 function eliminarCliente() {
   var clienteId = $(this).closest('tr').data('hash');
   // var row = $(this).parents('tr');
   console.log(clienteId);
   var txt;
   var r = confirm("Eliminar?");
   if (r == true) {
       txt = "You pressed OK!";
       clientes.child(clienteId).remove();
       // row.remove();
   } else {
       txt = "You pressed Cancel!";
   }
   console.log(txt);
 }

 function guardarNFC() {
   let clienteId = $(this).closest('tr').data('hash')
   console.log('added: ' + clienteId)
   ipcRenderer.send('guardarNFC', clienteId)
 }

 var table = $('table tbody');
 table.on('click', 'a#editarCliente', editarCliente);
 table.on('click', 'a#eliminarCliente', eliminarCliente);
 table.on('click', 'a#nfc', guardarNFC);

var search = function() {
 // Declare variables
 var input, filter, table, tr, td, i;
 input = document.getElementById("search");
 filter = input.value.toUpperCase();
 table = document.getElementById("clientes");
 tr = table.getElementsByTagName("tr");
 // Loop through all table rows, and hide those who don't match the search query
 for (i = 0; i < tr.length; i++) {
   td = tr[i].getElementsByTagName("td")[1];
   if (td) {
     if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
       tr[i].style.display = "";
     } else {
       tr[i].style.display = "none";
     }
   }
 }
}
