import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { catchError, Observable, of} from 'rxjs';
import { MessageService } from "../message.service";
import { TeamService } from "../teammatch.service";
import { Teammatch } from './teammatch';
import {Course} from "../Courses/Course";


@Component({
  selector: 'app-teammatch',
  templateUrl: './teammatch.component.html',
  styleUrls: ['./teammatch.component.css']
})
export class TeammatchComponent implements OnInit {

  messageDict = {
    "MISSING_INPUT": "You should have all blanks filled!",
    "SUCCESS": "Thanks for the registration! You will receive an email to verify your account!",
    "FAILED": "FAILED IN REGISTRATION:",
    "MISSING_INPUT2": "You should have uni & password filled!",
    "TO_REGISTER": "Please fill in all the blanks."
  };
  Team_add_id: string;
  Team_delete_id: string;
  Team_update_id: string;
  add_course_id: string;
  delete_course_id: string;
  update_course_id: string;
  Name: string;
  check_course_id: string;
  TeamInfo: any;
  constructor(
    public messageService: MessageService,
    public teamService: TeamService,
  ) {}

  ngOnInit(): void {
    let message = this.getMessage("TO_REGISTER");
    this.messageService.update(message, "INFO");
  }
  getMessage(type: string): string {
    return Object.entries(this.messageDict)
      .filter(item => item[0] == type)
      .map(item => item[1])[0];
  }

  clearFields(): void {
  }

  setTeamInfo(theTeam: Teammatch): void {
    this.TeamInfo = theTeam;
  }

  AddTeam(): void {
    let curMessage = "";
    if(this.Team_add_id === "" || this.add_course_id || this.Name === "" ) {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      console.log(curMessage);
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.teamService.addTeams(
      this.Team_add_id, this.add_course_id, this.Name
    ).subscribe((data) => {});
  }

  UpdateTeam(): void {
    let curMessage = "";
    if(this.Team_update_id === "" || this.update_course_id || this.Name === "" ) {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      console.log(curMessage);
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.teamService.UpdateTeams(
      this.Team_add_id, this.update_course_id, this.Name
    ).subscribe((data) => {});
  }

  DeleteTeam(): void {
    let curMessage = "";
    if(this.Team_delete_id === "" || this.delete_course_id ) {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      console.log(curMessage);
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.teamService.DeleteTeams(
      this.Team_delete_id, this.delete_course_id
    ).subscribe((data) => {});
  }

  CheckTeam(): void{
    let curMessage = "";
    if(this.check_course_id === "") {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.teamService.getallTeams(this.check_course_id).
    subscribe((data) => this.setTeamInfo(data));
  }

}
