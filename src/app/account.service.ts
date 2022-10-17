import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {catchError, Observable, of} from 'rxjs';
import {Account} from "./account/account";
import { MessageService } from "./message.service";
import { AccountComponent } from "./account/account.component";

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
      console.error(error); // log to console instead
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
        this.addAccountSuccess = false
        this.messageService.update(`${JSON.stringify(error.error)}`, "DANGER");
      }
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Get Account from the server
   * */
  getAccount(uni="", email=""): Observable<Account> {
    let accountUrl: string = "";
    if(uni != "" && email != ""){
      accountUrl = this.accountServiceUrl + `uni=${uni}&email=${email}`;
    } else if(uni != "") {
      accountUrl = this.accountServiceUrl + `uni=${uni}`;
    } else if(email != "") {
      accountUrl = this.accountServiceUrl + `email=${email}`;
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
    let registerUrl: string = this.accountServiceUrl + "upload/";
    registerUrl += `uni=${uni}&email=${email}&password=${pwd}&last_name=${last_name}&first_name=${first_name}`;
    if(middle_name !== "") {
      registerUrl += `&middle_name=${middle_name}`;
    }
    return this.http.get<any>(registerUrl).pipe(
      catchError(this.handleError<any>("addAccount")),
    );
  }
}