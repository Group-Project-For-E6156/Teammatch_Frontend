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
    let courseUrl: string = "";
    if (Course_id) {
      courseUrl = this.getTeamServiceUrl() + `team/course_id=${Course_id}`;
    }
    console.log(courseUrl);
    return this.http.get(courseUrl,{responseType: 'text'})
    }
  }