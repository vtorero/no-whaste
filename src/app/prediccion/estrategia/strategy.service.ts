import {Injectable} from '@angular/core';
import {v4 as uuidv4} from 'uuid';
import {UtilsService} from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class StrategyService {
  constructor(private utilsService: UtilsService) {}

  createStrategy(
    id: string,
    name: string,
    products: any[],
    beforeValue: number,
    afterValue: number,
    categories: any[],
    subCategories: any[]
  ) {
    const effectivenessThreshold = 10;
    const improvementPercentage =
      this.utilsService.calculateImprovementPercentage(beforeValue, afterValue);
    const uniqueProducts = this.utilsService.filterUniqueProducts(products);

    return {
      id,
      name,
      products: uniqueProducts,
      improvementPercentage,
      effective: this.utilsService.isEffective(
        improvementPercentage,
        effectivenessThreshold
      ),
      categories,
      subCategories,
    };
  }

  getCategoriesAndSubCategories(filteredProducts: any[], data: any) {
    const categories = [];
    const subCategories = [];

    filteredProducts.forEach((product) => {
      const index = data.products.indexOf(product);

      // Asegurarnos de que el índice es válido y existen tanto la categoría como la subcategoría
      if (index >= 0) {
        const category = data.categories[index];
        const subCategory = data.subCategories[index];

        // Validar que la categoría existe antes de acceder a sus propiedades
        if (category && !categories.some((cat) => cat.id === category.id)) {
          categories.push(category);
        }

        // Validar que la subcategoría existe antes de acceder a sus propiedades
        if (
          subCategory &&
          !subCategories.some((subCat) => subCat.id === subCategory.id)
        ) {
          subCategories.push(subCategory);
        }
      }
    });

    return {categories, subCategories};
  }

  filterProducts(
    data: any,
    filterFn: (data: any, product: any, i: number) => boolean
  ): any[] {
    return data.products.filter((product: any, i: number) =>
      filterFn(data, product, i)
    );
  }

  recommendStrategies(data: any): any[] {
    const strategies = [];

    const highDemandHighMarginProducts = this.filterProducts(
      data,
      (data, product, i) =>
        data.demands[i] > data.offers[i] && data.sales[i] > data.wastes[i]
    );
    const lowDemandLowMarginProducts = this.filterProducts(
      data,
      (data, product, i) =>
        data.demands[i] < data.offers[i] && data.sales[i] > data.wastes[i]
    );
    const highWasteProducts = this.filterProducts(
      data,
      (data, product, i) => data.wastes[i] > data.sales[i] * 0.1
    );
    const highDemandLowOfferProducts = this.filterProducts(
      data,
      (data, product, i) => data.demands[i] > data.offers[i] * 1.5
    );
    const lowSalesHighWasteProducts = this.filterProducts(
      data,
      (data, product, i) =>
        data.sales[i] <
          data.sales.reduce((a, b) => a + b) / data.sales.length &&
        data.wastes[i] >
          data.wastes.reduce((a, b) => a + b) / data.wastes.length
    );

    const calculateValue = (products: any[], data: any) =>
      products.reduce((acc, product) => {
        const index = data.products.indexOf(product);
        if (index >= 0) {
          acc += data.sales[index] - data.wastes[index];
        }
        return acc;
      }, 0);

    const {
      categories: highDemandHighMarginCategories,
      subCategories: highDemandHighMarginSubCategories,
    } = this.getCategoriesAndSubCategories(highDemandHighMarginProducts, data);

    strategies.push(
      this.createStrategy(
        uuidv4(),
        'Aumentar oferta de productos con alta demanda y márgenes de ganancia',
        highDemandHighMarginProducts,
        calculateValue(highDemandHighMarginProducts, data),
        calculateValue(highDemandHighMarginProducts, data) * 1.2,
        highDemandHighMarginCategories,
        highDemandHighMarginSubCategories
      )
    );

    const {
      categories: lowDemandLowMarginCategories,
      subCategories: lowDemandLowMarginSubCategories,
    } = this.getCategoriesAndSubCategories(lowDemandLowMarginProducts, data);
    strategies.push(
      this.createStrategy(
        uuidv4(),
        'Reducir oferta de productos con baja demanda y bajos márgenes de ganancia',
        lowDemandLowMarginProducts,
        calculateValue(lowDemandLowMarginProducts, data),
        calculateValue(lowDemandLowMarginProducts, data) * 1.2,
        lowDemandLowMarginCategories,
        lowDemandLowMarginSubCategories
      )
    );

    const {
      categories: highWasteCategories,
      subCategories: highWasteSubCategories,
    } = this.getCategoriesAndSubCategories(highWasteProducts, data);
    strategies.push(
      this.createStrategy(
        uuidv4(),
        'Mejorar la calidad del producto para reducir las mermas',
        highWasteProducts,
        calculateValue(highWasteProducts, data),
        calculateValue(highWasteProducts, data) * 1.1,
        highWasteCategories,
        highWasteSubCategories
      )
    );

    const {
      categories: highDemandLowOfferCategories,
      subCategories: highDemandLowOfferSubCategories,
    } = this.getCategoriesAndSubCategories(highDemandLowOfferProducts, data);
    strategies.push(
      this.createStrategy(
        uuidv4(),
        'Promocionar productos con alta demanda y baja oferta',
        highDemandLowOfferProducts,
        calculateValue(highDemandLowOfferProducts, data),
        calculateValue(highDemandLowOfferProducts, data) * 1.3,
        highDemandLowOfferCategories,
        highDemandLowOfferSubCategories
      )
    );

    const {
      categories: lowSalesHighWasteCategories,
      subCategories: lowSalesHighWasteSubCategories,
    } = this.getCategoriesAndSubCategories(lowSalesHighWasteProducts, data);
    strategies.push(
      this.createStrategy(
        uuidv4(),
        'Eliminar productos con bajo rendimiento en ventas y Wastes altas',
        lowSalesHighWasteProducts,
        calculateValue(lowSalesHighWasteProducts, data),
        calculateValue(lowSalesHighWasteProducts, data) * 0.5,
        lowSalesHighWasteCategories,
        lowSalesHighWasteSubCategories
      )
    );

    return strategies;
  }
}
