import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { apiUrl } from 'src/utills/constants';
import { getHttpOptions } from 'src/utills/http-utils';

@Injectable({
  providedIn: 'root'
})
export class MaterialnameService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  createMaterialName(data: any) {
    const httpOptions = getHttpOptions(this.cookieService);

    return this.http.post(`${apiUrl}/API/mitem.php`,data,httpOptions);
  }


  getMaterialName(data: any) {
    const httpOptions = getHttpOptions(this.cookieService);

    return this.http.post(`${apiUrl}/API/mitem.php`,data,httpOptions);
  }

  updateMaterialName(data: any) {
    const httpOptions = getHttpOptions(this.cookieService);

    return this.http.post(`${apiUrl}/API/mitem.php`,data,httpOptions);
  }



}




