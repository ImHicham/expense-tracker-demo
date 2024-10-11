import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ApiService } from './services/api-client.service';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { AuthGuard } from './auth/auth.guard';
import { Location } from '@angular/common';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HttpClientModule, RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthService, ApiService, AuthGuard],
})
export class AppComponent implements OnInit {
  isLoggedIn = false;
  canGoBack: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd)) // Filter only NavigationEnd events
      .subscribe(() => {
        this.isLoggedIn = this.authService.isLoggedIn(); // Check if user is logged in
        this.checkCanGoBack(); // Check if we can go back after each navigation
      });
  }

  logout(): void {
    this.authService.logout();
    window.location.reload();
  }

  goBack(): void {
    this.location.back();
  }

  checkCanGoBack(): void {
    this.canGoBack = !(this.router.url === '/');
  }
}
