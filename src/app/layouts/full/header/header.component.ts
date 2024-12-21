import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleMobileFilterNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  showFiller = false;

  constructor(public dialog: MatDialog,
    private route: Router,
        private cookieService: CookieService
  ) { }

  logout() {
    // localStorage.removeItem('userToken');

    this.cookieService.delete('userId');
    this.cookieService.delete('userName');
    this.cookieService.delete('userType');
    this.cookieService.delete('token');
    this.route.navigate(['/authentication/login']); // Navigate to the login page
  }
}
