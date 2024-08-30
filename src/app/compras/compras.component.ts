import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'app/api.service';
import { OpenDialogComponent } from 'app/dialog/open-dialog/open-dialog.component';
import { FormControl } from '@angular/forms';
import { Usuario } from 'app/modelos/usuario';
import { Global } from 'app/global';
import { Boleta } from 'app/models/Boleta/boleta';
import { Venta } from 'app/models/ventas';
import { Details } from 'app/models/Boleta/details';
import { Cuota } from 'app/models/Boleta/cuota';
import { Cliente } from 'app/models/cliente';
import { DetalleVenta } from 'app/models/detalleVenta';
import { Company } from 'app/models/Boleta/company';
import { Client } from '../models/Boleta/cliente';
import { EditarComponent } from 'app/ventas/editar/editar.component';
import { AgregarComponent } from 'app/ventas/agregar/agregar.component';

function sendInvoice(data,nro,url) {
  fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + Global.TOKEN_FACTURACION
    },
    body: data
  })
    .then(response => response.blob())
    .then(blob => {
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = "comprobante-" + nro + ".pdf";
      link.click();
    });
}

function getCDR(nro,url) {
  fetch(url, {
    method: 'post',
    headers: {
      'Content-Type': 'application/zip',
      'Authorization': 'Bearer ' + Global.TOKEN_FACTURACION 
    },
    body: JSON.stringify({"rucSol":"20605174095","userSol":"PUREADYS","passSol":"bleusiger","ruc":"20605174095","tipo":"01","serie":"F001","numero":nro})
  })
    .then(response => response.blob())
    .then(blob => {
      var link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = "20605174095-" + nro + "-.zip";
      link.click();
    });
  }
@Component({
  selector: 'app-compras',
  templateUrl: './compras.component.html',
  styleUrls: ['./compras.component.css']
})




export class ComprasComponent implements OnInit {
  buscador:boolean=false;
  selectedRowIndex:any;
  dataSource: any;
  dataDetalle: any;
  public boletacorrelativo:string;
  public Moment = new Date();
  cargando:boolean=false;
  client: any;
  letras: any;
  dataComprobantes = [{ id: 'Factura', tipo: 'Factura' }, { id: 'Boleta', tipo: 'Boleta' }, { id: 'Sin Comprobante', tipo: 'Pendiente' }];
  dataFormapago = [{ id: 'Contado' }, { id: 'Credito' }];
  startDate: Date = new Date();
  detalleVenta: DetalleVenta = new DetalleVenta('', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, '');
  company: Company = new Company('', '', {ubigueo:'',codigoPais:'',departamento:'',provincia:'',distrito:'',urbanizacion:'',direccion:''});
  cliente: Client = new Client('', '', '', { direccion: '' });
  boleta: Boleta = new Boleta('','', '', '', '', this.Moment, '', this.cliente, this.company,0,0,0,0,0,0,0,0,0,'', [], [{ code: '', value: '' }],{moneda:'',tipo:'',monto:0},[]);
  cancela: boolean = false;
  displayedColumns=['num_comprobante','comprobante','razon_social','descripcion' ,'fecha','total',];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('empTbSort') empTbSort = new MatSort();
  constructor(public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.renderDataTable();
  }

  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
}

