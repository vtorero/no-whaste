import {Component, OnInit} from '@angular/core';
import {DataService} from './data.service';
import {StrategyService} from './strategy.service';

@Component({
  selector: 'app-estrategia',
  templateUrl: './estrategia.component.html',
  styleUrls: ['./estrategia.component.css'],
})
export class EstrategiaComponent implements OnInit {
  data: any;
  strategies: any[] = [];
  hasEffectiveStrategies: boolean = false;

  constructor(
    private dataService: DataService,
    private strategyService: StrategyService
  ) {}

  ngOnInit(): void {
    this.dataService.fetchData().subscribe(
      (data) => {
        // Verificación de que los datos contengan los productos
        if (data && data.productos) {
          this.data = {
            wastes: data.waste,
            sales: data.sales,
            demands: data.demands,
            offers: data.offers,
            products: data.productos,
            season: data.season,
            categories: data.categorias,
            subCategories: data.subCategorias,
          };

          this.strategies = this.strategyService
            .recommendStrategies(this.data)
            .filter((strategy) => strategy.improvementPercentage >= 10);
          this.hasEffectiveStrategies = this.strategies.length > 0;
        } else {
          console.error('Los datos no contienen productos');
        }
      },
      (error) => {
        console.error('Error fetching data:', error);
      }
    );
  }
}
