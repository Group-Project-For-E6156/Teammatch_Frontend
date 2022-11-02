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
    "STARTING": "You could add your preference or edit them!",
  };
  add_uni: string = "";
  edit_uni: string = "";
  delete_uni: string = "";
  check_uni: string = "";
  add_Course_id: number;
  edit_Course_id: number = 0;
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
    this.messageService.clear();
    let message = this.getMessage("STARTING");
    this.messageService.update(message, "INFO");
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

  clearAddFields(): void {
    // this.add_uni = "";
    this.add_prefered_Dept = "";
    this.add_prefered_Timezone = "";
    this.add_prefered_message = "";
    this.add_Course_id = 0;
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
    ).subscribe((data) => {
      this.clearAddFields();
      if(this.add_uni === this.check_uni) {
        this.CheckCoursePreference();
      }
    });
  }

  setEditForm(uni: string, course_id: number): void {
    this.edit_uni = uni;
    this.edit_Course_id = course_id;
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
    ).subscribe((data) => {
      this.setEditForm("", 0);
      this.CoursePreferenceInfo = undefined;
      this.CheckCoursePreference();
    });
  }

  DeletePreference(uni=this.delete_uni, course_id=this.delete_Course_id, check_form=false): void {
    let curMessage = "";
    if(uni === "" || course_id === 0) {
      curMessage = this.getMessage("MISSING_INPUT");
    }
    if(curMessage !== "") {
      // there are some error when inputting fields
      this.messageService.update(curMessage, "WARNING");
      return;
    }
    this.coursePreferenceService.deleteCoursePreference(uni, course_id).subscribe(() => {
      if(check_form) { // refresh list
        this.CoursePreferenceInfo = undefined;
        this.CheckCoursePreference();
      }
    });
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
