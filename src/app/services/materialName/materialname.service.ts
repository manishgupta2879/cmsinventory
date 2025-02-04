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

    return this.http.post(`${apiUrl}/stocksightapi/mitem.php`,data,httpOptions);
  }


  getMaterialName(data: any) {
    const httpOptions = getHttpOptions(this.cookieService);

    return this.http.post(`${apiUrl}/stocksightapi/mitem.php`,data,httpOptions);
  }

  updateMaterialName(data: any) {
    const httpOptions = getHttpOptions(this.cookieService);

    return this.http.post(`${apiUrl}/stocksightapi/mitem.php`,data,httpOptions);
  }

  DetleteMaterialName(data: any) {
    const httpOptions = getHttpOptions(this.cookieService);

    return this.http.post(`${apiUrl}/stocksightapi/mitem.php`,data,httpOptions);
  }

  materialNamecsv(data:any){
    return this.http.post(`${apiUrl}/stocksightapi/bulk_item_upload.php`,data);
  }

  getMaterialNameByGroup(data: any) {
    const httpOptions = getHttpOptions(this.cookieService);

    return this.http.post(`${apiUrl}/stocksightapi/mgroup-item.php`,data,httpOptions);
  }

  createInward(data:any){
    const httpOptions = getHttpOptions(this.cookieService);

    return this.http.post(`${apiUrl}stocksightapi/inwardoutward.php`,data,httpOptions);
  }



}




