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



// export function getHttpOptions(cookieService: CookieService) {
//     // Get the PHPSESSID from the cookies
//     const phpsessid = cookieService.get('PHPSESSID');

//     // Set the headers
//     const headers = new HttpHeaders({
//         'Content-Type': 'application/json',  // Use 'application/json' for JSON payload
//     });

//     // If PHPSESSID is required, you can include it in the headers or cookies
//     if (phpsessid) {
//         headers.append('Cookie', `PHPSESSID=${phpsessid}`);
//     }

//     return { headers };
// }
