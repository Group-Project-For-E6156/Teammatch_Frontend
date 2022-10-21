import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from "./account/account.component";
import { CourseComponent } from "./Courses/course.component"

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component:  AccountComponent},
  { path: 'about', component:  AboutComponent},
];
const routes1: Routes = [
  { path: '', redirectTo: '/courses', pathMatch: 'full' },
  { path: 'courses', component:  CourseComponent},
  { path: 'about', component:  AboutComponent},
];
@NgModule({
  imports: [RouterModule.forRoot(routes), RouterModule.forRoot(routes1)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
