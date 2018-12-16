// Application code starts here. The code is wrapped in a
// function closure to prevent overwriting global objects.
;(function()
{

var mDevice = null;
var mTimer = null;
var uuid = null;
var counter = null;
var counters = null;
var counterd= null;
var bandera = null; // Variable para saber si el estudiante ya se registró.
var studentSubject = null;
var studentName = null;
var studentPlate = null;

var INFO_SERVICE = "0000180a-0000-1000-8000-00805f9b34fb";
var INFO_MANUFACTURER = "00002a29-0000-1000-8000-00805f9b34fb";
var INFO_FIRMWARE = "00002a26-0000-1000-8000-00805f9b34fb";
var INFO_SERIAL = "00002a25-0000-1000-8000-00805f9b34fb";

var BATTERY_SERVICE = "0000180f-0000-1000-8000-00805f9b34fb";
var BATTERY_CHARACTERISTIC = "00002a19-0000-1000-8000-00805f9b34fb";

var WEATHER_SERVICE = "00002010-0000-1000-8000-00805f9b34fb";
var WEATHER_TEMPERATURE = "00002012-0000-1000-8000-00805f9b34fb";

var MODE_SERVICE = "00002040-0000-1000-8000-00805f9b34fb";
var MODE_CHARACTERISTIC = "00002041-0000-1000-8000-00805f9b34fb";

function initialize() {
  var config = {
    apiKey: "AIzaSyDAJ-zEMMVcflMBHfpAQJSqkPoYULy3wi8",
    authDomain: "ayudantiaasist.firebaseapp.com",
    databaseURL: "https://ayudantiaasist.firebaseio.com",
    projectId: "ayudantiaasist",
    storageBucket: "ayudantiaasist.appspot.com",
    messagingSenderId: "101016513217"
  };
  firebase.initializeApp(config);
  document.addEventListener("deviceready", onDeviceReady, false);
}

function showStatus(text) {
  console.log(text);
  document.getElementById("status").innerHTML = text;
}

function showAssistance(text) {
  console.log(text);
  document.getElementById("assistance").innerHTML = text;
}

function showIdentifier(text) {
  console.log(text);
  document.getElementById("uuid").innerHTML = text;
}

function countermas(){
  counter = counter+1;
}

function countersmas(){
  counters = counters + 1;
}

function counterdmas(){
  counterd= counterd +1;
}

function showName(text) {
  console.log(text);
  document.getElementById("name").innerHTML = text;
}
function onDeviceReady() {
  // UI button actions.
  document.getElementById("connectButton")
    .addEventListener("click", onConnectButton, false);
  document.getElementById("disconnectButton")
    .addEventListener("click", disconnect, false);
  
  showStatus("Listo");
}


function onConnectButton() {
  uuid=device.uuid;
  // We must not be connected.
  if (mDevice) return;

  disconnect();

  searchForBondedDevice({
    name: 'HEXIWEAR',
    serviceUUIDs: [INFO_SERVICE],
    onFound: connectToDevice,
    onNotFound: scanForDevice,
    });
}

function disconnect() {
  
  if (mTimer) {
    clearInterval(mTimer);
    mTimer = null;
  }
  if (mDevice) {
    evothings.ble.close(mDevice);
    mDevice = null;
    showAssistance('');
    showName('');
    showIdentifier('');
    showStatus("Desconectado");
    setTimeout(function(){onDeviceReady();}, 3000)
  }
}

function scanForDevice() {
  showStatus("Escanenado...");

  // Start scanning. Two callback functions are specified.
  evothings.ble.startScan(
    onDeviceFound,
    onScanError);

  // This function is called when a device is detected, here
  // we check if we found the device we are looking for.
  function onDeviceFound(device) {
    if (isHexiwear(device)) {

      // Stop scanning.
      evothings.ble.stopScan();

      showStatus('Hexiwear encontrado')
      connectToDevice(device);
    }
    setTimeout(function(){counterdmas();}, 1000)
    if (counterd >30){
      counterd  = 0;
      evothings.ble.stopScan();
      setTimeout(function(){onScanError();}, 2000)
    }
  }

  // Function called when a scan error occurs.
  function onScanError(error) {
    setTimeout(function(){countersmas();}, 2000)
   if (counters < 4)
    {
      setTimeout(
        function() {
          disconnect();
          scanForDevice();
        },
        1000);
    }
    if (counters >=4)
    {
      showStatus('No se encontro dispositivo...');
      counters = 0;
      setTimeout(function(){onDeviceReady();}, 3000)
      
    }
  }

  
}

function verificandoEstudiante()
{
  rootRef = firebase.database().ref("students");

  rootRef.once('value',gotData, errData);
}
  
function gotData(data) {
    var students = data.val();
    var estudiantes = Object.keys(students);
    for(var i = 0; i < estudiantes.length; i++){
      var s = estudiantes[i];
      studentSubject = students[s].studentSubject;
      studentName = students[s].studentName;
      studentPlate = students[s].studentPlate;
      if(uuid == s)
      {
        writeDate(studentSubject,studentPlate);
        i = estudiantes.lenght + 1;
        bandera = 1;
      }
      else{
        bandera = 0;
      }
    }
  }

function errData(err){
  console.log('Error!');
  console.log(err);
}

function writeDate(studentSubject,studentPlate){
  var d = new Date(); // Para la fecha y hora
  var fecha = d.getDate() + "-" + (d.getMonth()+1) + "-" + d.getFullYear();
  var hora = d.getHours() + ":" + d.getMinutes();

  firebase.database().ref('attendance/' + studentPlate + "/" + fecha).set({
      Subject: studentSubject,
      Hour: hora
    });
}

function connectToDevice(device) {
  showStatus('Conectando con el dispositivo...')

  // Save device.
  mDevice = device;

  evothings.ble.connectToDevice(
    device,
    onConnected,
    onDisconnected,
    onConnectError);
    
  function onConnected(device)
  {
    showStatus('Conectado');
    verificandoEstudiante();
    if(!bandera){
      alert("El estudiante no está registrado.");
    }
    else{
      showIdentifier(uuid);
      showAssistance("Tienes asistencia");
      showName(studentName);
    }
    mTimer = setInterval(disconnect, 3000);
    //testIfBonded();
  }

  function onDisconnected(device)
  {
    showAssistance("");
    showName("");
    showStatus('Dispositivo desconectado');
  }

  // Function called when a connect error or disconnect occurs.
  function onConnectError(error)
  {
    showStatus('Error de conexión: ' + error);
    
    setTimeout(function(){countermas();}, 2000)
    // If we get Android connect error 133, we wait and try to connect again.
    // This can resolve connect problems on Android when error 133 is seen.
    // In a production app you may want to have a function for aborting or
    // maximising the number of connect attempts. Note that attempting reconnect
    // does not block the app however, so you can still do other tasks and
    // update the UI of the app.
    // Note: It can work better on Android to do a new scan rather than connect
    // again. Android may report the device as bonded, but fail to connect to it.
    // Scanning for the device initiates a new pairing process, and connect works.
    if (133 == error  && counter < 4)
    {
      showStatus('Reconectando...');
      setTimeout(
        function() {
          disconnect();
          scanForDevice();
        },
        1000);
    }
    if (counter < 4)
    {
      showStatus('Reconectando...');
      setTimeout(
        function() {
          disconnect();
          connectToDevice();
        },
        1000);
    }
    if (counter >=4)
    {
      showStatus('Demasiados intentos, vuelva a intentar en un minuto... connect')
      counter = 0;
      disconnect();
    }
  }

  function testIfBonded()
  {
    // Read encrypted characteristic to test if device is bonded.
    // This will fail if not bonded.
    var service = evothings.ble.getService(mDevice, WEATHER_SERVICE);
    var characteristic = evothings.ble.getCharacteristic(service, WEATHER_TEMPERATURE);
    evothings.ble.readCharacteristic(
      mDevice,
      characteristic,
      function(data)
      {
        // We are bonded. Continue to read device data.
        startNotifications();
      },
      function(errorCode)
      {
        // Not bonded.
        disconnect();
        showStatus('Dispositivo no emparejado. Conéctate de nuevo.');
      });
  }
}

function isHexiwear(device) {
  //return device.name == "HEXIWEAR";
  return device.advertisementData.kCBAdvDataLocalName == "HEXIWEAR";
}



var mModes = ["Idle", "Watch", "Sensor Tag", "Weather", "Motion Accel", "Motion Gyro", "Pedometer"];



function enableNotification(serviceUUID, characteristicUUID, elementId, converter) {
  var service = evothings.ble.getService(mDevice, serviceUUID);
  var characteristic = evothings.ble.getCharacteristic(service, characteristicUUID);
  evothings.ble.enableNotification(
    mDevice,
    characteristic,
    function(data) {
      handleData(elementId, data, converter);
    },
    function(errorCode) {
      // On iOS we get error on notification fot mode characteristic, it first succeeds,
      // then produces error: "The attribute could not be found."
      console.log("enableNotification error: " + errorCode + " element: " + elementId);
    });
}

function startNotifications() {
  // But first, read static data.
  showStatus("Leyendo datos");
  showAssistance("Tienes asistencia");
  mTimer = setInterval(disconnect, 3000);
}



/**
 * Search for bonded device with a given name.
 * Useful if the address is not known.
 */
function searchForBondedDevice(params)
{
  evothings.ble.getBondedDevices(
    // Success function.
    function(devices)
    {
      for (var i in devices)
      {
        var device = devices[i];
        if (device.name == params.name)
        {
          showStatus('Dispositivo emparejado encontrado: ' + device.name);
          params.onFound(device);
          return; // bonded device found
        }
      }
      params.onNotFound();
    },
    // Error function.
    function(error)
    {
      params.onNotFound();
    },
    { serviceUUIDs: params.serviceUUIDs });
}

initialize();

})(); // End of closure.