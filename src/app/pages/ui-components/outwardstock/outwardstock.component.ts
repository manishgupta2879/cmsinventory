import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-outwardstock',
  standalone: false,
  templateUrl: './outwardstock.component.html',
  styleUrl: './outwardstock.component.scss'
})
export class OutwardstockComponent implements OnInit {

  outwardForm!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.outwardForm = new FormGroup({
      materialgroup: new FormControl(''),
      materialname: new FormControl(''),
      transdate: new FormControl(''),
      quantity: new FormControl(''),
      orderprocess: new FormControl(''),
    })
  }

}
