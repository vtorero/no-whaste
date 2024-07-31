<?php
header('Access-Control-Allow-Origin: *');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");

$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
    die();
}

require_once 'vendor/autoload.php';

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;

$app = new Slim\App();

$db = new mysqli("kvconsult.com", "kvconsul_no-whaste", "Drupal2024$", "kvconsul_no-whaste");

if ($db->connect_errno) {
    echo "Failed to connect to MySQL: " . $db->connect_error;
    exit();
}

function insertCompras($db) {
    $comprasData = [
        ['Factura', 'F001-1500', 'Carne de cerdo', 1],
        ['Factura', 'F001-1501', 'Insumos Preparación', 21],
        // Agrega más filas según sea necesario
    ];
    $today = date('Y-m-d');
    foreach ($comprasData as $index => $compra) {
        $num_comprobante = $compra[1] . '-' . ($index + 1500);
        $descripcion = $compra[2];
        $id_proveedor = $compra[3];
        $query = "INSERT INTO `compras` (`comprobante`, `num_comprobante`, `descripcion`, `fecha`, `id_proveedor`, `id_usuario`, `fecha_registro`) VALUES
        ('{$compra[0]}', '{$num_comprobante}', '{$descripcion}', '{$today}', {$id_proveedor}, 1, '{$today} 00:00:00')";
        $db->query($query);
    }
}

function insertVentas($db) {
    $ventasData = [
        [1, 1, 1, 1, 0.18, 1.80, 10.00],
        [1, 1, 41, 25.41, 0.18, 4.57, 29.98],
        // Agrega más filas según sea necesario
    ];
    $today = date('Y-m-d');
    foreach ($ventasData as $index => $venta) {
        $valor_total = $venta[6];
        $monto_igv = $venta[5];
        $valor_neto = $venta[4];
        $igv = $venta[3];
        $nro_comprobante = 'F001-' . ($index + 1);
        $query = "INSERT INTO `ventas` (`id_usuario`, `id_vendedor`, `id_cliente`, `igv`, `monto_igv`, `valor_neto`, `valor_total`, `formaPago`, `fechaPago`, `estado`, `comprobante`, `nro_comprobante`, `tipoDoc`, `observacion`, `fecha`, `fecha_registro`) VALUES
        (1, 1, 1, {$igv}, {$monto_igv}, {$valor_neto}, {$valor_total}, 'Contado', NULL, '3', 'Factura', '{$nro_comprobante}', '2', '', '{$today} 00:00:00', '{$today} 00:00:00')";
        $db->query($query);
    }
}

function insertInventario($db) {
    $inventarioData = [
        [12, 'bolsa', 'NIU', 33000],
        [104, 'bolsa', 'NIU', 3000],
        // Agrega más filas según sea necesario
    ];
    $today = date('Y-m-d');
    $nextMonth = date('Y-m-d', strtotime("+1 month"));
    foreach ($inventarioData as $index => $item) {
        $query = "INSERT INTO `inventario` (`id_producto`, `presentacion`, `unidad`, `granel`, `cantidad`, `peso`, `merma`, `fecha_produccion`, `fecha_vencimiento`, `estado`, `ciclo`, `id_usuario`, `fecha_registro`) VALUES
        ({$item[0]}, '{$item[1]}', '{$item[2]}', '0.00', '{$item[3]}', '0.00', '0.00', '{$today}', '{$nextMonth}', '1', 2, 1, '{$today} 00:00:00')";
        $db->query($query);
    }
}

$app->get('/data/api', function (Request $request, Response $response, array $args) use ($db) {
    insertCompras($db);
    insertVentas($db);
    insertInventario($db);

    $result = [
        'status' => 'success',
        'message' => 'Data inserted successfully'
    ];
    return $response->withJson($result);
});

$app->run();
