import {Component, OnInit} from '@angular/core';
import { NgForm } from "@angular/forms";
import { Subscription } from 'rxjs';

import { AuthService} from '../auth.service';

@Component({
    templateUrl: "./signup.component.html",
    styleUrls: ["./signup.component.css"]
  })
export class SignupComponent implements OnInit {
    isLoading = false;
    private authListenerSub: Subscription;
    constructor(public authService: AuthService) {}
    ngOnInit() {
      this.authListenerSub = this.authService.getAuthStatusListener().subscribe(
        authStatus => {
          this.isLoading = false;
        }
      );
    }
    onSignup(form: NgForm) {
      console.log(form.value);
      if (form.invalid) {
        return;
      }
      this.isLoading = true;
      this.authService.createUser(form.value.email, form.value.password)
    }
    ngOnDestroy() {

    }
  }
  