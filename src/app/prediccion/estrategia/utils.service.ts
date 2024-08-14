import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  // Calculate the improvement percentage
  calculateImprovementPercentage(
    beforeValue: number,
    afterValue: number
  ): number {
    return ((afterValue - beforeValue) / beforeValue) * 100;
  }

  // Check if the strategy is effective based on the threshold
  isEffective(
    improvementPercentage: number,
    effectivenessThreshold: number
  ): boolean {
    return improvementPercentage >= effectivenessThreshold;
  }

  // Filter unique products based on their ID
  filterUniqueProducts(products: any[]): any[] {
    const uniqueProducts = [];
    const productIds = new Set();

    products.forEach((product) => {
      if (!productIds.has(product.id)) {
        uniqueProducts.push(product);
        productIds.add(product.id);
      }
    });

    return uniqueProducts;
  }
}
