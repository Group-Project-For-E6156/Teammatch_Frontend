import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import { Account } from "./account/account";
import { MessageService } from "./message.service";
import {Profile} from "./account/profile";

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  accountServiceUrl: string = "http://127.0.0.1:2333/students/";
  addAccountSuccess: boolean = false;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
  ) { }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // console.error(error); // log to console instead
      this.messageService.clear();
      if(error.status == 200) {
        let curMessage;
        if(operation == "addAccount") {
          curMessage = "Thanks for the registration! You will receive an email to verify your account!";
          this.addAccountSuccess = true;
        } else {
          this.addAccountSuccess = false
          curMessage = `${JSON.stringify(error.error.text)}`
        }
        this.messageService.update(curMessage, "SUCCESS");
      } else {
        if (operation == 'addAccount') {
          this.addAccountSuccess = false
          this.messageService.update(`${JSON.stringify(error.error)}`, "DANGER");
        } else if (operation == 'updateProfile') {
          this.messageService.update(`${JSON.stringify(error.error)}`, "DANGER");
        } else { // getProfile
          // do nothing
        }
      }
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Get Account from the server
   * */
  getAccount(uni="", email=""): Observable<Account> {
    let accountUrl: string = this.accountServiceUrl + "account";
    if(uni != "" && email != ""){
      accountUrl += `?uni=${uni}&email=${email}`;
    } else if(uni != "") {
      accountUrl += `?uni=${uni}`;
    } else if(email != "") {
      accountUrl += `?email=${email}`;
    }
    return this.http.get<Account>(accountUrl).pipe(
      catchError(this.handleError<Account>("getAccount")),
    );
  }

  /** Add Account for the server
   * */
  addAccount(
    uni: string, email: string, pwd: string, last_name: string, first_name: string, middle_name=""
  ): Observable<any> {
    let registerUrl: string = this.accountServiceUrl + "signup";
    let request: any = {
      uni: uni,
      email: email,
      password: pwd,
      last_name: last_name,
      first_name: first_name,
      middle_name: middle_name
    };
    return this.http.post<any>(registerUrl, request).pipe(
      catchError(this.handleError<any>("addAccount")),
    );
  }

  /**
   * Update student's profile
   */
  updateProfile(uni: string, timezone: string, major: string, gender: string, msg: string=""): Observable<any>  {
    let profileUrl: string = this.accountServiceUrl + "profile/";
    profileUrl += `${uni}/timezone=${timezone}&major=${major}&gender=${gender}`;
    if (msg !== "") {
      profileUrl += `&msg=${msg}`;
    }
    return this.http.get<any>(profileUrl).pipe(
        catchError(this.handleError<any>("updateProfile"))
    );
  }

  /**
   * Get Profile from the server
   */
  getProfile(uni=""): Observable<Profile> {
    let profileUrl: string = this.accountServiceUrl + `profile/${uni}`;
    return this.http.get<Profile>(profileUrl).pipe(
        catchError(this.handleError<any>("getProfile"))
    );
  }
}
