import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/Login/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']

})
export class AppSideLoginComponent implements OnInit {

  loginForm!: FormGroup;

  constructor(private router: Router,
    private loginservice: LoginService,
    private cookieService: CookieService,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      email: new FormControl(''),
      pwd: new FormControl(''),
    })
  }

  // navigate(){
  //   this.router.navigate(['/authentication/register']);
  // }

  navigate(){
    this.router.navigate(['/authentication/forgotPassword']);
  }

  loginUser() {
    const data = this.loginForm.value;

    this.loginservice.userLogin(data).subscribe(
      (response: any) => {
        const res = response[0];
        if (res.status == 200) {
          this.toastr.success(res.msg || 'Logged In Successfully');

          this.cookieService.set('userId', res.user.id,30);
          this.cookieService.set('userName', res.user.name,30);
          this.cookieService.set('userType', res.user.user_type,30);
          this.cookieService.set('token', res.user.api_token,30);

          localStorage.setItem('userToken', 'LoggedIn');

          this.router.navigate(['/dashboard']);
        }else{
          this.toastr.error('Invalid Credentials');
        }
      },
      (error: any) => {
        this.toastr.error(error.statusText);
      }
    );
  }

}
