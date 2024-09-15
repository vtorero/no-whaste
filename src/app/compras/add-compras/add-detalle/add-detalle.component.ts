import { Component, Inject, Input, NgModule } from '@angular/core';
import {  MatPaginatorModule } from '@angular/material/paginator';
import {MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BrowserModule } from '@angular/platform-browser';
//import { OwlDateTimeModule, OwlNativeDateTimeModule, OWL_DATE_TIME_FORMATS } from 'ng-pick-datetime';
import { DetalleCompra } from 'app/models/detalleCompra';




@Component({
  selector: 'hello',
  template: `<form #formItem="ngForm"><div>
  <h1 mat-dialog-title>Agregar Producto</h1>
  <div mat-dialog-content>
      <div style="display: flex;flex-direction: column; margin:1rem auto; width: 400px; padding: 1rem;">
          <mat-form-field>
              <input matInput name="descripcion" #descripcion="ngModel" [(ngModel)]="data.descripcion" type="text" placeholder="Ingrese nombre"required>
          </mat-form-field>
          <mat-form-field>
              <input matInput  name="cantidad" #cantidad="ngModel" [(ngModel)]="data.cantidad" type="number" placeholder="Ingrese cantidad" required>
          </mat-form-field>
          <mat-form-field>
            <input matInput name="precio" #precio="ngModel" [(ngModel)]="data.precio" type="number" placeholder=" S/.Precio" required>
            </mat-form-field>
           </div>
  </div>
  <div mat-dialog-actions>
    <button  mat-button [mat-dialog-close]="true">Cancelar</button>
    <button mat-button [mat-dialog-close]="data" [disabled]="!formItem.form.valid" cdkFocusInitial>Confirmar</button>
  </div>
  </div>`
})


export class AddDetalleComponent  {
    constructor(  @Inject(MAT_DIALOG_DATA) public data: DetalleCompra){}

}
