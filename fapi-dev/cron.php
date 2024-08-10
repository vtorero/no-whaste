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
function generateSeasonalIndex() {
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


function generatePromotionalEffect() {
    // Random promotional effect, with 0.95 meaning a discount period
    return rand(95, 105) / 100;
}

function normalize($value, $min, $max) {
    return ($value - $min) / ($max - $min);
}

function insertCompras($db) {
    $comprasData = [
        ['Factura', 'F001-15', 'Carne de cerdo', 1],
        ['Factura', 'F001-14', 'Insumos Preparación', 21],
        // Add more rows as needed
    ];
    $today = date('Y-m-d');
    foreach ($comprasData as $index => $compra) {
        $num_comprobante = $compra[1] . ($index + rand(10,99));
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
        // Add more rows as needed
    ];
    $today = date('Y-m-d');
    foreach ($ventasData as $index => $venta) {
        $valor_total = $venta[6] * generateSeasonalIndex() * generatePromotionalEffect();
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
        // Add more rows as needed
    ];
    $today = date('Y-m-d');
    $nextMonth = date('Y-m-d', strtotime("+1 month"));
    
    // Wastage (merma) range based on provided data
    $minMerma = 0.60;
    $maxMerma = 100.00;
    
    foreach ($inventarioData as $index => $item) {
        $merma = rand($minMerma * 100, $maxMerma * 100) / 100.0;
        $merma = normalize($merma, $minMerma, $maxMerma); // Normalizing the merma

        $query = "INSERT INTO `inventario` (`id_producto`, `presentacion`, `unidad`, `granel`, `cantidad`, `peso`, `merma`, `fecha_produccion`, `fecha_vencimiento`, `estado`, `ciclo`, `id_usuario`, `fecha_registro`) VALUES
        ({$item[0]}, '{$item[1]}', '{$item[2]}', '0.00', '{$item[3]}', '0.00', '{$merma}', '{$today}', '{$nextMonth}', '1', 2, 1, '{$today} 00:00:00')";
        $db->query($query);
    }
}

$app->get('/data/api', function() use ($app, $db) {
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
