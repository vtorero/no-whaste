import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'app/api.service';
import { Sucursal } from '../../modelos/sucursal';

@Component({
  selector: 'app-add-sucursal',
  templateUrl: './add-sucursal.component.html',
  styleUrls: ['./add-sucursal.component.css']
})
export class AddSucursalComponent {

constructor(
  private toastr: MatSnackBar,
  //public dialogRef: MatDialogRef<>,
  @Inject(MAT_DIALOG_DATA) public data: Sucursal,
  private api:ApiService
){}

}
