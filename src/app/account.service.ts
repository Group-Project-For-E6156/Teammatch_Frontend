import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import { Account } from "./account/account";
import { MessageService } from "./message.service";
import {Profile} from "./account/profile";
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  accountServiceUrl: string = "http://127.0.0.1:2333/students/";
  addAccountSuccess: boolean = false;
  currentUser: Account;

  constructor(
    private http: HttpClient,
    private messageService: MessageService,
    public router: Router
  ) {
    if (localStorage.getItem('currentUser') !== 'undefined') {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    }
  }

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
        if(operation == "signUp") {
          curMessage = "Thanks for the registration! You will receive an email to verify your account!";
          this.addAccountSuccess = true;
          this.messageService.update(curMessage, "SUCCESS");
        }
      } else {
        if (operation == 'signUp') {
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

  /**
   * Log in user
   * @param uni
   * @param password
   */
  logIn(uni: string, password: string) {
    let request: any = {
      uni: uni,
      password: password
    };
    console.log(request);
    return this.http
        .post<any>(`${this.accountServiceUrl}login`, request)
        .subscribe({
          next: res => {
            localStorage.setItem('access_token', res.token);
            this.getAccount(res.uni).subscribe((res:Account) => {
              localStorage.setItem('currentUser', JSON.stringify(res))
              window.location.reload();
            });
            this.router.navigate(['/home']);
            this.messageService.update("Successfully log in!", "SUCCESS");
          },
          error: err => {
            this.messageService.update(`${JSON.stringify(err.error)}`, "DANGER");
          }
        });
  }

  getToken() {
    return localStorage.getItem('access_token');
  }

  /**
   * Check if user logged in
   */
  get isLoggedIn(): boolean {
    let authToken = this.getToken();
    console.log("current token is " + authToken);
    return authToken !== null;
  }

  logOut() {
    localStorage.clear();
    // localStorage.removeItem('access_token');
    // localStorage.removeItem('currentUser');
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
  signUp(
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
    console.log(registerUrl);
    return this.http.post<any>(registerUrl, request).pipe(
      catchError(this.handleError<any>("signUp")),
    );
  }

  /**
   * Update student's profile
   */
  updateProfile(uni: string, timezone: string, major: string, gender: string, msg: string=""): Observable<any>  {
    let profileUrl: string = this.accountServiceUrl + "profile";
    let request: any = {
      timezone: timezone,
      major: major,
      gender: gender,
      message: msg
    };
    return this.http.post<any>(profileUrl, request).pipe(
        catchError(this.handleError<any>("updateProfile"))
    );
  }

  /**
   * Get Profile for current user from the server
   */
  getProfile(): Observable<Profile> {
    let profileUrl: string = this.accountServiceUrl + `profile`;
    return this.http.get<Profile>(profileUrl).pipe(
        catchError(this.handleError<any>("getProfile"))
    );
  }
}
