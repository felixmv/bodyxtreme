function clearForm() {
  $('#formPlan').trigger('reset');
}

function getValuesForm() {
  var descripcion = $('#descripcion').val();
  var precio = $('#precio').val();
  var duracion = parseInt($('#duracion').val());

  var values = {
    descripcion,
    precio,
    duracion
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
            <tr data-hash='${plan}'>
              <td class="descripcion">${snap[plan].descripcion}</td>
              <td class="precio">$${snap[plan].precio}</td>
              <td>
                <a class="btn-flat waves-effect modal-trigger" href="#modalPlan" id="editarPlan"><i class="material-icons orange-text">mode_edit</i></a>
                <a class="btn-flat waves-effect" id="eliminarPlan"><i class="material-icons red-text">delete</i></a>
              </td>
            </tr>
           `;
  }

  $('#planes tbody').append(row);
  row = "";
});

function eliminarPlan() {
  var planId = $(this).closest('tr').data('hash');
  console.log(planId);
  var txt;
  var r = confirm("Eliminar?");
  if (r == true) {
      txt = "You pressed OK!";
      planes.child(planId).remove();
  } else {
      txt = "You pressed Cancel!";
  }
  console.log(txt);
}

function editarPlan() {
  var planId = $(this).closest('tr').data('hash');
  var planRef = planes.child(planId);
  console.log(planId);

  planRef.once('value')
  .then(function (data) {
    var planData = data.val();

    $(".titulo-modal").text("Editar Plan");
    $("#btnPlan").text('Editar').unbind('click').click(function () {
      planRef.update({
        descripcion: $("#descripcion").val(),
        duracion: $("#duracion").val(),
        precio: $("#precio").val()
      }, function () {
        $('#modalPlan').modal('close');
        $(".titulo-modal").text("Agregar Cliente");
        $("#btnPlan").text('Guardar').unbind('click').click(guardarPlan);
        clearForm();
      })
    });

    $("#cancelarPlan").unbind('click').click(function () {
      $('#modalPlan').modal('close');
      $(".titulo-modal").text("Agregar Plan");
      $("#btnPlan").text('Guardar').unbind('click').click(guardarPlan);
      clearForm();
    });

    $("#descripcion").val(planData.descripcion)
    $("#duracion").val(planData.duracion)
    $("#precio").val(planData.precio)
    $('#modalPlan').modal('open');

  }, function (error) {
    console.log(error);
  })
}

var table = $('table tbody');
table.on('click', 'a#editarPlan', editarPlan);
table.on('click', 'a#eliminarPlan', eliminarPlan);
