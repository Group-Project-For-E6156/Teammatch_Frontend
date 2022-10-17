import { Component, OnInit } from '@angular/core';
import { MessageService } from "../message.service";
import { AccountService } from "../account.service";
import {Account} from "./account";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  // For deciding which form to be displayed
  signUp: boolean = true;
  logIn: boolean = false;
  messageDict = {
    "TO_LOGIN": "Please input your account uni and password!",
    "TO_REGISTER": "Required fields are: uni & firstname & lastname & password & email address!",
    "MISSING_INPUT": "You should have uni & firstname & lastname & password & email address filled!",
    "SUCCESS": "Thanks for the registration! You will receive an email to verify your account!",
    "FAILED": "FAILED IN REGISTRATION:",
    "MISSING_INPUT2": "You should have uni & password filled!",
  };

  // Fields in forms
  uni: string = "";
  first_name: string = "";
  middle_name: string = "";
  last_name: string = "";
  password: string = "";
  email_address: string = "";


  constructor(
    public messageService: MessageService,
    public accountService: AccountService,
  ) {}


  ngOnInit(): void {
    let message = this.getMessage("TO_REGISTER");
    this.messageService.update(message, "INFO");
  }

  /** Use message type to get message from message dict - only one output */
  getMessage(type: string): string {
    return Object.entries(this.messageDict)
      .filter(item => item[0] == type)
      .map(item => item[1])[0];
  }

  clearFields(): void {
    this.uni= "";
    this.first_name = "";
    this.middle_name = "";
    this.last_name = "";
    this.password = "";
    this.email_address = "";
  }

  changeForm(changeMessage: boolean = true): void {
    if(changeMessage) {
      this.messageService.clear();
    }
    this.clearFields();
    this.signUp = !this.signUp;
    this.logIn = !this.logIn;
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form")
    let message = "";
    if(registerForm != null && loginForm != null) {
      if (this.signUp) {
        message = this.getMessage("TO_REGISTER")
        registerForm.style.display = "block";
        loginForm.style.display = "none";
      } else {
        message = this.getMessage("TO_LOGIN")
        registerForm.style.display = "none";
        loginForm.style.display = "block";
      }
    }
    console.log(message);
    if(changeMessage) {
      this.messageService.update(message, "INFO");
    }
  }

  /** createAccount:
   * 1. Check if all necessary inputs are filled -> if not, display warning message
   * 2. Connect to BE service and create a new Account: Show Result Message
   * */
  createAccount(): void {
    let curMessage = "";
    console.log("You click on create account!")
    if(this.uni === "" || this.first_name === "" || this.last_name === "" || this.password === "" || this.email_address === "") {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }

    this.accountService.addAccount(
      this.uni, this.email_address, this.password, this.last_name, this.first_name, this.middle_name
    ).subscribe((data) => {
        console.log(this.accountService.addAccountSuccess);
        if(this.accountService.addAccountSuccess) {
          this.changeForm(false);
        }
      }
    );
  }

  /** logIn:
   * 1. Check if all necessary inputs are filled -> if not, display warning message
   * 2. Connect to BE service and create a new Account: Show Result Message
   * */
  logIntoAccount(): void {
    let curMessage = "";
    console.log("You click on login account!")
    if(this.uni === "" || this.password === "") {
      curMessage = this.getMessage("MISSING_INPUT2");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.accountService.getAccount(this.uni).subscribe(
      (account) => {
        if(account && account.password === this.password) {
          this.messageService.update("Successfully log in!", "SUCCESS");
        } else {
          this.messageService.update("Failed Login: Check your UNI/password!", "DANGER");
        }
      }
    )
  }
}
