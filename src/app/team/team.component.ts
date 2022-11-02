import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { catchError, Observable, of} from 'rxjs';
import { MessageService } from "../message.service";
//import { TeamService } from "../team.service";
//import { Team } from './team';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.css']
})
export class TeamComponent implements OnInit {

  constructor(
    public messageService: MessageService,
    //public courseService:  TeamService
    ) {
  }

  ngOnInit(): void { 
  }

}
