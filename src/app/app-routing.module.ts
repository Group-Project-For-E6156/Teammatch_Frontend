import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AccountComponent } from "./account/account.component";
import { CourseComponent } from "./Courses/course.component"
import { CoursepreferenceComponent } from './coursepreference/coursepreference.component';
import { TeamComponent } from "./team/team.component"
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
const routes2:  Routes = [
  { path: '', redirectTo: '/preferences', pathMatch: 'full' },
  { path: 'preferences', component:  CoursepreferenceComponent},
  { path: 'courses', component:  CourseComponent},
];
const routes3:  Routes = [
  { path: '', redirectTo: '/team', pathMatch: 'full' },
  { path: 'team', component:  TeamComponent},
  { path: 'about', component:  AboutComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes), RouterModule.forRoot(routes1), RouterModule.forRoot(routes2),
    RouterModule.forRoot(routes3)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
