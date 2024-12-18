// import { Component, OnInit } from '@angular/core';
// import { navItems } from './sidebar-data';
// import { NavService } from '../../../services/nav.service';

// @Component({
//   selector: 'app-sidebar',
//   templateUrl: './sidebar.component.html',
// })
// export class SidebarComponent implements OnInit {
//   navItems = navItems;

//   constructor(public navService: NavService) {}

//   ngOnInit(): void {}
// }


import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  constructor(
    public route: Router
  ) {}

  ngOnInit(): void {
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
    console.log("navigation url is ",url)
    this.route.navigate([url]);

  }
}
