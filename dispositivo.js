$(function() {
  $('select').material_select()
})

const electron = require('electron')
const {ipcRenderer} = electron

let portList = $('#portList')

ipcRenderer.send('getPorts')

ipcRenderer.on('portList', (e, data) => {
  console.log('ports', data)

  data.forEach(port => {
    // if (port.pnpId != undefined) {
      portList.append(`<option value=${port.comName}>${port.comName}</option>`)
      // portList.append(`<option value=${port.comName}>${port.pnpId}</option>`)
    // }
  })
})

ipcRenderer.on('deviceData', (e, data) => {
  console.log('device data:', data)
})

ipcRenderer.on('error', (e, data) => {
  console.log('error:', data)
})

$('#selectPort').click(() => {
  console.log(portList.val())
  ipcRenderer.send('selectedport', portList.val())
})
