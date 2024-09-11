import { Component, Inject, OnInit} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Compra } from 'app/models/compra';
import { BrowserModule } from '@angular/platform-browser';
import { ApiService } from 'app/api.service';
import { DetalleCompra } from 'app/models/detalleCompra';
import { AddDetalleComponent } from './add-detalle/add-detalle.component';
//import { ToastrService } from 'ngx-toastr';
//import { AddDetalleComponent } from './addDetalle.component';
//import { DetalleCompra } from 'src/app/modelos/detalleCompra';



export const MY_MOMENT_FORMATS = {
  parseInput: 'l LT',
  fullPickerInput: 'l LT',
  datePickerInput: 'l',
  timePickerInput: 'LT',
  monthYearLabel: 'MM YYYY',
  dateA11yLabel: 'LL',
  monthYearA11yLabel: 'MM YYYY',
};

@Component({
  selector: 'app-add-compra',
  templateUrl: './add-compras.component.html',
  styleUrls: ['./add-compras.component.css']
})




export class AddComprasComponent implements OnInit {
  exampleArray:any[] = [];
  dataProveedor:any;
  dataArray;
  dataSource:any;
  cancela:boolean=false;
  public selectedMoment = new Date();
  displayedColumns=['nombre','cantidad','precio','borrar'];
   dataComprobantes=[ {id:'Factura',tipo:'Factura'}, {id:'Boleta',tipo:'Boleta'}];
   constructor(
  //  private toastr: ToastrService,
    public dialogo:MatDialog,
    public dialogRef: MatDialogRef<AddComprasComponent>,
    public dialog:MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: Compra,
private api:ApiService) {

   }
   getProveedores(): void {
    this.api.getProveedorSelect().subscribe(data => {
      if(data) {
        this.dataProveedor = data;
      }
    } );
  }

  ngOnInit() {
    this.getProveedores();
  }

  onKey(value) {
    this.dataArray= [];
    this.selectSearch(value);
}
selectSearch(value:string){
  this.api.getProveedorSelect(value).subscribe(data => {
    if(data) {
      this.dataProveedor = data;
    }
  } );

}

deleteTicket(rowid: number){
  if (rowid > -1) {
    this.data.detalleCompra.splice(rowid, 1);
    this.dataSource = new MatTableDataSource(this.data.detalleCompra);
}
}

abrirDialog() {
  const dialogo1 = this.dialog.open(AddDetalleComponent, {
    data: new DetalleCompra(0,'',0,0)
  });
  dialogo1.afterClosed().subscribe(art => {
    if (art!= undefined)
    this.exampleArray.push(art)
    this.dataSource = new MatTableDataSource();
    this.dataSource.data = this.exampleArray;
    this.data.detalleCompra=this.exampleArray;
   });
}



cancelar(){
  this.dialogRef.close();
  this.dialogo.closeAll();
  this.cancela=true;
}

  close() {
     this.dialog.closeAll();

}


}
