import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private apiUrl = 'https://franz.kvconsult.com/fapi-dev/api.php/ventas/total';

  constructor(private http: HttpClient) {}

  getTotalVentas(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
