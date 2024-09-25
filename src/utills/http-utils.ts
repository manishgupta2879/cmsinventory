import { HttpHeaders } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';

export function getHttpOptions(cookieService: CookieService) {
    // Get the PHPSESSID from the cookies
    const phpsessid = cookieService.get('PHPSESSID');

    // Return the necessary headers including the PHPSESSID and content type
    return {
        headers: new HttpHeaders({
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': `PHPSESSID=${phpsessid}`  // Dynamically getting the PHPSESSID from the cookie
        })
    };
}
