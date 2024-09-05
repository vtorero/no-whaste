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

$app = new Slim\Slim();

$db = new mysqli("kvconsult.com", "kvconsul_no-whaste", "Drupal2024$", "kvconsul_no-whaste");

if ($db->connect_errno) {
    echo "Failed to connect to MySQL: " . $db->connect_error;
    exit();
}

// Feature engineering and dynamic adjustments
function generateSeasonalIndex()
{
    $currentMonth = date('n');
    $seasonalMonths = [];

    // Calculate the three preceding months dynamically
    for ($i = 0; $i < 4; $i++) {
        $month = ($currentMonth - $i) > 0 ? ($currentMonth - $i) : 12 + ($currentMonth - $i);
        $seasonalMonths[] = $month;
    }

    // Higher sales during the selected months
    return in_array($currentMonth, $seasonalMonths) ? rand(110, 130) / 100 : rand(90, 110) / 100;
}


function generateRandomTime()
{
    $hour = str_pad(rand(0, 23), 2, '0', STR_PAD_LEFT);
    $minute = str_pad(rand(0, 59), 2, '0', STR_PAD_LEFT);
    $second = str_pad(rand(0, 59), 2, '0', STR_PAD_LEFT);
    return "$hour:$minute:$second";
}

function generatePromotionalEffect()
{
    // Random promotional effect, with 0.95 meaning a discount period
    return rand(95, 105) / 100;
}

function normalize($value, $min, $max)
{
    return ($value - $min) / ($max - $min);
}

function insertCompras($db)
{
    $comprasData = [
        ['Factura', 'F001-15', 'Carne de cerdo', 1],
        ['Factura', 'F001-14', 'Insumos Preparación', 21],
        // Add more rows as needed
    ];
    $today = date('Y-m-d');

    foreach ($comprasData as $index => $compra) {
        $num_comprobante = $compra[1] . ($index + rand(10, 99));
        $descripcion = $compra[2];
        $id_proveedor = $compra[3];
        $randomTime = generateRandomTime();
        $fechaRegistro = "{$today} {$randomTime}";

        // Insertar en la tabla compras
        $queryCompra = "INSERT INTO `compras` (`comprobante`, `num_comprobante`, `descripcion`, `fecha`, `id_proveedor`, `id_usuario`, `fecha_registro`) VALUES
        ('{$compra[0]}', '{$num_comprobante}', '{$descripcion}', '{$today}', {$id_proveedor}, 1, '{$fechaRegistro}')";
        $db->query($queryCompra);

        // Obtener el ID de la compra recién insertada
        $idCompra = $db->insert_id;

        // Inserción en detalle_compra
        insertDetalleCompra($db, $idCompra);
    }
}

function insertDetalleCompra($db, $idCompra)
{
    $detalleCompraData = [
        ['Carne de cerdo', 500.00, 1050.50, 12], // Montos grandes como solicitado
        ['Insumos Preparación', 1000.00, 1575.75, 104],
        // Add more rows as needed
    ];

    $today = date('Y-m-d');

    foreach ($detalleCompraData as $detalleCompra) {
        $randomTime = generateRandomTime();
        $fechaRegistro = "{$today} {$randomTime}";

        $queryDetalle = "INSERT INTO `detalle_compras` (`descripcion`, `cantidad`, `precio`, `id_articulo`, `id_compra`, `fecha_registro`) VALUES
        ('{$detalleCompra[0]}', {$detalleCompra[1]}, {$detalleCompra[2]}, {$detalleCompra[3]}, {$idCompra}, '{$fechaRegistro}')";

        if ($db->query($queryDetalle) === FALSE) {
            echo "Error al insertar en detalle_compra: " . $db->error;
        }
    }
}




function insertVentas($db)
{
    $ventasData = [
        [1, 1, 1, 0.18, 180.00, 1000.00],
        [1, 1, 41, 0.18, 457.00, 2498.90],
        // Add more rows as needed
    ];

    $ventaDetallesData = [
        [55, 1, 'KGM', 100.0000, 0.0000, 1000.0000],
        [32, 9, 'NIU', 30.0000, 0.0000, 847.0000],
        // Add more rows as needed
    ];

    $today = date('Y-m-d');

    foreach ($ventasData as $index => $venta) {
        $valor_total = $venta[5] * generateSeasonalIndex() * generatePromotionalEffect();
        $monto_igv = $venta[4];
        $valor_neto = $venta[3];
        $igv = $venta[2];
        $nro_comprobante = 'F001-' . ($index + 1);
        $randomTime = generateRandomTime();
        $fechaRegistro = "{$today} {$randomTime}";

        // Insert into ventas
        $query = "INSERT INTO `ventas` (`id_usuario`, `id_vendedor`, `id_cliente`, `igv`, `monto_igv`, `valor_neto`, `valor_total`, `formaPago`, `fechaPago`, `estado`, `comprobante`, `nro_comprobante`, `tipoDoc`, `observacion`, `fecha`, `fecha_registro`) VALUES
        (1, 1, {$venta[2]}, {$igv}, {$monto_igv}, {$valor_neto}, {$valor_total}, 'Contado', NULL, '1', 'Factura', '{$nro_comprobante}', '2', '', '{$fechaRegistro}', '{$fechaRegistro}')";
        $db->query($query);

        // Get the last inserted id for the ventas table
        $id_venta = $db->insert_id;

        // Insert into venta_detalle for each venta
        foreach ($ventaDetallesData as $detalleIndex => $detalle) {
            $queryDetalle = "INSERT INTO `venta_detalle` (`id_venta`, `id_producto`, `id_inventario`, `unidad_medida`, `cantidad`, `peso`, `precio`, `descuento`, `subtotal`, `fecha_registro`) VALUES
            ({$id_venta}, {$detalle[0]}, {$detalle[1]}, '{$detalle[2]}', {$detalle[3]}, {$detalle[4]}, {$detalle[5]}, NULL, {$detalle[5]}, '{$fechaRegistro}')";
            $db->query($queryDetalle);
        }
    }
}


function insertInventario($db)
{
    $inventarioData = [
        [12, 'bolsa', 'NIU', 33000],
        [104, 'bolsa', 'NIU', 3000],
        // Add more rows as needed
    ];
    $today = date('Y-m-d');
    $nextMonth = date('Y-m-d', strtotime("+1 month"));

    $minMerma = 0.60;
    $maxMerma = 100.00;

    foreach ($inventarioData as $index => $item) {
        $merma = rand($minMerma * 100, $maxMerma * 100) / 100.0;
        $merma = normalize($merma, $minMerma, $maxMerma); // Normalizing the merma
        $randomTime = generateRandomTime();
        $fechaRegistro = "{$today} {$randomTime}";
        $query = "INSERT INTO `inventario` (`id_producto`, `presentacion`, `unidad`, `granel`, `cantidad`, `peso`, `merma`, `fecha_produccion`, `fecha_vencimiento`, `estado`, `ciclo`, `id_usuario`, `fecha_registro`) VALUES
        ({$item[0]}, '{$item[1]}', '{$item[2]}', '0.00', '{$item[3]}', '0.00', '{$merma}', '{$fechaRegistro}', '{$nextMonth}', '1', 2, 1, '{$fechaRegistro}')";
        $db->query($query);
    }
}

$app->get('/data/api', function () use ($app, $db) {
    insertCompras($db);
    insertVentas($db);
    insertInventario($db);

    $result = [
        'status' => 'success',
        'message' => 'Data inserted successfully'
    ];

    echo json_encode($result);
});

$app->run();
