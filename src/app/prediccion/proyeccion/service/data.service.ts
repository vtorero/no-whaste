import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Global} from 'app/global';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private urlData = Global.BASE_API_URL + 'data.php/api';

  constructor(private http: HttpClient) {}

  fetchData(): Observable<any> {
    return this.http.get(this.urlData);
  }
}
