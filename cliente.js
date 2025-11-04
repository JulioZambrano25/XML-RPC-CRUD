// cliente.js
const xmlrpc = require("xmlrpc");
const fs = require("fs");
const readline = require("readline-sync");


// Servidor Python (SUMA)
const clienteSuma = xmlrpc.createClient({
  host: "localhost",
  port: 8000,
  path: "/"
});

// Servidor PHP (RESTA)
const clienteResta = xmlrpc.createClient({
  host: "localhost",
  port: 8001,
  path: "/servidor_php.php"
});

// ARCHIVOS.json CRUD
const archivoDatos = "datos.json";
let datos = fs.existsSync(archivoDatos)
  ? JSON.parse(fs.readFileSync(archivoDatos))
  : [];

function guardarDatos() {
  fs.writeFileSync(archivoDatos, JSON.stringify(datos, null, 2));
}

// MENÚ PRINCIPAL
function menu() {
  console.log("\n=== MENU CRUD XML-RPC ===");
  console.log("1. Crear operacion (suma/resta)");
  console.log("2. Leer operaciones");
  console.log("3. Actualizar operacion");
  console.log("4. Eliminar operacion");
  console.log("5. Guardar");
}


// CRUD OPERACIONES

function crearOperacion() {
  const tipo = readline.question("¿Tipo de operacion? (suma/resta): ").trim().toLowerCase();
  const a = Number(readline.question("Primer numero: "));
  const b = Number(readline.question("Segundo numero: "));

  if (tipo === "suma") {
    clienteSuma.methodCall("sumar", [a, b], (err, res) => {
      if (err) return console.error(" Error:", err.message || err);
      console.log(` Resultado de sumar: ${res}`);
      datos.push({ tipo, a, b, resultado: res });
      guardarDatos();
    });
  } else if (tipo === "resta") {
    clienteResta.methodCall("restar", [a, b], (err, res) => {
      if (err) return console.error(" Error:", err.message || err);
      console.log(` Resultado de restar: ${res}`);
      datos.push({ tipo, a, b, resultado: res });
      guardarDatos();
    });
  } else {
    console.log(" Tipo invalido. Solo 'suma' o 'resta'.");
  }
}

function leerOperaciones() {
  console.log("\n Operaciones registradas:");
  if (datos.length === 0) {
    console.log("No hay operaciones registradas aun.");
    return;
  }
  datos.forEach((op, i) => {
    console.log(`${i + 1}. ${op.tipo}(${op.a}, ${op.b}) = ${op.resultado}`);
  });
}

function actualizarOperacion() {
  leerOperaciones();
  if (datos.length === 0) return;

  const i = Number(readline.question("Numero de operacion a modificar: ")) - 1;
  if (i < 0 || i >= datos.length) return console.log(" No existe esa operacion.");

  const nuevoA = Number(readline.question("Nuevo valor A: "));
  const nuevoB = Number(readline.question("Nuevo valor B: "));
  const tipo = datos[i].tipo;

  const cliente = tipo === "suma" ? clienteSuma : clienteResta;
  const metodo = tipo === "suma" ? "sumar" : "restar";

  cliente.methodCall(metodo, [nuevoA, nuevoB], (err, res) => {
    if (err) return console.error(" Error:", err.message || err);
    datos[i] = { tipo, a: nuevoA, b: nuevoB, resultado: res };
    guardarDatos();
    console.log(` Operacion actualizada: ${tipo}(${nuevoA}, ${nuevoB}) = ${res}`);
  });
}

function eliminarOperacion() {
  leerOperaciones();
  if (datos.length === 0) return;

  const i = Number(readline.question("Numero de operacion a eliminar: ")) - 1;
  if (i < 0 || i >= datos.length) return console.log(" No existe esa operacion.");
  datos.splice(i, 1);
  guardarDatos();
  console.log(" Operacion eliminada.");
}

// EJECUCIÓN PRINCIPAL

while (true) {
  menu();
  const opcion = readline.question("Elige una opcion: ").trim();
  if (opcion === "1") crearOperacion();
  else if (opcion === "2") leerOperaciones();
  else if (opcion === "3") actualizarOperacion();
  else if (opcion === "4") eliminarOperacion();
  else if (opcion === "5") {
    console.log(" Guardando datos...");
    break;
  } else {
    console.log(" Opcion invalida. Intenta de nuevo.");
  }
}
