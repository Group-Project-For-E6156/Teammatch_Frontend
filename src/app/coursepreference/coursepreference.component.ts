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
  add_uni: string = "";
  edit_uni: string = "";
  delete_uni: string = "";
  check_uni: string = "";
  add_Course_id: number;
  edit_Course_id: number;
  delete_Course_id: number;
  add_prefered_Dept: string = "";
  add_prefered_Timezone: string = "";
  add_prefered_message: string = "";
  edit_prefered_Dept: string = "";
  edit_prefered_Timezone: string = "";
  edit_prefered_message: string = "";
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
    this.add_uni = "";
    this.edit_uni = "";
    this.delete_uni = "";
    this.check_uni = "";
    this.add_prefered_Dept = "";
    this.add_prefered_Timezone = ""
    this.edit_prefered_message = "";
    this.add_prefered_message = "";
    this.edit_prefered_Dept  = "";
    this.edit_prefered_Timezone  = "";
    this.add_Course_id = 0;
    this.edit_Course_id = 0;
    this.delete_Course_id = 0;

  }

  SetPreferenceInfo(thePreference: CoursePreference): void {
    console.log("Students = \n" + JSON.stringify(thePreference, null, 2));
    this.CoursePreferenceInfo = thePreference;
}

  AddCoursePreference(): void {
    let curMessage = "";
    if(this.add_uni === "" || this.add_Course_id === 0 || this.add_prefered_Dept === "" ||
       this.add_prefered_Timezone === "" || this.add_prefered_message == "") {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.coursePreferenceService.addCoursePreference(
      this.add_uni, this.add_Course_id, this.add_prefered_Dept, this.add_prefered_Timezone, this.add_prefered_message
    ).subscribe((data) => {});
  }

  EditPreference(): void {
    let curMessage = "";
    if(this.edit_uni === "" || this.edit_Course_id === 0 || this.edit_prefered_Dept === "" ||
      this.edit_prefered_Timezone === "" || this.edit_prefered_message == "") {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.coursePreferenceService.editCoursePreference(
      this.edit_uni, this.edit_Course_id, this.edit_prefered_Dept, this.edit_prefered_Timezone, this.edit_prefered_message
    ).subscribe((data) => {});
  }

  DeletePreference(): void {
    let curMessage = "";
    if(this.delete_uni === "" || this.delete_Course_id === 0) {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.coursePreferenceService.deleteCoursePreference(this.delete_uni, this.delete_Course_id).subscribe((data) => {});
  }

  CheckCoursePreference(): void{
    let curMessage = "";
    if(this.check_uni === "") {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.coursePreferenceService.getCoursePreferencebyuni(this.check_uni).
    subscribe((data) => this.SetPreferenceInfo(data));
  }

}
