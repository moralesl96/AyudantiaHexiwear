;(function()
{   
    var clave = 123456;
    var uuid = null;
    var bandera = 0;
    var bandera2 = 0;
    var sMatricula = null;
    var name = null;
    var group = null;

function initialize() {
    document.getElementById("registrar")
    .addEventListener("click", verificarClave, false);
    var config = {
        apiKey: "AIzaSyDAJ-zEMMVcflMBHfpAQJSqkPoYULy3wi8",
        authDomain: "ayudantiaasist.firebaseapp.com",
        databaseURL: "https://ayudantiaasist.firebaseio.com",
        projectId: "ayudantiaasist",
        storageBucket: "ayudantiaasist.appspot.com",
        messagingSenderId: "101016513217"
      };
      firebase.initializeApp(config);
      writeStudent(1,"Guest","Guest",1);
      showStatus("Ready");
    }

function showIdentifier(text) {
    console.log(text);
    document.getElementById("uuid").innerHTML = text;
  }

function clearData(text) {
    console.log(text);
    document.getElementById("clave").value = text;
    document.getElementById("matricula").value = text;
    document.getElementById("nombre").value = text;
    document.getElementById("grupo").value = text;
}
function showStatus(text) {
    console.log(text);
    document.getElementById("status").innerHTML = text;
  }

  // Funciones para escribir y leer de la base de datos.
  function writeStudent(studentId, name, group, uuid){
    firebase.database().ref('students/' + uuid).set({
        studentPlate: studentId,
        studentName: name,
        studentGroup: group
      });
    clearData("");
  }

//Registro.html
function verificarClave(){
    code = document.getElementById("clave").value;
    sMatricula = document.getElementById("matricula").value;
    name = document.getElementById("nombre").value;
    group = document.getElementById("grupo").value;
    uuid = device.uuid;
    if(name == "" || sMatricula == "" || group == "" )
    {
        alert("Llenar todos los campos.");
    }
    else{
        if(clave == code)
        {
            verificandoEstudiante(); // Funcion para verificar si el uuid ya existe
        }
        else{
            alert("Clave errónea.");
        }
    }
    showIdentifier(uuid);
  }

// Validaciones para el registro de los usuarios
function verificandoEstudiante()
{
    rootRef = firebase.database().ref('students');
    rootRef.once('value', gotData);
}
  
function gotData(data) {
    var students = data.val();
    var estudiantes = Object.keys(students);
    for(var i = 0; i < estudiantes.length; i++){
        var s = estudiantes[i];
        var studentGroup = students[s].studentGroup;
        var studentName = students[s].studentName;
        var studentPlate = students[s].studentPlate;
        if(s == uuid){
            bandera = 1;
            i = estudiantes.length + 1;
            if(sMatricula != studentPlate){
                bandera2 = 1;
            }
        }
    }
    if(bandera == 1){
        alert("El usuario ya está registrado");
        if(bandera2 == 1)
            preguntarActualizar(sMatricula, s, studentName, studentGroup);
    }
    else{
        writeStudent(sMatricula, name, group, uuid);
    }
    clearData(" ");
    
}

function actualizarMatricula(plate, uuid, name, group)
{
    alert(plate + " | " + uuid + " | " + name + " | " + group);
    firebase.database().ref('students/' + uuid).set({
        studentPlate: plate,
        studentName: name,
        studentGroup: group
      });
    alert("Actualización completada");
    document.getElementById("clave").innerHTML = "";
    document.getElementById("matricula").innerHTML = "";
    document.getElementById("nombre").innerHTML = "";
    document.getElementById("grupo").innerHTML = "";
    bandera = 0;
    bandera2 = 0;
}

function preguntarActualizar(studentPlate, s, studentName, studentGroup){
    if(confirm("La matrícula es diferente" + "\n¿Desea actualizar la matricula?"))
    {
        actualizarMatricula(studentPlate, s, studentName, studentGroup);
    }
}

initialize();

})();