openBusqueda(){
  if(this.buscador){
    this.buscador=false;
  }else{
    this.buscador=true;
  }
}

  selected(row) {
    this.selectedRowIndex=row;
    console.log('selectedRow',row)
  }

  editar(){
    console.log(this.selectedRowIndex);
  }

  renderDataTable() {
    this.selectedRowIndex=null
    this.api.getCompras().subscribe(x => {
    //this.api.listarUsuarios().subscribe(x => {
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = x;
      this.empTbSort.disableClear = true;
      this.dataSource.sort = this.empTbSort;
      this.dataSource.paginator = this.paginator;
      },
      error => {
        console.log('Error de conexion de datatable!' + error);
      });
  }

  abrirEditar(cod: Venta) {
    const dialogo2 = this.dialog.open(EditarComponent, {
      data: cod,
      disableClose: true
    });
    dialogo2.afterClosed().subscribe(art => {
      if (art != undefined){
      console.log("cargans",this.cargando);
       this.visualizar(art);
      }
    });
  }


  openDialogEdit(enterAnimationDuration: string, exitAnimationDuration: string): void {

    if(this.selectedRowIndex){
    const dialog= this.dialog.open(EditarComponent, {
      width: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
      data: this.selectedRowIndex
    });
    dialog.afterClosed().subscribe(ux => {
      if (ux!= undefined)
      this.update(ux)
     });

  }else{
    this._snackBar.open('Debe seleccionar un registro','OK',{duration:5000,horizontalPosition:'center',verticalPosition:'top'});
  }
  }

  openDelete(enterAnimationDuration: string, exitAnimationDuration: string){
  const dialogo2=this.dialog.open(OpenDialogComponent, {
    width: '400px',
    enterAnimationDuration,
    exitAnimationDuration,
    data: {
      clase:'DelUsuario',
      usuario:this.selectedRowIndex
    },
  });
  dialogo2.afterClosed().subscribe(ux => {
    console.log("delete");
    this.eliminar(ux);
   });

}


  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogo1 =this.dialog.open(AgregarComponent, {
      width: 'auto',
      enterAnimationDuration,
      exitAnimationDuration,
      data: new Venta(0, localStorage.getItem("currentId"),'',0, 0, '','', this.Moment,this.Moment, Global.BASE_IGV, 0, 0, [],false,'',0,'',this.boleta,''),
    });
    dialogo1.afterClosed().subscribe(us => {
      if (us!= undefined)
       this.agregar(us)
     });


  }

  update(art:Usuario) {
    if(art){
    this.api.actualizarUsuario(art).subscribe(
      data=>{
        this._snackBar.open(data['messaje'],'OK',{duration:5000,horizontalPosition:'center',verticalPosition:'top'});
        this.renderDataTable();
        },
      erro=>{console.log(erro)}
        );

  }
}

replaceStr(str, find, replace) {
  for (var i = 0; i < find.length; i++) {
    str = str.replace(new RegExp(find[i], 'gi'), replace[i]);
  }
  return str;
}


