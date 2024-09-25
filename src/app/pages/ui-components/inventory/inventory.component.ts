import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-inventory',
  standalone: false,
  templateUrl: './inventory.component.html',
  styleUrl: './inventory.component.scss'
})
export class InventoryComponent implements OnInit {
  selectedOption: string | null = null; 

  constructor() { }

  ngOnInit(): void {

  }

  onSelectionChange(option: string) {
    this.selectedOption = option;
  }
}
