<?php
header('Access-Control-Allow-Origin:*');
header("Access-Control-Allow-Headers: X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Request-Method");
header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE");
header("Allow: GET, POST, OPTIONS, PUT, DELETE");
$method = $_SERVER['REQUEST_METHOD'];
if ($method == "OPTIONS") {
    die();
}
require_once 'vendor/autoload.php';
require_once 'regression.php';

use Psr\Http\Message\ResponseInterface as Response;
use Psr\Http\Message\ServerRequestInterface as Request;


$app = new Slim\Slim();
$db = new mysqli("kvconsult.com", "kvconsul_no-whaste", "Drupal2024$", "kvconsul_no-whaste");
//$db = new mysqli("localhost","marife","libido16","frdash_dev");
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

mysqli_set_charset($db, 'utf8');
if (mysqli_connect_errno()) {
    printf("Conexiónes fallida: %s\n", mysqli_connect_error());
    exit();
}

$app->get("/pred-producto/:id/:inicio/:fin", function ($id, $inicio, $fin) use ($db, $app) {
    header("Content-type: application/json; charset=utf-8");
    $query = $db->query("SELECT vd.id_producto,pd.nombre,count(*) total from ventas v, venta_detalle vd, productos pd,categorias cat,sub_categorias sc
    where v.id=vd.id_venta and vd.id_producto=pd.id and pd.id_categoria=cat.id and pd.id_subcategoria=sc.id
    and id_producto={$id} and v.fecha  between '{$inicio}' and '${fin}' group by 1,2");
    $prod1 = array();

    while ($row = $query->fetch_array()) {
        $prod1 = array('id' => (int) $row['id_producto'], 'nombre' => $row['nombre'], 'total' => $row['total']);
    }

    $data = array(
        "status" => 200,
        "producto" => $prod1
    );

    echo json_encode($data);
});

$app->get("/api", function () use ($db, $app) {
    header("Content-type: application/json; charset=utf-8");

    // Función para ejecutar una consulta y devolver los resultados en un array
    function fetchSingleResult($db, $query)
    {
        $result = $db->query($query);
        return $result->fetch_assoc(); // Devolver el resultado como array asociativo
    }

    // Función para obtener todas las categorías, subcategorías y productos correctamente relacionados
    function fetchCategorySubcategoryProductData($db)
    {
        $query = "
            SELECT 
                cat.id AS categoria_id, 
                cat.nombre AS categoria_nombre,
                sc.id AS subcategoria_id, 
                sc.nombre AS subcategoria_nombre,
                pd.id AS producto_id,
                pd.nombre AS producto_nombre,
                pd.image AS producto_imagen
            FROM productos pd
            JOIN sub_categorias sc ON pd.id_subcategoria = sc.id
            JOIN categorias cat ON sc.id_categoria = cat.id
        ";

        $result = $db->query($query);
        $categorias = [];
        $subCategorias = [];
        $productos = [];

        // Organizar los datos de la consulta
        while ($row = $result->fetch_assoc()) {
            // Agregar categorías
            if (!isset($categorias[$row['categoria_id']])) {
                $categorias[$row['categoria_id']] = [
                    'id' => (int) $row['categoria_id'],
                    'nombre' => $row['categoria_nombre']
                ];
            }

            // Agregar subcategorías
            if (!isset($subCategorias[$row['subcategoria_id']])) {
                $subCategorias[$row['subcategoria_id']] = [
                    'id' => (int) $row['subcategoria_id'],
                    'nombre' => $row['subcategoria_nombre']
                ];
            }

            // Agregar productos
            if (!isset($productos[$row['producto_id']])) {
                $productos[$row['producto_id']] = [
                    'id' => (int) $row['producto_id'],
                    'nombre' => $row['producto_nombre'],
                    'imagen' => $row['producto_imagen']
                ];
            }
        }

        // Reindexar los arrays para quitar las claves asociativas
        $categorias = array_values($categorias);
        $subCategorias = array_values($subCategorias);
        $productos = array_values($productos);

        return compact('categorias', 'subCategorias', 'productos');
    }

    // Generar los rangos de fechas dinámicamente
    $currentYear = date('Y');
    $dateRanges = generateYearlyDateRanges($currentYear);

    // Llamar a la función para obtener categorías, subcategorías y productos relacionados
    $categorySubcategoryProductData = fetchCategorySubcategoryProductData($db);
    $categorias = $categorySubcategoryProductData['categorias'];
    $subCategorias = $categorySubcategoryProductData['subCategorias'];
    $productos = $categorySubcategoryProductData['productos'];

    // Consultar otros datos adicionales como desperdicios, ventas, demandas, ofertas, estaciones, etc.
    $query = "
        SELECT CASE DATE_FORMAT(fecha, '%m')
            WHEN '01' THEN 'Verano'
            WHEN '02' THEN 'Verano'
            WHEN '03' THEN 'Verano'
            WHEN '04' THEN 'Otoño'
            WHEN '05' THEN 'Otoño'
            WHEN '06' THEN 'Otoño'
            WHEN '07' THEN 'Invierno'
            WHEN '08' THEN 'Invierno'
            WHEN '09' THEN 'Invierno'
            WHEN '10' THEN 'Primavera'
            WHEN '11' THEN 'Primavera'
            WHEN '12' THEN 'Primavera'
            END AS estacion,
            CASE DATE_FORMAT(fecha, '%m')
            WHEN '01' THEN '1'
            WHEN '02' THEN '1'
            WHEN '03' THEN '1'
            WHEN '04' THEN '2'
            WHEN '05' THEN '2'
            WHEN '06' THEN '2'
            WHEN '07' THEN '3'
            WHEN '08' THEN '3'
            WHEN '09' THEN '3'
            WHEN '10' THEN '4'
            WHEN '11' THEN '4'
            WHEN '12' THEN '4'
            END AS cod_estacion,
            DATE_FORMAT(fecha, '%y%m') mes, SUM(valor_total) total 
        FROM notas 
        WHERE fecha >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '%Y-%m-01 00:00:00')
        AND fecha < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
        GROUP BY estacion, cod_estacion, mes 
        ORDER BY mes ASC
    ";
    $result = $db->query($query);
    $waste = [];
    $season = [];
    while ($row = $result->fetch_assoc()) {
        $waste[] = (int) $row['total'];
        $season[] = [
            'cod_estacion' => (int) $row['cod_estacion'],
            'estacion' => $row['estacion'],
            'periodo' => $row['mes']
        ];
    }

    // Consultar ventas agrupadas por mes
    $sales = [];
    $result = $db->query("SELECT DATE_FORMAT(fecha, '%y%m') mes, SUM(valor_total) total 
                          FROM ventas 
                          WHERE fecha >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '%Y-%m-01 00:00:00')
                          AND fecha < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
                          GROUP BY mes 
                          ORDER BY mes ASC");
    while ($row = $result->fetch_assoc()) {
        $sales[] = (int) $row['total'];
    }

    // Consultar demandas
    $demand = [];
    $result = $db->query("SELECT DATE_FORMAT(fecha, '%y%m') mes, COUNT(id) total 
                          FROM compras  
                          WHERE fecha >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '%Y-%m-01 00:00:00')
                          AND fecha < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
                          GROUP BY mes 
                          ORDER BY mes ASC");
    while ($row = $result->fetch_assoc()) {
        $demand[] = (int) $row['total'];
    }

    // Consultar ofertas
    $offers = [];
    $result = $db->query("SELECT DATE_FORMAT(v.fecha, '%Y-%m') AS mes, COUNT(vd.id_producto) AS total 
                          FROM ventas v 
                          JOIN venta_detalle vd ON v.id = vd.id_venta 
                          WHERE v.fecha >= DATE_FORMAT(DATE_SUB(CURDATE(), INTERVAL 3 MONTH), '%Y-%m-01 00:00:00')
                          AND v.fecha < DATE_ADD(CURDATE(), INTERVAL 1 DAY)
                          GROUP BY mes 
                          ORDER BY mes ASC");
    while ($row = $result->fetch_assoc()) {
        $offers[] = (int) $row['total'];
    }

    // Consultar ventas por día
    $ventas_por_dia = [];
    $result = $db->query("SELECT DATE(v.fecha) as fecha, DATE_FORMAT(v.fecha, '%d-%m-%y') as formatted_date, count(DISTINCT vd.id_producto) total 
                          FROM ventas v 
                          JOIN venta_detalle vd ON v.id = vd.id_venta 
                          WHERE v.fecha BETWEEN DATE_SUB(CURDATE(), INTERVAL 4 MONTH) AND CURDATE() 
                          GROUP BY fecha 
                          ORDER BY fecha ASC");
    while ($row = $result->fetch_assoc()) {
        $ventas_por_dia[] = [
            'fecha' => $row['formatted_date'],
            'total' => (int) $row['total']
        ];
    }

    // Respuesta final con toda la estructura respetada
    $data = [
        "status" => 200,
        "categorias" => $categorias,
        "subCategorias" => $subCategorias,
        "kilosFlag" => [0, 1, 1, 1],
        "productos" => $productos,
        'waste' => $waste,
        'demands' => $demand,
        'offers' => $offers,
        'season' => $season,
        'sales' => $sales,
        'ventas_x_dia' => $ventas_por_dia
    ];

    // Enviar la respuesta JSON
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
});




function generateYearlyDateRanges($year)
{
    $months = [];

    for ($month = 1; $month <= 12; $month++) {
        $startDate = sprintf('%d-%02d-01', $year, $month);
        $endDate = date('Y-m-t', strtotime($startDate));

        $months[$startDate] = $endDate;
    }

    return $months;
}

$app->get("/merma", function () use ($db, $app) {
    header("Access-Control-Allow-Origin: *");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    header("Access-Control-Allow-Headers: Content-Type");
    header("Content-type: application/json; charset=utf-8");

    $json = $app->request->getBody();
    $dat = json_decode($json, true);

    $query = $db->query("SELECT DATE_FORMAT(fecha,'%m'),DATE_FORMAT(fecha,'%M') mes,sum(valor_total) total FROM notas where fecha between DATE_SUB(CURDATE(), INTERVAL 3 MONTH)  and CURDATE() group by 1,2 order by 1 desc");
    $waste = array();
    $season = array();

    while ($row = $query->fetch_array()) {
        $waste[] = array('mes' => $row['mes'], 'monto' => (int) $row['total']);
        $season[] = $row['mes'];
    }

    $data = array(
        "status" => 200,
        'waste' => $waste
    );
    echo json_encode($data);
});


$app->post("/predecir", function () use ($db, $app) {
    header("Content-type: application/json; charset=utf-8");
    $json = $app->request->getBody();
    $dat = json_decode($json, true);
    $arraymeses = array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
    $arraynros = array('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12');
    $mes1 = substr($dat['ini'], 3, 3);
    $mes2 = substr($dat['fin'], 3, 3);
    $dia1 = substr($dat['ini'], 0, 2);
    $dia2 = substr($dat['fin'], 0, 2);
    $ano1 = substr($dat['ini'], 7, 4);
    $ano2 = substr($dat['fin'], 7, 4);
    $fmes1 = str_replace($arraymeses, $arraynros, $mes1);
    $fmes2 = str_replace($arraymeses, $arraynros, $mes2);
    $ini = $ano1 . '-' . $fmes1 . '-' . $dia1;
    $fin = $ano2 . '-' . $fmes2 . '-' . $dia2;
    $rango = getRangeDate($ini, $fin);
    $venta_real = array();
    $sql = "SELECT sum(valor_total) venta,DATE_FORMAT(v.fecha, '%Y-%m-%d') fecha FROM ventas v where fecha_registro between '" . $ini . "' and '" . $fin . "' group by 2";
    $datos = $db->query($sql);
    $info = array();
    $dias = array();
    $dia = 1;

    while ($data = $datos->fetch_array()) {
        array_push($info, $data['venta']);
        array_push($venta_real, $data['venta']);
        array_push($dias, $dia);
        $dia++;
    }

    $ia = new IAphp();
    $prediccionVentas = $ia->regresionLineal($dias, $info);
    $w = $prediccionVentas["w"];
    $b = $prediccionVentas["b"];
    $datosPrediccion = array();
    for ($i = 0; $i < count($rango); $i++) {
        $venta = $w * ($i + 1) + $b;
        array_push($datosPrediccion, (string) round($venta, 2));
    }


    $data = array(
        "status" => 200,
        "b" => $b,
        "w" => $w,
        "fechas_pred" => $rango,
        "dias" => $dias,
        "datosPrediccion" => $datosPrediccion,
        "venta_real" => $venta_real,
        "inicio" => $ini,
        "final" => $fin,
        "query" => $sql
    );

    echo json_encode($data);
});

$app->post("/predecir-mermas", function () use ($db, $app) {
    header("Content-type: application/json; charset=utf-8");
    $json = $app->request->getBody();
    $dat = json_decode($json, true);
    $arraymeses = array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
    $arraynros = array('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12');
    $mes1 = substr($dat['ini'], 3, 3);
    $mes2 = substr($dat['fin'], 3, 3);
    $dia1 = substr($dat['ini'], 0, 2);
    $dia2 = substr($dat['fin'], 0, 2);
    $ano1 = substr($dat['ini'], 7, 4);
    $ano2 = substr($dat['fin'], 7, 4);
    $fmes1 = str_replace($arraymeses, $arraynros, $mes1);
    $fmes2 = str_replace($arraymeses, $arraynros, $mes2);
    $ini = $ano1 . '-' . $fmes1 . '-' . $dia1;
    $fin = $ano2 . '-' . $fmes2 . '-' . $dia2;
    $rango = getRangeDate($ini, $fin);
    $venta_real = array();
    $sql = "SELECT sum(cantidad*precio) merma,DATE_FORMAT(fecha_registro, '%Y-%m-%d') fecha FROM nota_detalle where fecha_registro between  '" . $ini . "' and '" . $fin . "'   group by 2";
    //$sql="SELECT sum(valor_total) venta,DATE_FORMAT(v.fecha, '%Y-%m-%d') fecha FROM ventas v where fecha_registro between '".$ini."' and '".$fin."' group by 2";
    $datos = $db->query($sql);
    $info = array();
    $dias = array();
    $dia = 1;

    while ($data = $datos->fetch_array()) {
        array_push($info, $data['merma']);
        array_push($venta_real, $data['merma']);
        array_push($dias, $dia);
        $dia++;
    }

    $ia = new IAphp();
    $prediccionVentas = $ia->regresionLineal($dias, $info);
    $w = $prediccionVentas["w"];
    $b = $prediccionVentas["b"];
    $datosPrediccion = array();
    for ($i = 0; $i < count($rango); $i++) {
        $venta = $w * ($i + 1) + $b;
        array_push($datosPrediccion, (string) round($venta, 2));
    }


    $data = array(
        "status" => 200,
        "b" => $b,
        "w" => $w,
        "fechas_pred" => $rango,
        "dias" => $dias,
        "datosPrediccion" => $datosPrediccion,
        "venta_real" => $venta_real,
        "inicio" => $ini,
        "final" => $fin,
        "query" => $sql
    );

    echo json_encode($data);
});


$app->post("/predecir-compras", function () use ($db, $app) {
    header("Content-type: application/json; charset=utf-8");
    $json = $app->request->getBody();
    $dat = json_decode($json, true);
    $arraymeses = array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
    $arraynros = array('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12');
    $mes1 = substr($dat['ini'], 3, 3);
    $mes2 = substr($dat['fin'], 3, 3);
    $dia1 = substr($dat['ini'], 0, 2);
    $dia2 = substr($dat['fin'], 0, 2);
    $ano1 = substr($dat['ini'], 7, 4);
    $ano2 = substr($dat['fin'], 7, 4);
    $fmes1 = str_replace($arraymeses, $arraynros, $mes1);
    $fmes2 = str_replace($arraymeses, $arraynros, $mes2);
    $ini = $ano1 . '-' . $fmes1 . '-' . $dia1;
    $fin = $ano2 . '-' . $fmes2 . '-' . $dia2;
    $rango = getRangeDate($ini, $fin);
    $venta_real = array();
    $sql = "SELECT sum(cantidad*precio)gasto,DATE_FORMAT(c.fecha_registro, '%Y-%m-%d') fecha FROM compras c, detalle_compras d  where c.id=d.id_compra and fecha between  '" . $ini . "' and '" . $fin . "'  group by 2";
    $datos = $db->query($sql);
    $info = array();
    $dias = array();
    $dia = 1;

    while ($data = $datos->fetch_array()) {
        array_push($info, $data['gasto']);
        array_push($venta_real, $data['gasto']);
        array_push($dias, $dia);
        $dia++;
    }

    $ia = new IAphp();
    $prediccionVentas = $ia->regresionLineal($dias, $info);
    $w = $prediccionVentas["w"];
    $b = $prediccionVentas["b"];
    $datosPrediccion = array();
    for ($i = 0; $i < count($rango); $i++) {
        $venta = $w * ($i + 1) + $b;
        array_push($datosPrediccion, (string) round($venta, 2));
    }


    $data = array(
        "status" => 200,
        "b" => $b,
        "w" => $w,
        "fechas_pred" => $rango,
        "dias" => $dias,
        "datosPrediccion" => $datosPrediccion,
        "venta_real" => $venta_real,
        "inicio" => $ini,
        "final" => $fin,
        "query" => $sql
    );

    echo json_encode($data);
});

$app->post("/exportar", function () use ($db, $app) {
    //header("Content-type: application/json; charset=utf-8");
    $json = $app->request->getBody();
    $dat = json_decode($json, true);
    $arraymeses = array('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
    $arraynros = array('01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12');
    $mes1 = substr($dat['ini'], 3, 3);
    $mes2 = substr($dat['fin'], 3, 3);
    $dia1 = substr($dat['ini'], 0, 2);
    $dia2 = substr($dat['fin'], 0, 2);
    $ano1 = substr($dat['ini'], 7, 4);
    $ano2 = substr($dat['fin'], 7, 4);
    $fmes1 = str_replace($arraymeses, $arraynros, $mes1);
    $fmes2 = str_replace($arraymeses, $arraynros, $mes2);
    $ini = $ano1 . '-' . $fmes1 . '-' . $dia1;
    $fin = $ano2 . '-' . $fmes2 . '-' . $dia2;


    $fileName = "members-data_" . date('Y-m-d') . ".xls";
    $lineData = array();
    $fields = array('');
    $excelData = implode("\t", array_values($fields)) . "\n";
    // Fetch records from database
    $sql = "SELECT v.id, v.tipoDoc,v.id_usuario,case v.estado when '1' then 'Enviada' when '3' then 'Anulada' end as estado,u.nombre usuario,ve.id id_vendedor,concat(ve.nombre,' ',ve.apellidos) vendedor,c.id id_cliente,c.num_documento,c.direccion,concat(c.nombre,' ',c.apellido) cliente,igv,monto_igv,valor_neto,valor_total,  comprobante,nro_comprobante, DATE_FORMAT(v.fecha, '%Y-%m-%d') fecha,formaPago,DATE_FORMAT(v.fechaPago, '%Y-%m-%d') fechaPago ,observacion FROM ventas v,usuarios u,clientes c,vendedor ve where v.id_vendedor=ve.id and v.id_cliente=c.id and v.id_usuario=u.id and v.comprobante in('Boleta') and fecha BETWEEN '" . $ini . "' and '" . $fin . "'  union all SELECT v.id,v.tipoDoc, v.id_usuario,case  v.estado when '1' then 'Enviada' when '3' then 'Anulada' end as estado,u.nombre usuario,ve.id id_vendedor,concat(ve.nombre,' ',ve.apellidos) vendedor,c.id id_cliente,c.num_documento,c.direccion,concat(c.razon_social) cliente,igv,monto_igv,valor_neto,valor_total,  comprobante,nro_comprobante,DATE_FORMAT(v.fecha, '%Y-%m-%d') fecha,formaPago,DATE_FORMAT(v.fechaPago, '%Y-%m-%d') fechaPago ,observacion FROM ventas v,usuarios u,empresas c,vendedor ve where v.id_vendedor=ve.id and v.id_cliente=c.id and v.id_usuario=u.id and v.comprobante in('Factura','Factura Gratuita') and fecha BETWEEN '" . $ini . "' and '" . $fin . "'  order by id desc";

    $query = $db->query($sql);
    if ($query->num_rows > 0) {
        // Output each row of the data
        while ($row = $query->fetch_assoc()) {
            $fields = array('FACTURA', 'TIPO', 'FECHA EMISION', 'CLIENTE', 'RUC', 'FORMA PAGO', 'FECHA PAGO');
            $excelData .= implode("\t", array_values($fields)) . "\n";
            $lineData  = array($row['nro_comprobante'], $row['comprobante'], $row['fecha'], $row['cliente'], $row['num_documento'], $row['formaPago'], $row['fechaPago']);
            array_walk($lineData, 'filterData');
            $excelData .= implode("\t", array_values($lineData)) . "\n";
            $sqlrow = "SELECT v.`id`, `id_producto`,p.codigo,p.`nombre`,`unidad_medida` ,`cantidad`,v.`peso` ,`precio`, `subtotal` FROM `venta_detalle` v ,productos p where v.id_producto=p.id and id_venta={$row['id']}";
            $query2 = $db->query($sqlrow);
            $fields2 = array('NRO', 'CODIGO', 'PRODUCTO', 'UNIDAD', 'CANTIDAD', 'PRECIO', 'SUBTOTAL');
            $excelData .= implode("\t", array_values($fields2)) . "\n";
            $nro = 1;
            while ($row2 = $query2->fetch_assoc()) {
                $lineData1 = array($nro, $row2['codigo'], $row2['nombre'], $row2['unidad_medida'], $row2['cantidad'], $row2['precio'], $row2['subtotal']);
                array_walk($lineData1, 'filterData');
                $excelData .= implode("\t", array_values($lineData1)) . "\n";
                $nro++;
            }
            $fields3 = array('', '', '', '', '', 'OP. Gravadas', $row['valor_neto']);
            $excelData .= implode("\t", array_values($fields3)) . "\n";
            $fields4 = array('', '', '', '', '', 'I.G.V', $row['monto_igv']);
            $excelData .= implode("\t", array_values($fields4)) . "\n";
            $fields5 = array('', '', '', '', '', 'TOTAL', $row['valor_total']);
            $excelData .= implode("\t", array_values($fields5)) . "\n";
        }
    } else {
        $excelData .= 'No hay resultados de la consulta...' . "\n";
    }

    // Headers for download
    header("Content-Type: application/vnd.ms-excel");
    header("Content-Disposition: attachment; filename=\"$fileName\"");

    // Render excel data
    echo $excelData;
});

function filterData(&$str)
{
    $str = preg_replace("/\t/", "\\t", $str);
    $str = preg_replace("/\r?\n/", "\\n", $str);
    if (strstr($str, '"')) $str = '"' . str_replace('"', '""', $str) . '"';
}

function getRangeDate($date_ini, $date_end)
{
    $data = array();
    for ($i = $date_ini; $i <= $date_end; $i = date("Y-m-d", strtotime($i . "+ 1 days"))) {

        array_push($data, $i);
    }

    return $data;
}

$app->run();
