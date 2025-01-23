import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/services/Login/login.service';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.scss'
})
export class ForgotpasswordComponent implements OnInit{
  forgotPasswordForm!: FormGroup;
  constructor(private router: Router,
   private loginservice: LoginService,
            private toastr: ToastrService

  ) {}




  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl(''),

    })
  }


  forgotSubmit() {
    const data = this.forgotPasswordForm.value;
    const formData = new FormData();
    formData.append('email', this.forgotPasswordForm.get('email')?.value);


    this.loginservice.forgotPassword(formData).subscribe(
      (response: any) => {
        const res = response;
        if (res.status == 'success') {
          this.toastr.success(res?.data?.msg);
          this.forgotPasswordForm.reset();


        }else{
          this.toastr.error('Invalid email address');
        }
      },
      (error: any) => {
        this.toastr.error(error.statusText);
      }
    );
  }


  navigate(){
    this.router.navigate(['/authentication/login']);
  }

}

