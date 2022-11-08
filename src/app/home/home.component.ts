import { Component, OnInit } from '@angular/core';
import {StorageService} from "../storage.service";
import {AccountService} from "../account.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  notLoggedIn = true;
  user = {
    "uni": "",
    "email": "",
    "first_name": "",
    "last_name": "",
    "timezone": "N/A",
    "major":"N/A",
    "gender":"N/A",
    "msg":"N/A",
    "department": "N/A",
  }

  FEMALE_IMAGE = "../../assets/female.png";
  MALE_IMAGE = "../../assets/male.png";
  UNKNOWN_IMAGE = "../../assets/unknown.png";
  profile_img = this.UNKNOWN_IMAGE;

  constructor(
    public storageService: StorageService,
    public accountService: AccountService,
  ) { }

  ngOnInit(): void {
    if(this.storageService.isLoggedIn()) {
      this.isLoggedIn = true;
      this.notLoggedIn = false;
      let account = this.storageService.getUser();
      this.user.uni = account.uni;
      this.user.email = account.email;
      this.user.first_name = account.first_name;
      this.user.last_name = account.last_name;

      // get profile
      this.accountService.getProfile(this.user.uni).subscribe(
        (profile) => {
          if(profile) {
            console.log(profile)
            this.user.timezone = profile.timezone;
            this.user.gender = profile.gender;
            this.user.major = profile.major;
            this.user.msg = profile.personal_message;
            if(this.user.gender == "f") {
              this.profile_img = this.FEMALE_IMAGE;
            } else if (this.user.gender == "m") {
              this.profile_img = this.MALE_IMAGE;
            } else {
              this.profile_img = this.UNKNOWN_IMAGE;
            }
          }
        }
      )
    } else {
      this.isLoggedIn = false;
      this.notLoggedIn = true;
    }
  }

  signOut(): void {
    this.isLoggedIn = false;
    this.notLoggedIn = true;
    this.storageService.clean();
    window.location.reload();
  }

}
