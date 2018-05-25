function clearForm() {
  $('#descripcion').val('');
  $('#precio').val('');
  $('#duracion').val('');
}

function getValuesForm() {
  var descripcion = $('#descripcion').val();
  var precio = parseInt($('#precio').val());
  var duracion = parseInt($('#duracion').val());

  var values = {
    descripcion: descripcion,
    precio: precio,
    duracion: duracion
  };

  return values;
}

const planes = db.child('planes');

var guardarPlan = function() {
  var plan = getValuesForm();

  planes.push().set(plan, error => {
    if (error) {
      console.log(error, 'La sincronizacion fallo');
    } else {
      $('#modalPlan').modal('close');
      clearForm();
      console.log(error, 'La sincronizacion ha sido exitosa');
    }
  });
}

$('#cancelarPlan').click(() => {
  $('#modalPlan').modal('close');
  clearForm();
});

$('#btnPlan').click(guardarPlan);

planes.on('value', snapshot => {
  var snap = snapshot.val();
  $('#planes tbody').empty();

  var row = "";

  for (plan in snap) {
    row += `
            <tr id='${plan}'>
              <td class="descripcion">${snap[plan].descripcion}</td>
              <td class="precio">${snap[plan].precio}</td>
              <td class="duracion">${snap[plan].duracion}</td>

              <td>
                <a class="btn-flat waves-effect modal-trigger" href="#modalPlan" id="editarPlan"><i class="material-icons orange-text">mode_edit</i></a>
                <a class="btn-flat waves-effect" id="eliminarPlan"><i class="material-icons red-text">delete</i></a>
              </td>
            </tr>
           `;
  }

  $('#planes tbody').append(row);
  row = "";

  $('#editarPlan').click(() => {
    var planId = $(this).closest("tr").attr("id");
    console.log(planId);
   //  $("#plan").val($('#' + clienteId).find(".plan").text());
   //  $("#nombre").val($('#' + clienteId).find(".nombre").text());
   //  $("#apellido").val($('#' + clienteId).find(".apellido").text());
   //  $("#identificacion").val($('#' + clienteId).find(".identificacion").text());
   //  $("#email").val($('#' + clienteId).find(".email").text());
   //  $("#telefono").val($('#' + clienteId).find(".telefono").text());
   //  $("#profesion").val($('#' + clienteId).find(".profesion").text());
   //  $("#direccion").val($('#' + clienteId).find(".direccion").text());
   //  $("#birthday").val($('#' + clienteId).find(".birthday").text());
   //
   // $('#btnCliente').text("Editar").unbind("click").click(() => {
   //   var data = getValuesForm();
   //   clientes.child(clienteId).update(data, () => {
   //     $('#modalCliente').modal('close');
   //     $('#btnCliente').text("Guardar").unbind("click").click(guardarCliente);
   //     clearForm();
   //   });
   // });
  });

  $('#eliminarPlan').click(() => {
   var planId = $(this).closest("tr").attr("id");
   console.log(planId);
   // db.child(playerId).remove();
 });
});
