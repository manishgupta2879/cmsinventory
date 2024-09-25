import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/Login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
})
export class AppSideLoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private router: Router,
    private loginservice: LoginService,
    private cookieService: CookieService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      pwd: new FormControl(''),
    })
  }

  loginUser() {
    const data = this.loginForm.value;

    this.loginservice.userLogin(data).subscribe(
      (response: any) => {
        // If response is an array, access the first element
        const res = response[0];
        if (res.status == 200) {
          // Show the success message from the API response
          this.toastr.success(res.msg || 'Logged In Successfully');

          // Save user data to cookies
          this.cookieService.set('userId', res.user.id);
          this.cookieService.set('userName', res.user.name);
          this.cookieService.set('userType', res.user.user_type);
          this.cookieService.set('token', res.user.api_token);

          // Store the login token in local storage
          localStorage.setItem('userToken', 'LoggedIn');

          // Navigate to the dashboard
          this.router.navigate(['/dashboard']);
        } else {
          // Handle cases where status is not 200
          this.toastr.error('Invalid Credentials');
        }
      },
      (error: any) => {
        // Log the error to console for debugging
        console.log('Error:', error);
        this.toastr.error(error.statusText);
      }
    );
  }

}
