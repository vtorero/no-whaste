import { Component, Inject, OnInit } from '@angular/core';
import { ApiService } from 'app/api.service';
import * as Chartist from 'chartist';


@Component({
  selector: 'app-por-producto',
  templateUrl: './por-producto.component.html',
  styleUrls: ['./por-producto.component.css']
})

export class PorProductoComponent implements OnInit {
  public selectedMoment = new Date();
  public selectedMoment2 = new Date();
  fec1= this.selectedMoment.toDateString().split(" ",4);
  fec2 = this.selectedMoment2.toDateString().split(" ",4);
  fecha1:string=this.fec1[2]+'-'+this.fec1[1]+'-'+this.fec1[3];
  fecha2:string=this.fec2[2]+'-'+this.fec2[1]+'-'+this.fec2[3];
  dataProducto:any;
  dataExistencias:any;
  dataArray:any;
codProducto:any
  constructor(private api:ApiService)
  {

  }

  ngOnInit() {
this.getProductos();

const dataDailySalesChart: any = {
  labels: ['1', '2', '3', '4', '5', '6', '7'],
  series: [
      [0, 0, 0, 0, 0, 0, 0]
  ]
};

const optionsDailySalesChart: any = {
  lineSmooth: Chartist.Interpolation.cardinal({
      tension: 0
  }),
  low: 0,
  high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
  chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
}

var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

this.startAnimationForLineChart(dailySalesChart);


  }

  enviarFechas(){
    var fec1 = this.selectedMoment.toDateString().split(" ",4);
    var fec2 = this.selectedMoment2.toDateString().split(" ",4);
    let ini=fec1[1]+fec1[2]+fec1[3];
    let fin=fec2[1]+fec2[2]+fec2[3];

    this.fecha1=fec1[2]+'-'+fec1[1]+'-'+fec1[3];;
    this.fecha2=fec2[2]+'-'+fec2[1]+'-'+fec2[3];;

    console.log(this.fecha1)
    console.log(this.fecha2)
    console.log(this.codProducto)
    this.api.getPrediccionProducto(this.codProducto,this.fecha1,this.fecha2)
    .subscribe(data=>{
     console.log("data",data);
     const dataDailySalesChart: any = {
      labels: data['fechas_pred'],
      series:[data['venta_real'],data['datosPrediccion']]

    };
console.log("datoss",dataDailySalesChart);
    const optionsDailySalesChart: any = {
      lineSmooth: Chartist.Interpolation.cardinal({
          tension: 0
      }),
      low: 1000,
      high: 10000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
      chartPadding: { top: 0, right: 0, bottom: 0, left: 0},
    }

    var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

    this.startAnimationForLineChart(dailySalesChart);
    })

  }




  startAnimationForLineChart(chart){
    let seq: any, delays: any, durations: any;
    seq = 0;
    delays = 80;
    durations = 500;

    chart.on('draw', function(data) {

      if(data.type === 'line' || data.type === 'area') {
        data.element.animate({
          d: {
            begin: 600,
            dur: 700,
            from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
            to: data.path.clone().stringify(),
            easing: Chartist.Svg.Easing.easeOutQuint
          },options: {
            tooltips: {
              enabled: false
            }
            }
        });
      } else if(data.type === 'point') {
            seq++;
            data.element.animate({
              opacity: {
                begin: seq * delays,
                dur: durations,
                from: 0,
                to: 1,
                easing: 'ease'
              }
            });
        }
    });

    seq = 0;
};



    getProductos(): void {
      console.log("carfaa")
      this.api.getApi('productos').subscribe(data => {
        if(data) {
          this.dataProducto = data;
        }
      } );
    }
    onKey(value) {
      this.dataArray= [];
      this.selectSearch(value);
    }

    selectSearch(value:string){
      this.api.getProductosSelect(value).subscribe(data => {
        if(data) {
          this.dataProducto = data;
        }
      } );

    }

    getProdExiste(id): void {
      this.api.getApi('inventarios/'+id).subscribe(data => {
        if(data) {
         this.dataExistencias=data;
        }
      });
    }

    handleProducto(id){
      this.getProdExiste(id);
    }

}
