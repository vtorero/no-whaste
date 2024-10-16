import { Component,  OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ApiService } from '../../api.service';


@Component({
  selector: 'app-accesos',
  templateUrl: './accesos.component.html',
  styleUrls: ['./accesos.component.css']
})



export class AccesosComponent implements OnInit {
form:FormGroup;
loading = false;
public error_user:boolean;
  constructor(
    private fb:FormBuilder,
    private api:ApiService,
    private router:Router,
    private _snackBar: MatSnackBar,
    private _router:Router) {
    this.form=this.fb.group({
      usuario:['',Validators.required],
      password:['',Validators.required],
    });

  }

ingresar(){
//console.log(this.form)
const usuario = this.form.value.usuario;
const password = this.form.value.password;
this.loginUser(usuario,password);
//if(usuario=='admin' && password=='123'){
//this.fakeLoading()
}

loginUser(usuario,password){
  event.preventDefault();
  if(usuario){
        this.api.loginUser(usuario,password).subscribe(data=>{
          if(data['rows']==1) {
            console.log(data['rows']);
            localStorage.removeItem("currentId");
            localStorage.removeItem("currentUser");
            localStorage.removeItem("currentNombre");
            localStorage.removeItem("currentAvatar");
            localStorage.removeItem("currentEmpresa");
            sessionStorage.removeItem("hashsession");
            localStorage.setItem("currentId",data['data'][0]['id']);
            localStorage.setItem("currentUser",data['data'][0]['nombre']);
            localStorage.setItem("currentNombre",data['data'][0]['nombre']);
            localStorage.setItem("currentAvatar",data['data'][0]['avatar']);
            localStorage.setItem("currentEmpresa",data['data'][0]['nombre']);
            sessionStorage.setItem("hashsession",data['data'][0]['hash']);
            (data['data'][0]['nombre']=="admin" || data['data'][0]['nombre']=="comercial" || data['data'][0]['nombre']=="logistica") ? this._router.navigate(['dashboard']): this._router.navigate(['ventas']);
            //this.router.navigate(['dash/reportes']);

          }else{

            this.error_user = true;
            this.error();
            console.log(this.error_user)
          }

        });
  }
//this.router.navigate(['dash']);
}



fakeLoading(){
this.loading=true;
setTimeout(() => {
    this._router.navigate(['ventas'])
  //this.loading=false;
}, 1500);


}

error(){
this._snackBar.open('Usuario o contraseña son inválidos','OK',{duration:3000,horizontalPosition:'center',verticalPosition:'top'});

}

  ngOnInit(): void {
  }

}
