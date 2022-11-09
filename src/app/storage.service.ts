import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  clean(): void {
    window.sessionStorage.clear();
  }

  /**
   * SaveUser: for adding session cookie for save the account information
   * account: {uni}
   */
  public saveUser(account: any): void {
    window.sessionStorage.removeItem(USER_KEY);
    window.sessionStorage.setItem(USER_KEY, JSON.stringify(account));
  }

  /**
   * GetUser: for retrieving current login status
   * If it's logged in, it will return account information;
   * Otherwise, return an empty thing
   */
  public getUser(): any {
    const user = window.sessionStorage.getItem(USER_KEY);
    if(user) {
      console.log(user);
      return JSON.parse(user);
    }

    return {}
  }

  public isLoggedIn(): boolean {
    const user = window.sessionStorage.getItem(USER_KEY);
    if(user) {
      return true;
    }
    return false;
  }
}
