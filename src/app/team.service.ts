import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Team } from './team/team';
import { MessageService } from "./message.service";
import { catchError, throwError, Observable, of} from 'rxjs';

@Injectable({
    providedIn: 'root'
  })

export class TeamService {
    constructor(
      private http: HttpClient,
      private messageService: MessageService
    ) {}

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(error.error); // log to console instead
      let currmessage = "";
      if (error.status == 200){
            currmessage = "Your operation success";
            this.messageService.update(currmessage, "SUCCESS");
      }else {
        if (operation == "SearchTeam"){
          if (error.error == "There already exist one course") {
            console.log(111);
            currmessage = "There already exist one course";
          }
        }
        if (operation == "addteam"){
          if (error.error == "NOT FOUND") {
            console.log(111);
            currmessage = "Not found";
          }
        }
        if (operation == "deleteteam"){
          if (error.error == "No existed Preference is found!") {
            console.log(111);
            currmessage = "No existed Preference is found!";
          }
        }
      this.messageService.update(currmessage, "WARNING");
    }
    // Let the app keep running by returning an empty result.
    return of(result as T);
  };
  }

  getTeamServiceUrl(): string {
      const theUrl = window.location.href;
      let result: string;

      // This is some seriously bad code.
      // If you do this on a job interview, you did not learn this in my class.
      result = "http://127.0.0.1:5011/";
      return result;
    }

  browse_all_team(Course_id: number): Observable<any> {
    let teamUrl: string = "";
    if (Course_id) {
      teamUrl = this.getTeamServiceUrl() + `team/course_id=${Course_id}`;
    }
    console.log(teamUrl);
    return this.http.get(teamUrl).pipe(catchError(this.handleError<any>("SearchTeam")));
    }

  add_team(
    course_id: number, team_name: string, team_message: string,  number_needed: number, team_captain: string
  ): Observable<any> {
    let teamUrl: string = "";
    teamUrl = this.getTeamServiceUrl()  + `team/add/team_name=${team_name}&team_captain=${team_captain}&course_id=${course_id}&number_needed=${number_needed}&team_message=${team_message}`;
    return this.http.get<any>(teamUrl).pipe(
      catchError(this.handleError<any>("addteam")));
  }

  delete_team(
    team_id: number, course_id: number
  ): Observable<any> {
    let teamUrl: string = "";
    teamUrl = this.getTeamServiceUrl() + `team/delete/team_id=${team_id}&course_id=${course_id}`;
    return this.http.get<any>(teamUrl).pipe(
      catchError(this.handleError<any>("deleteteam")));
  }

  edit_team(
    team_name: string, course_id: number, team_captain: string, team_id: number,  number_needed: number, team_message: string
  ): Observable<any> {
    let teamUrl: string = "";
    teamUrl = this.getTeamServiceUrl() + `team/edit/team_name=${team_name}&team_captain=${team_captain}&course_id=${course_id}&number_needed=${number_needed}&team_message=${team_message}`;
    return this.http.get<any>(teamUrl).pipe(
      catchError(this.handleError<any>("editteam")));
  }



}

