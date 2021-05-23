import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false;
  userEmail = null;
  private authListenerSub: Subscription;
  private userEmailListenerSub: Subscription;

  constructor(private authService: AuthService, private router: Router) {

  }
  ngOnInit() {
    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authListenerSub = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      this.userIsAuthenticated = isAuthenticated;
    });

    this.userEmailListenerSub = this.authService.getUserEmailListener()
    .subscribe(userEmail => {
      this.userEmail = userEmail;
    });

  }
  ngOnDestroy() {
    
  }
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/'])
  }
}
