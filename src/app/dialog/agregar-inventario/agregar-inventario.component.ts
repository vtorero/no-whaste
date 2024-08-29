import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'app/api.service';
import { Inventario } from '../../models/inventario';

@Component({
  selector: 'app-agregar-inventario',
  templateUrl: './agregar-inventario.component.html',
  styleUrls: ['./agregar-inventario.component.css']
})
export class AgregarInventarioComponent implements OnInit {
  dataProducto: any;
  dataPeso: any;
  dataArray:any;
  dataUnidades = [{ id: 'NIU', tipo: 'Unidades' }, { id: 'KGM', tipo: 'Kilogramo'}];
  constructor(
    public dialogRef: MatDialogRef<AgregarInventarioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Inventario,
    private api: ApiService,
  ){}

  ngOnInit() {
    this.getProductos();
  }

  cancelar() {
    this.dialogRef.close();
  }

  getProductos(): void {
    this.api.getProductosSelect().subscribe(data => {
      if (data) {
        this.dataProducto = data;
      }
    });
  }

  onKey(value) {
    this.dataArray = [];
    this.selectSearch(value);
  }

  onCantidad(value,da) {
    this.getProdPeso(da.id_producto);
    setTimeout(() => {
      this.data.peso = (value * this.dataPeso[0].peso)/1000;
     },1500);

  }
  getProdPeso(id) {
    this.api.getApi('producto/' + id).subscribe(data => {
      if (data) {
        this.dataPeso = data;
      }
    });
  }
  selectSearch(value: string) {
    console.log(value)
    this.api.getProductosSelect(value).subscribe(data => {
      if (data) {
        console.log("data",data)
        this.dataProducto = data;
      }
    });

  }
}
