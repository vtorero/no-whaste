import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Global} from 'app/global';
@Injectable({
  providedIn: 'root',
})
export class InventarioService {
  private apiUrl = Global.BASE_API_URL + '/api.php/mermas/total';
  private apiMermasSemana = Global.BASE_API_URL + '/api.php/mermas-semana/total';

  constructor(private http: HttpClient) {}

  getTotalMermas(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }
  getTotalMermasSemana(): Observable<any> {
    return this.http.get<any>(this.apiMermasSemana );
  }
}
