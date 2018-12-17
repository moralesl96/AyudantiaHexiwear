;(function()
{   
    var nombreCurso = null;
    var uuid = null;
    var bandera = 0;
    var bandera2 = 0;
    var bandera3 = 0;
    var sMatricula = null;
    var name = null;
    var code = null;

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
      showStatus("Listo");
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
    bandera = 0;
    bandera2 = 0;
    bandera3 = 0;
}
function showStatus(text) {
    console.log(text);
    document.getElementById("status").innerHTML = text;
  }

  // Funciones para escribir y leer de la base de datos.
  function writeStudent(studentId, name, subject, uuid){
    firebase.database().ref('students/' + uuid).set({
        studentPlate: studentId,
        studentName: name,
        studentSubject: subject
      });
    clearData("");
  }

//Registro.html
function verificarClave(){
    code = document.getElementById("clave").value;
    sMatricula = document.getElementById("matricula").value;
    name = document.getElementById("nombre").value;
    uuid = device.uuid;
    if(name == "" || sMatricula == "" )
    {
        alert("Llenar todos los campos.");
    }
    else{
         verificarCurso()
                
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
        var studentSubject = students[s].studentSubject;
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
            preguntarActualizar(sMatricula, s, studentName, studentSubject);
    }
    else{
        writeStudent(sMatricula, name, nombreCurso, uuid);
        alert("Usuario Registrado");
    }
    clearData("");
    
}

function actualizarMatricula(plate, uuid, name, subject)
{
    firebase.database().ref('students/' + uuid).set({
        studentPlate: plate,
        studentName: name,
        studentSubject: subject
      });
    alert("Actualización completada");
    clearData("");

}

function preguntarActualizar(studentPlate, s, studentName, studentSubject){
    if(confirm("La matrícula es diferente" + "\n¿Desea actualizar la matricula?"))
    {
        actualizarMatricula(studentPlate, s, studentName, studentSubject);
    }
}

function verificarCurso(){
    rootRef = firebase.database().ref('cursos');
    rootRef.once('value', gotData2);
}

function gotData2(data) {
    var cursos = data.val();
    var curso = Object.keys(cursos);
    for(var i = 0; i < curso.length; i++){
        var s = curso[i];
        var nombre = cursos[s].Nombre;
        if(code == s){
            bandera3 = 1;
            i = curso.length + 1;
        }
    }
    if(bandera3 == 1){
        nombreCurso = nombre;
        verificandoEstudiante(); // Funcion para verificar si el uuid ya existe
    }
    else{
        alert("Clave errónea.");
    }
}

initialize();

})();