import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class authguard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = !!localStorage.getItem('userToken'); // Check if token exists
    if (!isLoggedIn) {
      this.router.navigate(['/authentication/login']); // Redirect to login
      return false; // Block access to the route
    }
    return true; // Allow access if logged in
  }
}
