import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'app/api.service';
import { Global } from 'app/global';
import { DetalleVenta } from 'app/models/detalleVenta';
import { Venta } from 'app/models/ventas';
import { OpenDialogComponent } from '../../dialog/open-dialog/open-dialog.component';
import { addproductoComponent } from '../addproducto/addproducto.component';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.css']
})


export class AgregarComponent implements OnInit {
  displayedColumns = ['id','id_producto', 'nombre', 'cantidad', 'peso', 'precio','subtotal', 'borrar'];
  dataComprobantes = [{ id: 'Factura', tipo: 'Factura' },{ id: 'Factura Gratuita', tipo: 'Factura Gratuita' }, { id: 'Boleta', tipo: 'Boleta' }, { id: 'Pendiente', tipo: 'Pendiente' }];
  dataFormapago = [{ id: 'Contado' }, { id: 'Credito' }];
  dataVendedores: any;
  dataClientes: any;
  dataClient: any;
  dataEmpresas: any;
  dataProductos: any;
  exampleArray: any[] = [];
  dataProveedor: any;
  dataArray;
  dataSource: any;
  selected: string;
  filter: any;
  valor_neto:number=0;
  monto_igv:number=0;
  valor_total:number=0;
  habilita_envio:boolean=false;
  cancela:boolean=false;
  @ViewChild(MatSort,{static:false}) sort: MatSort;
  @ViewChild(MatPaginator,{static:false}) paginator: MatPaginator;
  constructor(
    private api: ApiService,
    private toastr: MatSnackBar,
      public dialog: MatDialog,
     @Inject(MAT_DIALOG_DATA) public data: Venta,
      //dateTimeAdapter: DateTimeAdapter<any>

/*

*/
  ) {/*dateTimeAdapter.setLocale('es-PE'); */}

  getVendedores(): void {
    this.api.getApi('vendedores').subscribe(data => {
      if (data) {
        this.dataVendedores = data;
      }
    });
  }
  getclientes(): void {
    this.api.getApi('clientes').subscribe(data => {
      if (data) {
        this.dataClientes = data;
      }
    });
  }

  getEmpresas(): void {
    this.api.getApi('empresas').subscribe(data => {
      if (data) {
        this.dataEmpresas = data;
      }
    });
  }

  radioChange(selected) {
    this.filter = selected.value;
    console.log(this.filter);

  }

  change(event)
    {
     console.log(event);
    if(event.source){
     this.data.cliente.push(event.source.value);
  }
}

  onKeyVendedor(value) {
    this.dataArray = [];
    this.selectSearch(value);
  }
  selectSearch(value: string) {
    this.api.getSelectApi('vendedor', value).subscribe(data => {
      if (data) {
        this.dataVendedores = data;
      }
    });

  }

  onKeyCliente(value) {
    this.dataArray = [];
    this.SearchCliente(value);
  }
  SearchCliente(value: string) {
    let criterio;
    if (value) {
      criterio = "/" + value
    } else {
      criterio ='';
    }
    console.log(value)
    this.api.getSelectApi('clientes', criterio).subscribe(data => {
      if (data) {
        this.dataClientes = data;
      }
    });
  }
  onKeyRuc(value) {
    this.data.id_vendedor=0;
    this.dataArray = [];
    this.SearchRuc(value);
  }
  SearchRuc(value: string) {
    let criterio;
    if (value) {
      criterio = "/" + value
    } else {
      criterio ='';
    }
    console.log(value)
    this.api.getSelectApi('empresas', criterio).subscribe(data => {
      if (data) {
        this.dataEmpresas = data;
      }
    });
  }

  clienteNuevo(value) {
    console.log("check", value.target.checked);

  }

  cancelar() {
    this.cancela=true;
    console.log("botoncancelar",this.cancela);
   this.dialog.closeAll();
    this.cancela=true;
  }


  abrirDialog() {
    const dialogo1 = this.dialog.open(addproductoComponent, {
      data: new DetalleVenta('','','',0,0,0,0,0,0,0,0,0,0,0,''),
      disableClose:true
    });
    dialogo1.afterClosed().subscribe(art => {
      if (art){
      this.Comparar(art.fecha,art.fechaPago);
      this.habilita_envio=true;
      this.exampleArray.push(art)
      this.valor_neto=parseFloat((this.valor_neto+(art.cantidad*art.mtoValorUnitario)).toFixed(2));
      this.monto_igv=parseFloat((this.monto_igv+(art.cantidad*art.mtoValorUnitario) * Global.BASE_IGV).toFixed(2));
      this.valor_total=parseFloat((this.valor_neto+this.monto_igv).toFixed(2));
      this.dataSource = new MatTableDataSource();
      this.dataSource.data = this.exampleArray;
      this.data.detalleVenta = this.exampleArray;
      //this.dataSource.sort = this.sort;
      //this.dataSource.paginator = this.paginator;
    }
    });



 /* deleteTicket(rowid: number){
    if (rowid > -1) {
      this.data.detalleVenta.splice(rowid, 1);
      this.dataSource = new MatTableDataSource(this.data.detalleVenta);
  }*/
  }

  Comparar(f1,f2){

    let fe1  = new Date(f1);
    let fe2  = new Date(f2);
  if(fe2.getTime()<=fe1.getTime()){
    this.toastr.open('Fecha de pago no puede ser menor o igual a la fecha de facturación','Error de fecha',{duration:5000,horizontalPosition:'center',verticalPosition:'top'});

  }
}

  deleteTicket(obj,i) {
    console.log("rowid",i);
    if(i==0){
      this.habilita_envio=false;
    }
    if (i > -1) {
      console.log("datasoruce",this.dataSource);
      this.data.detalleVenta.splice(i,1);
      this.valor_neto=this.valor_neto-(obj.cantidad*obj.mtoValorUnitario);
      this.monto_igv=this.monto_igv-(obj.cantidad*obj.mtoValorUnitario) * Global.BASE_IGV;
      this.valor_total=this.valor_neto+this.monto_igv;
      this.dataSource = new MatTableDataSource(this.data.detalleVenta);
      this.dataSource.sort = this.sort;
      this.dataSource.paginator = this.paginator;

    }
  }

  ngOnInit() {
    this.valor_neto=0;
    this.monto_igv=0;
    this.valor_total=0;
   this.getVendedores();
    this.getclientes();
    this.getEmpresas();
  }


}
