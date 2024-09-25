import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-materialname',
  standalone: false,
  templateUrl: './materialname.component.html',
  styleUrl: './materialname.component.scss'
})
export class MaterialnameComponent implements OnInit {
  materialName!: FormGroup;
  constructor() { }

  ngOnInit(): void {
    this.materialName = new FormGroup({
      materialgroup: new FormControl(''),
      materialname: new FormControl(''),
      uom: new FormControl(''),
    })
  }

}