agregar(art:Venta) {
  console.log("art",art)
  this.cargando=true;
  if (art.comprobante != 'Pendiente') {
    let fec1;
    let fec2;
    let fecha1;
    let fecha2;
    var boleta: Boleta = new Boleta('',localStorage.getItem("id_usuario"), '', '', '', this.Moment, '', this.cliente, this.company, 0, 0, 0,0, 0,0,0,0,0, '', [], [{ code: '', value: '' }],{moneda:'',tipo:'',monto:0},[]);
    fec1 = art.fecha.toDateString().split(" ", 4);

    fec2 = art.fechaPago.toDateString().split(" ", 4);
    var find = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var replace = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];



    fecha1 = fec1[3] + '-' + this.replaceStr(fec1[1], find, replace) + '-' + fec1[2] + "T00:00:00-05:00";
    fecha2 = fec2[3] + '-' + this.replaceStr(fec2[1], find, replace) + '-' + fec2[2] + "T00:00:00-05:00";
    boleta.fechaEmision = fecha1;
    boleta.tipoMoneda = "PEN";
    boleta.ublVersion = "2.1";
    boleta.tipoOperacion = "0101";
    /**cliente*/
    if (art.cliente.nombre) {
      boleta.tipoDoc = "03";
      boleta.serie = "B001";
      boleta.client.tipoDoc = "1";
      boleta.client.rznSocial = art.cliente.nombre + ' ' + art.cliente.apellido;
      art.tipoDoc="1";
      this.api.getMaxId('boletas').subscribe(id=>{
      boleta.correlativo=id[0].ultimo.toString();
         });
    }
    if (art.cliente.razon_social) {
      boleta.tipoDoc = "01";
      boleta.serie = "F001";
      boleta.client.tipoDoc = "6";
      boleta.client.rznSocial = art.cliente.razon_social;
      art.tipoDoc="2";
      this.api.getMaxId('facturas').subscribe(id=>{
        boleta.correlativo=id[0].ultimo.toString();
           });
    }

    boleta.client.numDoc = art.cliente.num_documento;
    boleta.client.address.direccion = art.cliente.direccion;

    /*company*/
    boleta.company.ruc =  Global.RUC_EMPRESA;
    boleta.company.razonSocial = "VÍVIAN FOODS S.A.C";
    boleta.company.address.ubigueo="150131";
    boleta.company.address.codigoPais="PE";
    boleta.company.address.departamento="LIMA";
    boleta.company.address.provincia="LIMA";
    boleta.company.address.distrito="SAN ISIDRO";
    boleta.company.address.urbanizacion="-";
    boleta.company.address.direccion = "AV. PARDO Y ALIAGA N° 699 INT. 802";
    boleta.comprobante=art.comprobante;
    let total = 0;
    art.detalleVenta.forEach(function (value: any) {

      let detalleBoleta: Details = new Details('', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      detalleBoleta.codProducto = value.codProductob.codigo;
      detalleBoleta.descripcion = value.codProductob.nombre;
      detalleBoleta.unidad = value.unidadmedida;
      detalleBoleta.cantidad = value.cantidad;

      if(art.comprobante!='Factura Gratuita'){

      detalleBoleta.mtoValorVenta = parseFloat((value.cantidad * value.mtoValorUnitario).toFixed(2));
      detalleBoleta.mtoValorUnitario = parseFloat(Number(value.mtoValorUnitario).toFixed(2));
      detalleBoleta.mtoBaseIgv = parseFloat((value.cantidad * value.mtoValorUnitario).toFixed(2));
      detalleBoleta.igv = parseFloat(((value.cantidad * value.mtoValorUnitario) * Global.BASE_IGV).toFixed(2));
      detalleBoleta.totalImpuestos = parseFloat(((value.cantidad * value.mtoValorUnitario) * Global.BASE_IGV).toFixed(2));
      detalleBoleta.mtoPrecioUnitario = (parseFloat(value.mtoValorUnitario) + (value.mtoValorUnitario) * Global.BASE_IGV)
      total = total + (value.cantidad * value.mtoValorUnitario);
      detalleBoleta.porcentajeIgv = Global.BASE_IGV * 100;
      detalleBoleta.tipAfeIgv = 10;
    }else{
      detalleBoleta.mtoValorUnitario = 0;
      detalleBoleta.mtoValorGratuito = parseFloat(Number(value.mtoValorUnitario).toFixed(2));
      detalleBoleta.mtoValorVenta =parseFloat((value.cantidad * value.mtoValorUnitario).toFixed(2));
      detalleBoleta.mtoBaseIgv = parseFloat((value.cantidad * value.mtoValorUnitario).toFixed(2));
      detalleBoleta.igv = parseFloat(((value.cantidad * value.mtoValorUnitario) * Global.BASE_IGV).toFixed(2));
      detalleBoleta.totalImpuestos = parseFloat(((value.cantidad * value.mtoValorUnitario) * Global.BASE_IGV).toFixed(2));
      detalleBoleta.mtoPrecioUnitario = 0;
      total = total + (value.cantidad * value.mtoValorUnitario);
      detalleBoleta.porcentajeIgv = Global.BASE_IGV * 100;
      detalleBoleta.tipAfeIgv = 11;
    }

      boleta.details.push(detalleBoleta);
    });

    if(art.comprobante=='Factura Gratuita'){
      boleta.mtoOperGratuitas =  parseFloat(total.toFixed(2));
      boleta.mtoIGVGratuitas = parseFloat((total * Global.BASE_IGV).toFixed(2));
      boleta.mtoIGV = 0;
      boleta.totalImpuestos = 0;
      boleta.valorVenta = 0;
      boleta.mtoImpVenta = 0;
      boleta.subTotal = 0;
      boleta.company = this.company;
    }else{
      boleta.mtoOperGravadas = parseFloat(total.toFixed(2));
      boleta.mtoIGV = parseFloat((total * Global.BASE_IGV).toFixed(2));
      boleta.totalImpuestos = parseFloat((total * Global.BASE_IGV).toFixed(2));
      boleta.valorVenta = parseFloat(total.toFixed(2));
      boleta.mtoImpVenta = parseFloat((total + (total * Global.BASE_IGV)).toFixed(2));
      boleta.subTotal = parseFloat((total + (total * Global.BASE_IGV)).toFixed(2));
      boleta.company = this.company;
    }


    if(art.formaPago=='Credito' && art.cliente.razon_social){
    boleta.formaPago.tipo="Credito";
    boleta.formaPago.moneda="PEN";
    boleta.formaPago.monto=parseFloat((total + (total * Global.BASE_IGV)).toFixed(2))

    let detalleCuota: Cuota = new Cuota('',0,this.Moment);
    detalleCuota.moneda="PEN";
    detalleCuota.monto= parseFloat((total + (total * Global.BASE_IGV)).toFixed(2));
    detalleCuota.fechaPago=fecha2;
    boleta.cuotas.push(detalleCuota);

    let f1  = new Date(fec1);
    let f2  = new Date(fec2);
  if(f2.getTime()<=f1.getTime()){

    this._snackBar.open("Fecha de pago no puede ser menor o igual a la fecha de facturación","Error de fecha");
          this.cargando=false;
          return false;

  }


  }else{
    boleta.formaPago.moneda="PEN";
    boleta.formaPago.tipo="Contado";
   // boleta.formaPago.monto=parseFloat((total + (total * Global.BASE_IGV)).toFixed(2));
  }



    this.api.getNumeroALetras(total +(total * Global.BASE_IGV)).then(letra => {

      if(art.comprobante=='Factura Gratuita'){
      boleta.legends = [{ code: "1002", value: "TRANSFERENCIA GRATUITA DE UN BIEN Y/O SERVICIO PRESTADO GRATUITAMENTE"}];
    }else{
      boleta.legends = [{ code: "1000", value: "SON " + letra + " SOLES"}];
    }
    //setTimeout(() => {
      /*
      this.api.GuardarComprobante(boleta).subscribe(
        fact => {
          if (fact.sunatResponse.success) {
            this.toastr.info(fact.sunatResponse.cdrResponse.description,"Mensaje Sunat");

            if(art.cliente.razon_social){
              this.api.GuardarFactura(fact).subscribe(dat=>{
                boleta.correlativo=dat['max'];
                art.nro_comprobante=dat.max.ultimo_id.toString();
            });
          }
          if(art.cliente.nombre){
            this.api.GuardarBoleta(fact).subscribe(dat=>{
              boleta.correlativo=dat['max'];
              art.nro_comprobante=dat.max.ultimo_id.toString();
          });
        }

          }
          else {

            this.toastr.error("Factura/Boleta no recibida");
          }
          });
          */

          art.boleta=boleta;
          this.api.GuardarVenta(art).subscribe(data => {
            if(data['STATUS']){
            this._snackBar.open(data['sunat'],"Mensaje SUNAT");

              }else{
                this._snackBar.open(data['sunat'],"Mensaje SUNAT");


            }
          });


      if (art.imprimir) {




        sendInvoice(JSON.stringify(boleta), boleta.serie + boleta.correlativo,'https://facturacion.apisperu.com/api/v1/invoice/pdf');
      }
      this.cargando=false;

  });
  }else{
    this.api.GuardarVenta(art).subscribe(data => {
      this._snackBar.open(data['messaje']);
    },
      error => { console.log(error) }
    );
  }


    setTimeout(() => {
    this.renderDataTable();
    this.cargando=false;
    },3000);

  }


