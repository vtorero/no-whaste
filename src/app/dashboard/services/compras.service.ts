import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Global} from 'app/global';
@Injectable({
  providedIn: 'root',
})
export class ComprasService {
  private apiDemanda = Global.BASE_API_URL + 'api.php/demanda/total';
  private apiComprasTotal = Global.BASE_API_URL + 'api.php/compras-hora/total';
  private apiComprasDia = Global.BASE_API_URL + 'api.php/compras-dia/total';

  constructor(private http: HttpClient) {}

  getTotalDemanda(): Observable<any> {
    return this.http.get<any>(this.apiDemanda);
  }

  getComprasPorHora(): Observable<any> {
    return this.http.get(this.apiComprasTotal);
  }

  getComprasPorDia(): Observable<any> {
    return this.http.get(this.apiComprasDia);
  }
}
