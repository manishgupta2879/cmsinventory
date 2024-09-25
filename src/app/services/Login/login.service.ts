import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { apiUrl } from 'src/utills/constants';
import { getHttpOptions } from 'src/utills/http-utils';  // Assumes you have a utility for handling headers

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  // -----------------------------User Login API---------------------------------------
  userLogin(data: any) {
    // Get headers including the PHPSESSID cookie and other necessary options
    const httpOptions = getHttpOptions(this.cookieService);

    // Make the POST request to the login API endpoint
    return this.http.post(`${apiUrl}/API/login.php`, data, httpOptions);
  }
}
