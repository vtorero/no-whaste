import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Global} from 'app/global';
@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private apiVentasTotal = Global.BASE_API_URL + 'api.php/ventas/total';
  private apiOfertaTotal = Global.BASE_API_URL + 'api.php/oferta/total';
  private apiVentasSemana = Global.BASE_API_URL + 'api.php/ventas-semana/total';
  private apiVentasMes = Global.BASE_API_URL + 'api.php/ventas-mes/total';

  constructor(private http: HttpClient) {}

  getTotalVentas(): Observable<any> {
    return this.http.get<any>(this.apiVentasTotal);
  }
  getTotalOferta(): Observable<any> {
    return this.http.get<any>(this.apiOfertaTotal);
  }
  getVentasSemana(): Observable<any> {
    return this.http.get<any>(this.apiVentasSemana);
  }
  getVentasPorMes(): Observable<any> {
    return this.http.get(this.apiVentasMes);
  }
}
