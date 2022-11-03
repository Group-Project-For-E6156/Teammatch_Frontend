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

  Course_id : number;
  All_teams: [];
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

  clearFields(): void {
    this.Course_id;
  }

  browseAllTeam(): void{
    let curMessage = "";
    if(!this.Course_id) {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.TeamService.browse_all_team(this.Course_id).subscribe(
      res=>{
        this.All_teams=res;
        console.log(this.All_teams);
      }
    )
  }


}
