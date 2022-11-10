import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from "./message.service";
import { CoursePreference } from "./coursepreference/coursepreference"
import { catchError, throwError, Observable, of} from 'rxjs';
import { Course } from "./Courses/Course";
import {AccountService} from "./account.service";
@Injectable({
  providedIn: 'root'
})

export class CoursePreferenceService {
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
    private http: HttpClient,
    private messageService: MessageService,
    private accountService: AccountService
  ) {}
  ngOnInit(): void{
    this.isLoggedIn = this.accountService.isLoggedIn;
    this.notLoggedIn = !this.isLoggedIn;
    if(this.isLoggedIn) {
      let account = this.accountService.currentUser;
      console.log(account);
      this.user.uni = account.uni;
      this.user.email = account.email;
      this.user.first_name = account.first_name;
      this.user.last_name = account.last_name;

      // get profile
      this.accountService.getProfile().subscribe(
        (profile) => {
          console.log(profile)
          if(profile) {
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
        } else {
          currmessage = error.error;
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
    console.log(11111);
    return result;
  }

  getCoursePreferencebyuni(
    uni: string
  ): Observable<any> {
    let courseUrl: string = "";
    courseUrl = this.getCoursePreferenceServiceUrl() + `course/student_preference/${uni}`;
    return this.http.get<CoursePreference[]>(courseUrl).pipe(
      catchError(this.handleError<CoursePreference[]>("getCoursePreferencebyuni"))
    );
  }

  retreiveCoursePreferenceByParams(params: any): Observable<any> {
    // TODO: Maybe modify this function after implementing your API on BE
    let courseUrl: string = "";
    courseUrl = this.getCoursePreferenceServiceUrl() + `course/student_preference/${params[`uni`]}/limit=${params[`size`]}&offset=${params[`size`]*params[`page`]}`;
    console.log(courseUrl);
    return this.http.get<CoursePreference[]>(courseUrl).pipe(
      catchError(this.handleError<CoursePreference[]>("getCoursePreferencebyuni"))
    );
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
