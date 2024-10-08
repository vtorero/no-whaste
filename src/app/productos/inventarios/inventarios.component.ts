import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'app/api.service';
import { Inventario } from 'app/models/inventario';
import {Router,ActivatedRoute,Params} from '@angular/router';
import { AgregarInventarioComponent } from '../../dialog/agregar-inventario/agregar-inventario.component';

@Component({
  selector: 'app-inventarios',
  templateUrl: './inventarios.component.html',
  styleUrls: ['./inventarios.component.css']
})



export class InventariosComponent implements OnInit {
  position = new FormControl('below');
  buscador:boolean=false;
  dataSource: any;
  public parametros;
  selectedRowIndex:any;
  cancela: boolean = false;
  selection = new SelectionModel(false, []);
  displayedColumns = ['id','codigo','producto','presentacion','cantidad', 'peso', 'fecha_produccion','fecha_vencimiento','dias'];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild('empTbSort') empTbSort = new MatSort();
  constructor(
    public dialog: MatDialog,
    private _route:ActivatedRoute,
    private _router:Router,
    private _snackBar: MatSnackBar,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this._route.params.forEach((params:Params)=>{
      this.parametros=params['id'];
      this.api.getAvisoInventario(this.parametros).subscribe(x => {
        this.dataSource = new MatTableDataSource();
        this.dataSource.data = x;
        this.empTbSort.disableClear = true;
        this.dataSource.sort = this.empTbSort;
        this.dataSource.paginator = this.paginator;
        },
        error => {
          console.log('Error de conexion de datatable!' + error);

    });
  });
  console.log("parame!",this.parametros)
  if( this.parametros==undefined){
    this.renderDataTable();
  }


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
    this.api.getApi('inventarios').subscribe(x => {
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
    if(this.selectedRowIndex){
    const dialog= this.dialog.open(AgregarInventarioComponent, {
      width: '800px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        id:this.selectedRowIndex.id,
           nombre:this.selectedRowIndex.nombres,
           correo:this.selectedRowIndex.email,
           estado:this.selectedRowIndex.estado,
           clase:'Usuario'
      },
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
  const dialogo2=this.dialog.open(AgregarInventarioComponent, {
    width: '800px',
    enterAnimationDuration,
    exitAnimationDuration,
    data: {
      clase:'DelUsuario',
      usuario:this.selectedRowIndex
    },
  });
  dialogo2.afterClosed().subscribe(ux => {
    console.log("delete");

   });

}


  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    const dialogo1 =this.dialog.open(AgregarInventarioComponent, {
      width: '800px',
      enterAnimationDuration,
      exitAnimationDuration,
      data: {
        clase:'Inventario',
        id:this.selectedRowIndex
      },
    });
    dialogo1.afterClosed().subscribe(us => {
      if (us!= undefined)
       this.agregar(us)
     });


  }

  update(art:Inventario) {
    if(art){
    this.api.EditarInventario(art).subscribe(
      data=>{
        this._snackBar.open(data['messaje'],'OK',{duration:5000,horizontalPosition:'center',verticalPosition:'top'});
        this.renderDataTable();
        },
      erro=>{console.log(erro)}
        );

  }
}


  agregar(art:Inventario) {
    if(art){
    this.api.GuardarInventario(art).subscribe(
      data=>{
        this._snackBar.open(data['messaje'],'OK',{duration:5000,horizontalPosition:'center',verticalPosition:'top'});
        },
      erro=>{console.log(erro)}
        );
      this.renderDataTable();
  }
}





  clickedRows = new Set<Inventario>();

}