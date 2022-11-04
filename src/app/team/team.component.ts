import { Component, OnInit, TestabilityRegistry } from '@angular/core';
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
  edited_number_needed: number = 0;
  edited_team_messages: string = " ";
  Team_id: number = 0;
  add_Team_Name: string = "";
  add_Team_message: string = " ";
  add_Number_needed: number = 0;
  add_Team_Captain_Name: string = "";
  add_Team_Captain_Uni: string = "";
  add_click: boolean = false;
  search_click: boolean = true;
  edit_click: boolean = false;
  delete_captain_uni: string = "";
  edit_captain_uni: string = "";

  All_teams: Team[];
  currentWholeUrl : string;

  /* pagination field */
  page = 1;
  count = 0;
  pageSize = 3;
  pageSizes = [3, 6, 9];

  ngOnInit(): void {
    let message = this.getMessage("Select_Course");
    this.messageService.update(message, "INFO");
    this.currentWholeUrl = document.URL;
    this.add_click = false;
    this.search_click = true;
  }

  showContent() {
    this.add_click = true;
    this.search_click = false;
    this.edit_click = false;
  }

  getMessage(type: string): string {
    return Object.entries(this.messageDict)
      .filter(item => item[0] == type)
      .map(item => item[1])[0];
  }
  getRequestParams(course_id: number, page: number, pageSize: number): any {
    let params: any = {};
    params[`course_id`] = course_id;
    params[`page`] = page-1;
    params[`size`] = pageSize;
    return params;
  }
  showContentSearch() {
    this.search_click = true;
    this.add_click = false;
    this.edit_click = false;
  }

  RetrieveAllTeam(): void{
    let curMessage = "";
    if(!this.check_Course_id) {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    const params = this.getRequestParams(this.check_Course_id, this.page, this.pageSize);
    console.log("paras is ", params);
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.TeamService.retrieve_all_team_by_params(params).subscribe(
      res=>{
        let totalItems = res[0];
        this.All_teams=res[1];
        this.count = totalItems;
      }
    )
  }

  addteam(): void{
    let curMessage = "";
    if( this.add_Course_id === 0  || this.add_Team_Name === "" || this.add_Team_Captain_Name === "" || this.add_Team_Captain_Uni === "") {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.TeamService.add_team(this.add_Course_id, this.add_Team_Name, this.add_Team_message="join us!", this.add_Number_needed,
      this.add_Team_Captain_Name, this.add_Team_Captain_Uni
    ).subscribe(()=>{});
  }


  DeleteTeam(team_id= this.delete_team_id, course_id= this.delete_Course_id, team_captain_uni=this.delete_captain_uni, check_form=false): void {
    let curMessage = "";
    if(team_id === 0 || course_id === 0) {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.TeamService.delete_team(team_id, course_id, team_captain_uni).subscribe(() => {
      if(check_form) { // refresh list
        this.All_teams = [];
        this.RetrieveAllTeam();
      }
    });
  }

  setEditForm(team_id: number, course_id: number, captain_uni: string, team_name: string, team_captain:string, number_needed: number, team_messages:string): void {
    this.search_click = false;
    this.edit_click = true;
    this.edited_team_id = team_id;
    this.edited_Course_id = course_id;
    this.edit_captain_uni = captain_uni;
    this.edited_team_name = team_name;
    this.edited_team_captain = team_captain;
    this.edited_number_needed = number_needed;
    this.edited_team_messages = team_messages;
  }

  EditPreference(): void {
    let curMessage = "";
    if(this.edited_team_name === "" || this.edited_Course_id === 0 || this.edited_team_captain === "" ||
      this.edited_team_id === 0) {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.TeamService.edit_team(
      this.edited_team_name, this.edited_Course_id, this.edited_team_captain,
      this.edited_team_id, this.edited_number_needed, this.edited_team_messages="join us!", this.edit_captain_uni
    ).subscribe((data) => {
      this.setEditForm(0, 0, "", "", "", 0, "");
      this.All_teams = [];
      this.RetrieveAllTeam();
    });
  }

  handlePageChange(event: number): void {
    this.page = event;
    this.RetrieveAllTeam(); //TODO: Uncomment this after implementing API
  }

  handlePageSizeChange(event: any): void {
    this.pageSize = event.target.value;
    this.page = 1;
    this.RetrieveAllTeam(); //TODO: Uncomment this after implementing API
  }


}
