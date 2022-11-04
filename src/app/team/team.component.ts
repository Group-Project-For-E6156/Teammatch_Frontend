import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { catchError, Observable, of} from 'rxjs';
import { MessageService } from "../message.service";
import { TeamService } from "../team.service";
import { Team } from './team';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  constructor(
    public messageService: MessageService,
    public TeamService:  TeamService
    ) {
  }

  messageDict = {
    "Select_Course": "Check Course first. Use Course ID to search for team.",
    "Search_Course": "This course does not exist",
    "MISSING_INPUT": "You should have all blanks filled!",
    "SUCCESS": "The search is successful",
    "FAILED": "FAILED IN SEARCH"
  };

  check_Course_id : number = 0;
  add_Course_id : number = 0;
  delete_Course_id = 0;
  delete_team_id = 0;
  edited_team_name: string = "";
  edited_team_captain: string = "";
  edited_team_id: number = 0;
  edited_Course_id: number = 0;
  edited_number_needed: number = -1;
  edited_team_messages: string = "";
  Team_id: number = 0;
  add_Team_Name: string = "";
  add_Team_message: string = "";
  add_Number_needed: number = -1;
  add_Team_Captain: string = "";
  All_teams: Team[];
  currentWholeUrl : string;

  ngOnInit(): void {
    let message = this.getMessage("Select_Course");
    this.messageService.update(message, "INFO");
    this.currentWholeUrl = document.URL;
  }

  getMessage(type: string): string {
    return Object.entries(this.messageDict)
      .filter(item => item[0] == type)
      .map(item => item[1])[0];
  }


  browseAllTeam(): void{
    let curMessage = "";
    if(!this.check_Course_id) {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.TeamService.browse_all_team(this.check_Course_id).subscribe(
      res=>{
        this.All_teams=res;
        console.log(this.All_teams);
      }
    )
  }

  addteam(): void{
    let curMessage = "";
    if( this.add_Course_id === 0  || this.add_Team_Name === "" || this.add_Team_message === ""
      || this.add_Number_needed === -1 || this.add_Team_Captain === "") {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.TeamService.add_team(this.add_Course_id, this.add_Team_Name, this.add_Team_message, this.add_Number_needed,
      this.add_Team_Captain
    ).subscribe(()=>{});
  }


  DeleteTeam(team_id= this.delete_team_id, course_id= this.delete_Course_id, check_form=false): void {
    let curMessage = "";
    if(team_id === 0 || course_id === 0) {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.TeamService.delete_team(team_id, course_id).subscribe(() => {
      if(check_form) { // refresh list
        this.All_teams = [];
        this.browseAllTeam();
      }
    });
  }

  setEditForm(team_id: number, course_id: number): void {
    this.edited_team_id = team_id;
    this.edited_Course_id = course_id;
  }

  EditPreference(): void {
    let curMessage = "";
    if(this.edited_team_name === "" || this.edited_Course_id === 0 || this.edited_team_captain === "" ||
      this.edited_team_id === 0 || this.edited_number_needed == -1 || this.edited_team_messages == "") {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.TeamService.edit_team(
      this.edited_team_name, this.edited_Course_id, this.edited_team_captain,
      this.edited_team_id, this.edited_number_needed, this.edited_team_messages
    ).subscribe((data) => {
      this.setEditForm(0, 0);
      this.All_teams = [];
      this.browseAllTeam();
    });
  }


}
