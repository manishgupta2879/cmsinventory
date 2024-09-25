import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-inwardstock',
  standalone: false,
  templateUrl: './inwardstock.component.html',
  styleUrl: './inwardstock.component.scss'
})
export class InwardstockComponent implements OnInit {
  inwardForm!: FormGroup;

  constructor() { }

  ngOnInit(): void {
    this.inwardForm = new FormGroup({
      materialgroup: new FormControl(''),
      materialname: new FormControl(''),
      invoice: new FormControl(''),
      quantity: new FormControl(''),
      invoicedate: new FormControl(''),
    })
  }

}
