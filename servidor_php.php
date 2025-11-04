<?php

require __DIR__ . '/vendor/autoload.php';

use PhpXmlRpc\Server;
use PhpXmlRpc\Response;
use PhpXmlRpc\Value;

// Función de resta
function restar($params)
{
    $a = $params->getParam(0)->scalarval();
    $b = $params->getParam(1)->scalarval();
    $resultado = $a - $b;
    return new Response(new Value($resultado, "int"));
}

// Configuración del servidor
$servidor = new Server([
    "restar" => [
        "function" => "restar"
    ]
]);

ob_clean();  // LIMPIA buffers antes de enviar XML

// Ejecutar el servicio
$servidor->service();