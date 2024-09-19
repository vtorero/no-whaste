import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Global} from 'app/global';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private apiUrl = Global.BASE_API_URL + 'data.php/api';

  constructor(private http: HttpClient) {}

  fetchDataFromService(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
