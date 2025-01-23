import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/Login/login.service';

@Component({
    selector: 'app-resetpassword',
    templateUrl: './resetpassword.component.html',
    styleUrl: './resetpassword.component.scss'
  })
export class ResetpasswordComponent implements OnInit {

  resetForm!: FormGroup;
  token: string | null = null;

  constructor(private router: Router,
    private loginservice: LoginService,
    private cookieService: CookieService,
    private toastr: ToastrService,
    private route: ActivatedRoute

  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.token = params['token'];
    });

    this.resetForm = new FormGroup({
      token: new FormControl(this.token),
      new_password: new FormControl(''),
      cfrm_password: new FormControl(''),
    })
  }


  navigate(){
    this.router.navigate(['/authentication/forgotPassword']);
  }

  resetSubmit() {
    const data = this.resetForm.value;
    const formData = new FormData();
    formData.append('token', this.resetForm.get('token')?.value);
    formData.append('new_password', this.resetForm.get('new_password')?.value);
    if (data.new_password !== data.cfrm_password) {
      this.toastr.error('Passwords and Confirm Password do not match');
      return;
    }


    this.loginservice.resetPassword(formData).subscribe(
      (response: any) => {
        const res = response;
        if (res.status == 'success') {
          this.toastr.success(res.msg);
          this.resetForm.reset();


          this.router.navigate(['/authentication/login']);

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
