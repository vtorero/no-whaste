import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ApiService } from 'app/api.service';
import { Producto } from 'app/modelos/producto';

@Component({
  selector: 'app-ver-producto',
  templateUrl: './ver-producto.component.html',
  styleUrls: ['./ver-producto.component.css']
})
export class VerProductoComponent{
  form:FormGroup;
  dataSource;
  dataSubcategoria;
  isLoaded;
  usuario;
constructor(
  private api:ApiService,
  private fb:FormBuilder,
  public dialogRef: MatDialogRef<VerProductoComponent>,
  @Inject(MAT_DIALOG_DATA) public data:Producto,
){
  this.form=this.fb.group({
    codigo:['',Validators.required],
    nombre:['',Validators.required],
    peso:['',Validators.required],
    costo:['',Validators.required],
    categoria:['',Validators.required],
    subcategoria:['',Validators.required],

  });
}

getCate(): void {
  this.api.getCategoriaSelect().subscribe(data => {
    if(data) {
      this.dataSource = data;
      this.isLoaded = true;
    }
  } );
}

getSubCate(id): void {
  this.api.getApi('subcategoria/'+id).subscribe(data => {
    if(data) {
      this.dataSubcategoria=data;
    }
  } );
}

ngOnInit(){
  this.getCate()
}
handleCagetoria(data){
  this.getSubCate(data);
  console.log(this.dataSubcategoria)
}
cancelar() {
  this.dialogRef.close();
}
}
