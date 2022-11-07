import { Component, OnInit } from '@angular/core';
import { MessageService } from "../message.service";
import { AccountService } from "../account.service";
import {StorageService} from "../storage.service";

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.css']
})
export class AccountComponent implements OnInit {
  messageDict = {
    "TO_LOGIN": "Please input your account uni and password!",
    "TO_REGISTER": "Required fields are: uni & firstname & lastname & password & email address!",
    "MISSING_INPUT_SIGNUP": "You should have uni & firstname & lastname & password & email address filled!",
    "SUCCESS": "Thanks for the registration! You will receive an email to verify your account!",
    "FAILED": "FAILED IN REGISTRATION:",
    "MISSING_INPUT_LOGIN": "You should have uni & password filled!",
    "MISSING_INPUT_PROFILE": "You should have timezone & major & gender filled!",
    "UPDATE_PROFILE": "Please update your personal profile here",
    "SUCCESS_UPDATE_PROFILE": "You have successfully updated your profile!",
  };

  // Fields in students forms
  uni: string = "";
  first_name: string = "";
  middle_name: string = "";
  last_name: string = "";
  password: string = "";
  email_address: string = "";

  // Fields in profile form
  timezone: string = "";
  major: string = "";
  gender: string = "";
  msg: string = "";

  // Fields to record current status
  isLoggedIn = false;

  constructor(
      public messageService: MessageService,
      public accountService: AccountService,
      public storageService: StorageService,
  ) {}


  ngOnInit(): void {
    let message = this.getMessage("TO_REGISTER");
    this.messageService.update(message, "INFO");
    if (this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      // direct to account profile page
      let user = this.storageService.getUser();
      this.uni = user.uni;
      this.first_name = user.first_name;
      this.last_name = user.last_name;
      this.email_address = user.email_address;
      console.log("Initialize loggedin", this.uni, this.first_name);
      this.changeForm(false, false, true);
    }
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

    this.timezone= "";
    this.major = "";
    this.gender = "";
    this.msg = "";
  }

  /**
   * Change form between login, sign-up, profile
   * @param toSignUp
   * @param toLogIn
   * @param toProfile
   * @param changeMessage
   */
  changeForm(toSignUp: boolean, toLogIn: boolean, toProfile: boolean, changeMessage: boolean = true): void {
    if(changeMessage) {
      this.messageService.clear();
    }
    if (!toProfile) {
      // After user successfully log in, we want to keep fields info
      this.clearFields();
    }
    const registerForm = document.getElementById("register-form");
    const loginForm = document.getElementById("login-form");
    const profileForm = document.getElementById("profile-form");
    let message = "";
    if(registerForm != null && loginForm != null && profileForm != null) {
      registerForm.style.display = "none";
      loginForm.style.display = "none";
      profileForm.style.display = "none";
      if (toSignUp) {
        message = this.getMessage("TO_REGISTER")
        registerForm.style.display = "block";
      } else if (toLogIn) {
        message = this.getMessage("TO_LOGIN")
        loginForm.style.display = "block";
      } else { // toProfile
        this.loadProfile();
        message = this.getMessage("UPDATE_PROFILE")
        profileForm.style.display = "block";
      }
    }
    console.log(message);
    if(changeMessage) {
      this.messageService.update(message, "INFO");
    }
  }

  /**
   * Load the student profile information
   */
  loadProfile(): void {
    this.accountService.getProfile(this.uni).subscribe(
        (profile) => {
          if(profile) {
            this.timezone = profile.timezone;
            this.gender = profile.gender;
            this.major = profile.major;
            this.msg = profile.personal_message;
          }
        }
    )
  }

  /** createAccount:
   * 1. Check if all necessary inputs are filled -> if not, display warning message
   * 2. Connect to BE service and create a new Account: Show Result Message
   * */
  createAccount(): void {
    let curMessage = "";
    console.log("You click on create account!")
    if(this.uni === "" || this.first_name === "" || this.last_name === "" || this.password === "" || this.email_address === "") {
      curMessage = this.getMessage("MISSING_INPUT_SIGNUP");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }

    this.accountService.addAccount(
        this.uni, this.email_address, this.password, this.last_name, this.first_name, this.middle_name
    ).subscribe((_) => {
          console.log(this.accountService.addAccountSuccess);
          if(this.accountService.addAccountSuccess) {
            this.changeForm(false, true, false, false);
          }
        }
    );
  }

  /** logIn:
   * 1. Check if all necessary inputs are filled -> if not, display warning message
   * 2. Connect to BE service and create a new Account: Show Result Message
   * 3. After successful login, change to profile form
   * */
  logIntoAccount(): void {
    let curMessage = "";
    console.log("You click on login account!")
    if(this.uni === "" || this.password === "") {
      curMessage = this.getMessage("MISSING_INPUT_LOGIN");
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
            this.first_name = account.first_name;
            this.last_name = account.last_name;
            this.middle_name = account.middle_name;
            this.email_address = account.email;
            // remember to storage
            this.storageService.saveUser(account);
            console.log(this.storageService.getUser());
            this.changeForm(false,false,true);
          } else {
            this.messageService.update("Failed Login: Check your UNI/password!", "DANGER");
          }
        }
    )
  }

  /**
   * Update student's profile
   */
  updateProfile(): void {
    let warning = "";
    console.log("current user:", this.uni, this.timezone, this.major, this.first_name);
    if (this.timezone === "" || this.major === "" || this.gender === "") {
      warning = this.getMessage("MISSING_INPUT_PROFILE");
      this.messageService.update(warning, "WARNING");
      return;
    }
    this.accountService.updateProfile(this.uni, this.timezone, this.major, this.gender, this.msg
    ).subscribe((_) => {
          this.messageService.update(this.getMessage("SUCCESS_UPDATE_PROFILE"), "SUCCESS");
        }
    );
  }

  /**
   * Log out of the account
   */
  logOut(): void {
    this.storageService.clean();
    this.clearFields();
    this.isLoggedIn = false;
    window.location.reload();
  }
}