eliminar(art:Usuario) {
  console.log("art",art);
  if(art){
  this.api.eliminarUsuario(art).subscribe(
    data=>{
      this._snackBar.open(data['messaje'],'OK',{duration:5000,horizontalPosition:'center',verticalPosition:'top'});
      },
    erro=>{console.log(erro)}
      );
    this.renderDataTable();
}
}

visualizar(art) {
  this.cargando=true;
  let fech;
  let fechaPago;
  let boleta: Boleta = new Boleta('','', '', '', '', this.Moment, '', this.cliente, this.company, 0, 0,0, 0, 0, 0,0,0,0, '', [], [{ code: '', value: '' }],{moneda:'',tipo:'',monto:0},[]);
  fech=art.fecha+"T00:00:00-05:00"
  fechaPago=art.fechaPago+"T00:00:00-05:00"
  boleta.fechaEmision = fech  ;
  boleta.tipoMoneda = "PEN";
  boleta.ublVersion = "2.1";

  /**cliente*/
  if (art.comprobante=='Boleta') {
    boleta.tipoOperacion = "0101";
    boleta.tipoDoc = "03";
    boleta.serie = "B001";
    boleta.correlativo = art.nro_comprobante.substring(5,10);
    boleta.client.tipoDoc = "1";
    boleta.client.rznSocial = art.cliente;
  }
  if (art.comprobante=='Factura' || art.comprobante=='Factura Gratuita') {
    boleta.tipoOperacion = "0101";
    boleta.tipoDoc = "01";
    boleta.serie = "F001";
    boleta.correlativo = art.nro_comprobante.substring(5,10);
    boleta.client.tipoDoc = "6";
    boleta.client.rznSocial = art.cliente;
  }

  boleta.client.numDoc = art.num_documento;
  boleta.client.address.direccion = art.direccion;

  /*company*/
  boleta.company.ruc = Global.RUC_EMPRESA;
  boleta.company.razonSocial = "VÍVIAN FOODS S.A.C";
  boleta.company.address.ubigueo="150131";
  boleta.company.address.codigoPais="PE";
  boleta.company.address.departamento="LIMA";
  boleta.company.address.provincia="LIMA";
  boleta.company.address.distrito="SAN ISIDRO";
  boleta.company.address.urbanizacion="-";
  boleta.company.address.direccion = "AV. PARDO Y ALIAGA N° 699 INT. 802";
  let total = 0;
  art.detalleVenta.forEach(function (value: any) {

    let detalleBoleta: Details = new Details('', '', '', 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
    detalleBoleta.codProducto = value.codigo;
    detalleBoleta.unidad = value.unidad_medida;
    detalleBoleta.descripcion = value.nombre;
    detalleBoleta.cantidad = Number(value.cantidad);
    detalleBoleta.mtoValorUnitario = parseFloat(Number(value.precio).toFixed(3));
    detalleBoleta.mtoValorVenta = parseFloat((Number(value.precio) * Number(value.cantidad)).toFixed(3));
    detalleBoleta.mtoBaseIgv = parseFloat((Number(value.precio) * Number(value.cantidad)).toFixed(3));
    detalleBoleta.porcentajeIgv = Global.BASE_IGV * 100;
    detalleBoleta.igv = parseFloat(((Number(value.precio) * Number(value.cantidad)) * Global.BASE_IGV).toFixed(3));
    detalleBoleta.totalImpuestos = parseFloat(((Number(value.precio) * Number(value.cantidad)) * Global.BASE_IGV).toFixed(3));
    detalleBoleta.mtoPrecioUnitario = parseFloat((Number(value.precio) + (value.precio * Global.BASE_IGV)).toFixed(3));

    detalleBoleta.tipAfeIgv = 10;
    boleta.details.push(detalleBoleta);
  });

  boleta.mtoOperGravadas = parseFloat(Number(art.valor_neto).toFixed(2));
  boleta.mtoIGV = parseFloat(Number(art.monto_igv).toFixed(2));
  boleta.totalImpuestos = parseFloat(Number(art.monto_igv).toFixed(2));
  boleta.valorVenta = parseFloat(Number(art.valor_neto).toFixed(2));
  boleta.mtoImpVenta = parseFloat(Number(art.valor_total).toFixed(2));
  boleta.subTotal = parseFloat(Number(art.valor_total).toFixed(2));
  boleta.company = this.company;
  if(art.formaPago=='Credito'){
  boleta.formaPago.tipo=art.formaPago;
  let detalleCuota: Cuota = new Cuota('',0,this.Moment);
  detalleCuota.moneda="PEN"
  detalleCuota.monto= parseFloat(Number(art.valor_total).toFixed(2));
  detalleCuota.fechaPago=fechaPago;
  boleta.cuotas.push(detalleCuota);

}else{
  boleta.formaPago.moneda="PEN";
  boleta.formaPago.tipo=art.formaPago;
  boleta.formaPago.monto= parseFloat(Number(art.valor_total).toFixed(2));
}

console.log("reviewa",boleta);

  this.api.getNumeroALetras(art.valor_total).then(data => {

    if(art.comprobante=='Factura Gratuita'){
      boleta.legends = [{ code: "1002", value: "TRANSFERENCIA GRATUITA DE UN BIEN Y/O SERVICIO PRESTADO GRATUITAMENTE"}];
    }else{
      boleta.legends = [{ code: "1000", value: "SON " + data + " SOLES" + " | Observación: "+art.observacion }];
    }


//  setTimeout(() => {
    sendInvoice(JSON.stringify(boleta), art.nro_comprobante,'https://facturacion.apisperu.com/api/v1/invoice/pdf');
    this.cargando=false;
 // },1000);
});
}


  clickedRows = new Set<Usuario>();

}
