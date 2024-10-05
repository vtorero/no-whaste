import {Component, OnInit} from '@angular/core';
import {ServicesService} from '../../services.service';

declare const $: any;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  child: Child[];
  redirectTo?: string;
  pathMatch?: string;
}

declare interface Child {
  pat: string;
  tit: string;
  icn: string;
  cls: string;
}
export const ROUTES: RouteInfo[] = [
  {
    path: '/dashboard',
    title: 'Reportes',
    icon: 'dashboard',
    class: '',
    child: [],
  },
  {path: '/ventas',
  title: 'Ventas',
  icon: 'person', class: '',
  child: []
},
 {
    path: '/comparar/main',
    title: 'Modelos Predictivos',
    icon: 'dashboard',
    class: '',
    child: [
      {
        pat: '/comparar/lineal-multiple',
        tit: 'Lineal Multiple',
        icn: 'bubble_chart',
        cls: 'library_books',
      },
      {
        pat: '/comparar/modelo-clasificacion',
        tit: 'Modelo de Clasificación',
        icn: 'bubble_chart',
        cls: 'library_books',
      },
      {
        pat: '/comparar/lineal-simple',
        tit: 'Regresión Lineal simple',
        icn: 'bubble_chart',
        cls: 'library_books',
      },
    ],
  },
  /*{ path: '/redneuronal', title: 'Red Neuronal',  icon:'dashboard', class: '',child:[]},*/
  {
    path: '/estadisticas',
    title: 'Estadisticas',
    icon: 'dashboard',
    redirectTo: '/estadisticas/mermas',
    pathMatch: 'full',
    class: '',
    child: [
      {
        pat: '/estadisticas/mermas',
        tit: 'Mermas',
        icn: 'bubble_chart',
        cls: 'library_books',
      },
      {
        pat: '/estadisticas/reduccion',
        tit: 'Reducción',
        icn: 'bubble_chart',
        cls: 'library_books',
      },
      {
        pat: '/estadisticas/estrategias',
        tit: 'Estrategias',
        icn: 'bubble_chart',
        cls: 'library_books',
      },
      {
        pat: '/estadisticas/proyeccion',
        tit: 'Proyección',
        icn: 'bubble_chart',
        cls: 'library_books',
      },
      {
        pat: '/estadisticas/oferta-demanda',
        tit: 'Oferta y Demanda',
        icn: 'bubble_chart',
        cls: 'library_books',
      },
    ],
  },
  {
    path: '/productos',
    title: 'Productos',
    icon: 'library_books',
    class: '',
    child: [
      {
        pat: '/productos/listado',
        tit: 'Listado',
        icn: 'bubble_chart',
        cls: 'library_books',
      },
      {
        pat: '/productos/inventario',
        tit: 'Inventarios',
        icn: 'bubble_chart',
        cls: 'library_books',
      },
      {
        pat: '/productos/compras',
        tit: 'Compras',
        icn: 'bubble_chart',
        cls: 'library_books',
      },
    ],
  },
  {
    path: '/seguridad',
    title: 'Seguridad',
    icon: 'notifications',
    class: '',
    child: [{pat: '/usuarios', tit: 'Usuarios', icn: 'person', cls: 'person'}],
  },
];

export const ROUTESUSER: RouteInfo[] = [
  {path: '/ventas', title: 'Ventas', icon: 'person', class: '', child: []},

  {
    path: '/productos',
    title: 'Productos',
    icon: 'library_books',
    class: '',
    child: [
      {
        pat: '/productos/listado',
        tit: 'Listado',
        icn: 'bubble_chart',
        cls: 'library_books',
      },
      {
        pat: '/productos/inventario',
        tit: 'Inventarios',
        icn: 'bubble_chart',
        cls: 'library_books',
      },
      {
        pat: '/productos/compras',
        tit: 'Compras',
        icn: 'bubble_chart',
        cls: 'library_books',
      },
    ],
  },

];


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  menuItems: any[];
  menuItemsUser: any[];
  currentname:string='';

  constructor(private _serviceRutas: ServicesService) {}

  cargarRuta(ruta: string) {
    console.log('ruta Cargada');
    this._serviceRutas.add(ruta);
  }

  ngOnInit() {
    this.currentname = localStorage.getItem("currentNombre");
    this.menuItems = ROUTES.filter((menuItem) => menuItem);
    this.menuItemsUser = ROUTESUSER.filter((menuItemU) => menuItemU);
  }
  isMobileMenu() {
    if ($(window).width() > 991) {
      return false;
    }
    return true;
  }
}
