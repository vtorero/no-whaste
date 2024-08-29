import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import { AccesosComponent } from '../../login/accesos/accesos.component';
import { ProductosComponent } from '../../inventarios/productos/productos.component';
import { SeguridadComponent } from '../../seguridad/seguridad/seguridad.component';
import { UsuarioComponent } from '../../seguridad/usuario/usuario.component';
import { SucursalesComponent } from '../../seguridad/sucursales/sucursales.component';
import { VentasComponent } from '../../ventas/ventas.component';
import { ListadoComponent } from '../../productos/listado/listado.component';
import { HomeComponent } from 'app/productos/home/home.component';
import { InventariosComponent } from '../../productos/inventarios/inventarios.component';
import { cp } from 'fs';
import { ComparaModelosComponent } from '../../compara-modelos/compara-modelos.component';
import { RedneuronalComponent } from '../../comparar-modelos/redneuronal/redneuronal.component';
import { RegresionMultipleComponent } from '../../regresion-multiple/regresion-multiple.component';
import { PorProductoComponent } from '../../prediccion/por-producto/por-producto.component';
import path from 'path';
import { Component } from '@angular/core';
import { LinealMultipleComponent } from '../../compara-modelos/lineal-multiple/lineal-multiple.component';
import { ModeloClasificacionComponent } from '../../compara-modelos/modelo-clasificacion/modelo-clasificacion.component';
import { LinealSimpleComponent } from '../../compara-modelos/lineal-simple/lineal-simple.component';
import { MermasComponent } from 'app/prediccion/mermas/mermas.component';
import { ReduccionComponent } from 'app/prediccion/reduccion/reduccion.component';
import { EstrategiaComponent } from 'app/prediccion/estrategia/estrategia.component';
import { ProyeccionComponent } from 'app/prediccion/proyeccion/proyeccion.component';
import { ComprasComponent } from '../../compras/compras.component';

export const AdminLayoutRoutes: Routes = [
    // {
    //   path: '',
    //   children: [ {
    //     path: 'dashboard',
    //     component: DashboardComponent
    // }]}, {
    // path: '',
    // children: [ {
    //   path: 'userprofile',
    //   component: UserProfileComponent
    // }]
    // }, {
    //   path: '',
    //   children: [ {
    //     path: 'icons',
    //     component: IconsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'notifications',
    //         component: NotificationsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'maps',
    //         component: MapsComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'typography',
    //         component: TypographyComponent
    //     }]
    // }, {
    //     path: '',
    //     children: [ {
    //         path: 'upgrade',
    //         component: UpgradeComponent
    //     }]
    // }
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'comparar',
    children:[
        {path:'main',component:LinealMultipleComponent},
        {path:'lineal-multiple',component:LinealMultipleComponent},
        {path:'modelo-clasificacion',component:ModeloClasificacionComponent},
        {path:'lineal-simple',component:LinealSimpleComponent},
    ] },
    { path: 'redneuronal',  component: RedneuronalComponent },
    { path: 'regresion-multiple',  component: RegresionMultipleComponent },
    { path: 'ventas',          component: VentasComponent },
    {path:'productos/listado', component:ProductosComponent},
    {path:'productos/inventario', component:InventariosComponent},
    {path:'productos/compras',component:ComprasComponent},
    {path:'productos',         component:HomeComponent},
    { path: 'seguridad',       component: UsuarioComponent },
    { path: 'usuarios',        component: UsuarioComponent },
    { path: 'sucursales',      component: SucursalesComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'table-list',     component: TableListComponent },
    { path: 'typography',     component: TypographyComponent },
    { path: 'icons',          component: IconsComponent },
    { path: 'maps',           component: MapsComponent },
    { path: 'notifications',  component: NotificationsComponent },
    { path: 'upgrade',        component: UpgradeComponent },
    {path:'prediccion-producto',component:PorProductoComponent},
    {path:'prediccion',
    children:[
        {path:'mermas',component:MermasComponent},
        {path:'reduccion',component:ReduccionComponent},
        {path:'estrategias',component:EstrategiaComponent},
        {path:'proyeccion',component:ProyeccionComponent}
    ]
    }
];
