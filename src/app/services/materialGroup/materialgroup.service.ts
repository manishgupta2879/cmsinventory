import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { apiUrl } from 'src/utills/constants';
import { getHttpOptions } from 'src/utills/http-utils';

@Injectable({
  providedIn: 'root'
})
export class MaterialgroupService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  userLogin(data: any) {
    // Get headers including the PHPSESSID cookie and other necessary options
    const httpOptions = getHttpOptions(this.cookieService);

    // Make the POST request to the API endpoint
    return this.http.post(`${apiUrl}/API/mgroup.php`, data, httpOptions);
  }
}
