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

    return this.http.post(`${apiUrl}/API/login.php`, data, httpOptions);
  }


  forgotPassword(data: any) {

    return this.http.post(`${apiUrl}/API/forgot_password.php`, data);
  }

  resetPassword(data: any) {

    return this.http.post(`${apiUrl}/API/reset_password.php`, data);
  }
}
