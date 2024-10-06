import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { apiUrl } from 'src/utills/constants';
import { getHttpOptions } from 'src/utills/http-utils';
@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }


  getCurrentStock(data: any) {
    const httpOptions = getHttpOptions(this.cookieService);

    return this.http.post(`${apiUrl}/API/currentstock.php`,data,httpOptions);
  }



}


