import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'app/api.service';
import { AddProductoComponent } from 'app/dialog/add-producto/add-producto.component';
import { OpenDialogComponent } from 'app/dialog/open-dialog/open-dialog.component';
import { VerProductoComponent } from 'app/dialog/ver-producto/ver-producto.component';
import { Producto } from 'app/modelos/producto';
import { Usuario } from 'app/modelos/usuario';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})


export class ProductosComponent implements OnInit {
  position = new FormControl('below');
  buscador:boolean=false;
  dataSource: any;
  selectedRowIndex:any;
  cancela: boolean = false;
  selection = new SelectionModel(false, []);
  displayedColumns = ['codigo','nombre','peso','nombrecategoria','subcategoria','costo','usuario'];
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
    this.api.getProductos().subscribe(x => {
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

  openDialogEdit(enterAnimationDuration: string, exitAnimationDuration: string): void {
    console.log(this.selectedRowIndex)
    if(this.selectedRowIndex){
    const dialog= this.dialog.open(VerProductoComponent, {
      width: '700px',
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
    data:{
    producto:this.selectedRowIndex,
    clase:'DelProducto'}
  });
  dialogo2.afterClosed().subscribe(ux => {
    this.eliminar(ux);
   });

}


  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogo1 =this.dialog.open(AddProductoComponent, {
      width: '680px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        clase:'Producto',
        producto:this.selectedRowIndex
      },
    });
    dialogo1.afterClosed().subscribe(us => {
      if (us!= undefined)
       this.agregar(us)
     });


  }

  update(art:Producto) {
    if(art){
    art.usuario=localStorage.getItem("currentNombre");
    this.api.EditarProducto(art).subscribe(
      data=>{
        this._snackBar.open(data['messaje'],'OK',{duration:5000,horizontalPosition:'center',verticalPosition:'top'});
        this.renderDataTable();
        },
      erro=>{console.log(erro)}
        );

  }
}


  agregar(art:Producto) {
    if(art){
      art.usuario=localStorage.getItem("currentNombre");
    this.api.GuardarProducto(art).subscribe(
      data=>{
        this._snackBar.open(data['messaje'],'OK',{duration:5000,horizontalPosition:'center',verticalPosition:'top'});
        },
      erro=>{console.log(erro)}
        );
      this.renderDataTable();
  }
}

eliminar(art:Producto) {
  if(art){
  this.api.EliminarProducto(art).subscribe(
    data=>{
      this._snackBar.open(data['messaje'],'OK',{duration:5000,horizontalPosition:'center',verticalPosition:'top'});
      this.renderDataTable();
      },
    erro=>{console.log(erro)}
      );
   
}
}


  clickedRows = new Set<Usuario>();

}