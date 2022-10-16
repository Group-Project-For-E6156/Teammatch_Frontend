import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  // For deciding which form to be displayed
  signIn: Boolean = true;
  logIn: Boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.signIn = true;
    this.logIn = false;
  }

  changeForm(): void {
    this.signIn = !this.signIn;
    this.logIn = !this.logIn;
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form")
    if(registerForm != null && loginForm != null) {
      if (this.signIn) {
        registerForm.style.display = "block";
        loginForm.style.display = "none";
      } else {
        registerForm.style.display = "none";
        loginForm.style.display = "block";
      }
    }
  }

}
