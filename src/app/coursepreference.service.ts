import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from "./message.service";
import { CoursePreference } from "./coursepreference/coursepreference"
import { catchError, throwError, Observable, of} from 'rxjs';
import {Course} from "./Courses/Course";

@Injectable({
  providedIn: 'root'
})

export class CoursePreferenceService {
  addPreferenceSuccess: boolean = false;
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}


  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      let currmessage = "";
      if (error.status == 200){
        currmessage = "Your operation success";
        this.messageService.update(currmessage, "SUCCESS");
      }
      else {
        if (operation == "addCoursePreference"){
          {
            if(error.error === "The course has been created!") {
              currmessage = "You have already added a preference for this course! You should go edit it!";
            } else {
              currmessage = error.error;
            }
          }
        } else if (operation == "editCoursePreference" && error.error == "The preference does not exist"){
          currmessage = "The preference does not exist";
        } else if (operation == "deleteCoursePreference" && error.error == "No existed Preference is found!"){
          currmessage = "No existed Preference is found!";
        }
        this.messageService.update(currmessage, "WARNING");
      }
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }


  getCoursePreferenceServiceUrl(): string {
    const theUrl = window.location.href;
    let result: string;

    // This is some seriously bad code.
    // If you do this on a job interview, you did not learn this in my class.
    result = "http://127.0.0.1:5011/";
    return result;
  }

  getCoursePreferencebyuni(
    uni: string
  ): Observable<any> {
    let courseUrl: string = "";
    courseUrl = this.getCoursePreferenceServiceUrl() + `course/student_preference/${uni}`;
    return this.http.get<CoursePreference>(courseUrl);
  }

  addCoursePreference(
    uni: string, course_id: number, prefered_Dept: string, prefered_Timezone: string, prefered_message: string
  ): Observable<any> {
    let courseUrl: string = "";
    courseUrl = this.getCoursePreferenceServiceUrl() + `course/student_preference/add/uni=${uni}&course_id=
    ${course_id}&timezone=${prefered_Timezone}&dept=${prefered_Dept}&message=${prefered_message}`;
    return this.http.get<any>(courseUrl).pipe(
      catchError(this.handleError<any>("addCoursePreference")));
  }

  editCoursePreference(
    uni: string, course_id: number, prefered_Dept: string, prefered_Timezone: string, prefered_message: string
  ): Observable<any> {
    let courseUrl: string = "";
    courseUrl = this.getCoursePreferenceServiceUrl() + `course/student_preference/edit/uni=${uni}&course_id=
    ${course_id}&timezone=${prefered_Timezone}&dept=${prefered_Dept}&message=${prefered_message}`;
    return this.http.get<any>(courseUrl).pipe(
      catchError(this.handleError<any>("editCoursePreference")));
  }

  deleteCoursePreference(
    uni: string, course_id: number
  ): Observable<any> {
    let courseUrl: string = "";
    courseUrl = this.getCoursePreferenceServiceUrl() + `course/student_preference/delete/uni=${uni}&course_id=${course_id}`;
    return this.http.get<any>(courseUrl).pipe(
      catchError(this.handleError<any>("deleteCoursePreference")));
  }
}
