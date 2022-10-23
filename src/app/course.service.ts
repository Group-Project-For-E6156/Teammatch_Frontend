import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Course } from './Courses/Course';
import { MessageService } from "./message.service";
import { catchError, throwError, Observable, of} from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class CourseService {
  addCourseSuccess: boolean = false;
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
      }
      else {
          if (operation == "addCourse"){
            if (error.error == "There already exist one course"){
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
  getCourseServiceUrl(): string {
    const theUrl = window.location.href;
    let result: string;

    // This is some seriously bad code.
    // If you do this on a job interview, you did not learn this in my class.
    result = "http://127.0.0.1:5011/";
    return result;
  }


  getCourseInfo(Coursename: string): Observable<any> {
    let courseUrl: string = "";
    if (Coursename !== "") {
      courseUrl = this.getCourseServiceUrl() + `course/${Coursename}`;
    }
    return this.http.get<Course>(courseUrl);
  }
  addCourse(
    course_name: string, department: string, introduction: string
  ): Observable<any> {
    let courseUrl: string = "";
    courseUrl = this.getCourseServiceUrl() + `course/add/course_name=${course_name}&department=${department}
                &introduction=${introduction}`;
    return this.http.get<any>(courseUrl).pipe(
      catchError(this.handleError<any>("addCourse")));
  }
}





