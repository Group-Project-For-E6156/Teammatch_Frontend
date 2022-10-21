import { Component, OnInit } from '@angular/core';
import { MessageService } from "../message.service";
import { CoursePreferenceService } from "../coursepreference.service";
import { CoursePreference } from './coursepreference';

@Component({
  selector: 'app-coursepreference',
  templateUrl: './coursepreference.component.html',
  styleUrls: ['./coursepreference.component.css']
})
export class CoursepreferenceComponent implements OnInit {
  messageDict = {
    "MISSING_INPUT": "You should have all blanks filled!",
    "SUCCESS": "The search is successful",
    "FAILED": "FAILED IN SEARCH",
    "STARTING": "Please fill in all the information."
  };
  uni: string = "";
  Course_id: number = -1;
  prefered_Dept: string = "";
  prefered_Timezone: string = "";
  prefered_message: string = "";
  CoursePreferenceInfo: any;
  constructor(
    public messageService: MessageService,
    public coursePreferenceService: CoursePreferenceService,
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
    this.uni = "";
    this.prefered_Dept = "";
    this.prefered_Timezone = ""
    this.prefered_message = "";
    this.Course_id = 0;
  }

  SetPreferenceInfo(thePreference: CoursePreference): void {
    console.log("Students = \n" + JSON.stringify(thePreference, null, 2));
    this.CoursePreferenceInfo = thePreference;
     for (let a of this.CoursePreferenceInfo){
      console.log(a.Course_id);
      console.log(a.Course_Name);
  }}

  AddCoursePreference(): void {
    let curMessage = "";
    if(this.uni === "" || this.Course_id === 0 || this.prefered_Dept === "" ||
       this.prefered_Timezone === "" || this.prefered_message == "") {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.coursePreferenceService.addCoursePreference(
      this.uni, this.Course_id, this.prefered_Dept, this.prefered_Timezone, this.prefered_message
    ).subscribe((data) => {});
  }

  EditPreference(): void {
    let curMessage = "";
    if(this.uni === "" || this.Course_id === 0 || this.prefered_Dept === "" ||
      this.prefered_Timezone === "" || this.prefered_message == "") {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.coursePreferenceService.editCoursePreference(
      this.uni, this.Course_id, this.prefered_Dept, this.prefered_Timezone, this.prefered_message
    ).subscribe((data) => {});
  }

  DeletePreference(): void {
    let curMessage = "";
    if(this.uni === "" || this.Course_id === 0 || this.prefered_Dept === "" ||
      this.prefered_Timezone === "" || this.prefered_message == "") {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.coursePreferenceService.deleteCoursePreference(this.uni, this.Course_id).subscribe((data) => {});
  }

  CheckCoursePreference(): void{
    let curMessage = "";
    if(this.uni === "") {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.coursePreferenceService.getCoursePreferencebyuni(this.uni).
    subscribe((data) => this.SetPreferenceInfo(data));
  }

}
