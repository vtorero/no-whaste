import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Global} from 'app/global';
@Injectable({
  providedIn: 'root',
})
export class VentasService {
  private apiUrl = Global.BASE_API_URL + '/api.php/ventas/total';

  constructor(private http: HttpClient) {}

  getTotalVentas(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
}
