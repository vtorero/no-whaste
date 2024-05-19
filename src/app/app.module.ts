import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ComponentsModule } from './components/components.module';
import { AppComponent } from './app.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { LoginModule } from './login/login.module';
import { SharedModule } from './components/shared/shared.module';
import { ProductosComponent } from './inventarios/productos/productos.component';
import { SeguridadComponent } from './seguridad/seguridad/seguridad.component';
import { UsuarioComponent } from './seguridad/usuario/usuario.component';
import { OpenDialogComponent } from './dialog/open-dialog/open-dialog.component';
import { SucursalesComponent } from './seguridad/sucursales/sucursales.component';
import { VentasComponent } from './ventas/ventas.component';
import { AgregarventaComponent } from './agregarventa/agregarventa.component';
import { EditarventaComponent } from './editarventa/editarventa.component';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { PaginatorEspañol } from './models/paginator-espanol';
import { ListadoComponent } from './productos/listado/listado.component';
import { HomeComponent } from './productos/home/home.component';
import { InventariosComponent } from './productos/inventarios/inventarios.component';
import { AgregarComponent } from './ventas/agregar/agregar.component';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { addproductoComponent } from './ventas/addproducto/addproducto.component';
import { EditarComponent } from './ventas/editar/editar.component';
import { ComparaModelosComponent } from './compara-modelos/compara-modelos.component';
import { RedneuronalComponent } from './comparar-modelos/redneuronal/redneuronal.component';
import { ProveedoresComponent } from './proveedores/proveedores.component';
import { RegresionMultipleComponent } from './regresion-multiple/regresion-multiple.component';
import { PorProductoComponent } from './prediccion/por-producto/por-producto.component';
import { LinealMultipleComponent } from './compara-modelos/lineal-multiple/lineal-multiple.component';
import { ModeloClasificacionComponent } from './compara-modelos/modelo-clasificacion/modelo-clasificacion.component';
import { LinealSimpleComponent } from './compara-modelos/lineal-simple/lineal-simple.component';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    RouterModule,
    AppRoutingModule,
    LoginModule,
    SharedModule,
    ComponentsModule,
    MatNativeDateModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatRadioModule,
    MatSelectModule,
    MatFormFieldModule,
    BrowserModule,
    CommonModule,
    

  ],
  declarations: [
    AppComponent,
     AdminLayoutComponent,
    ProductosComponent,
    SeguridadComponent,
    UsuarioComponent,
    OpenDialogComponent,
    SucursalesComponent,
    VentasComponent,
    AgregarventaComponent,
    EditarventaComponent,
    ListadoComponent,
    HomeComponent,
    InventariosComponent,
    AgregarComponent,
    addproductoComponent,
    EditarComponent,
    ComparaModelosComponent,
    RedneuronalComponent,
    ProveedoresComponent,
    RegresionMultipleComponent,
    PorProductoComponent,
    LinealMultipleComponent,
    ModeloClasificacionComponent,
    LinealSimpleComponent,
    
    
    ],
  providers: [{ provide: MatPaginatorIntl, useClass: PaginatorEspañol},{provide: MAT_DATE_LOCALE, useValue: 'pe-ES'}],
  bootstrap: [AppComponent]
})
export class AppModule { }
