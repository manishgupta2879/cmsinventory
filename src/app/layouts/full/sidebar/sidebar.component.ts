


import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SharedServiceService } from 'src/app/shared-service.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit{
  showToggleIcon: boolean = true;

  constructor(
    public route: Router,
    private sharedService: SharedServiceService
  ) {}

  ngOnInit(): void {


    this.sharedService.showToggleIcon$.subscribe((value: boolean) => {
      this.showToggleIcon = value; // Update the local value when it changes
    });
    // Toggle Sidebar
    const menuToggle = document.getElementById('menu-toggle');
    const sidebarWrapper = document.getElementById('wrapper');

    if (menuToggle && sidebarWrapper) {
      menuToggle.addEventListener('click', () => {
        sidebarWrapper.classList.toggle('toggled');
      });
    }
  }
  navitage(url:any){
    this.route.navigate([url]);

  }
}
