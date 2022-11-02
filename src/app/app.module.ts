import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavbarComponent } from './navbar/navbar.component';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from './account/account.component';
import { MessagesComponent } from './messages/messages.component';
import { CourseComponent } from './Courses/course.component'
import { FormsModule } from "@angular/forms";
import { HttpClientModule } from '@angular/common/http';
import { CoursepreferenceComponent } from './coursepreference/coursepreference.component';
import { NgxPaginationModule } from "ngx-pagination";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    AboutComponent,
    AccountComponent,
    MessagesComponent,
    CourseComponent,
    CoursepreferenceComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    NgxPaginationModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
