import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgotpassword',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.scss'
})
export class ForgotpasswordComponent implements OnInit{
  forgotPasswordForm!: FormGroup;
  constructor(private router: Router) {}




  ngOnInit(): void {
    this.forgotPasswordForm = new FormGroup({
      email: new FormControl(''),

    })
  }

  forgotSubmit(){

  }


  navigate(){
    this.router.navigate(['/authentication/login']);
  }

}

