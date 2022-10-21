import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { catchError, Observable, of} from 'rxjs';
import { MessageService } from "../message.service";
import { CourseService } from "../course.service";
import { Course } from './Course';

@Component({
  selector: 'app-Courses',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})

export class CourseComponent implements OnInit {

  messageDict = {
    "MISSING_INPUT": "You should have all blanks filled!",
    "SUCCESS": "Thanks for the registration! You will receive an email to verify your account!",
    "FAILED": "FAILED IN REGISTRATION:",
    "MISSING_INPUT2": "You should have uni & password filled!",
    "STARTING": "Please fill in your course name, department and introduction."
  };
  Course_id : number = 0;
  Course_Name_add: string = "";
  Course_Name_check: string = ""
  Department: string = "";
  CourseIntroduction: string = "";
  CourseInfo: any;

  constructor(
    public messageService: MessageService,
    public courseService: CourseService,
  ) {
  }

  ngOnInit(): void {
    let message = this.getMessage("STARTING");
    this.messageService.update(message, "STARTING");
  }
  getMessage(type: string): string {
    return Object.entries(this.messageDict)
      .filter(item => item[0] == type)
      .map(item => item[1])[0];
  }
  clearFields(): void {
    this.Course_Name_add = "";
    this.CourseIntroduction = "";
    this.Course_Name_check = ""
    this.Department = "";
    this.Course_id = 0;
  }

  setCourseInfo(theCourse: Course): void {
    console.log("Students = \n" + JSON.stringify(theCourse, null, 2));
    this.CourseInfo = theCourse;
    /**
    for (let a of this.CourseInfo){
      console.log(a.Course_id);
      console.log(a.Course_Name);
    }**/
  }

  AddCourse(): void {
    let curMessage = "";
    if(this.Course_Name_add === "" || this.CourseIntroduction === "" || this.Department === "" ) {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.courseService.addCourse(
      this.Course_Name_add, this.Department, this.CourseIntroduction
    ).subscribe((data) => {});
  }
  CheckCourse(): void{
    let curMessage = "";
    console.log(this.Course_Name_check);
    if(this.Course_Name_check === "") {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.courseService.getCourseInfo(this.Course_Name_check).
    subscribe((data) => this.setCourseInfo(data));
  }


}
