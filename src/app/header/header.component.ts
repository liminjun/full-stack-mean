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
  private authListenerSub: Subscription;
  constructor(private authService: AuthService, private router: Router) {

  }
  ngOnInit() {
    this.authListenerSub = this.authService.getAuthStatusListener()
    .subscribe(isAuthenticated => {
      debugger
      this.userIsAuthenticated = isAuthenticated;
    })
  }
  ngOnDestroy() {
    
  }
  onLogout() {
    this.authService.logout();
    this.router.navigate(['/'])
  }
}
