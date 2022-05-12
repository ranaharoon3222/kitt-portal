import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { StorageMap } from "@ngx-pwa/local-storage";
import { Observable, throwError, of } from "rxjs";
import { environment as env } from "../../environments/environment";
import { switchMap } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root",
})
export class AuthService {
  // Private
  private apiUrl = env.apiUrl;
  private _authenticated: boolean = false;

  /**
   *
   * @param _httpClient
   * @param _storage
   */
  constructor(
    private _httpClient: HttpClient,
    private _storage: StorageMap,
    private _router: Router
  ) {}

  /**
   * Setter for user data
   */
  setUserData(userDetails: any) {
    this._storage.set("userDetails", userDetails).subscribe(() => {});
    localStorage.setItem("userFullName", userDetails?.fullName);
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Sign in
   *
   * @param credentials
   */
  signIn(credentials: { email: string; password: string }): Observable<any> {
    // Throw error, if the user is already logged in
    if (this._authenticated) {
      return throwError("User is already logged in.");
    }
    let loginDM = { email: credentials.email, password: credentials.password };
    let url = this.apiUrl + "Authenticate/ValidateLogin";
    return this._httpClient.post(url, loginDM).pipe(
      switchMap((response: any) => {
        // Store the data in ngStorage
        let data = response;
        this.setUserData(data);

        // Set the authenticated flag to true
        this._authenticated = true;

        // Return a new observable with the response
        return of(response);
      })
    );
  }

  //Forget Password
  forgetPassword(email?: string): Observable<any> {
    var url = this.apiUrl + "Authenticate/ForgotPassword";
    let forgotDM = { email: email, password: "" };
    return this._httpClient.post(url, forgotDM).pipe(
      switchMap((response: any) => {
        // Return a new observable with the response
        return of(response);
      })
    );
  }

  //Change Password
  changePassword(contactId: string, password: string): Observable<any> {
    var url = this.apiUrl + "Authenticate/UpdatePasswordInContact";
    var changeDM = { contactId: contactId, password: password };
    return this._httpClient.post(url, changeDM).pipe(
      switchMap((response: any) => {
        // Return a new observable with the response
        return of(response);
      })
    );
  }

  //Logout
  logout(): void {
    this._storage.clear().subscribe(() => {});
    localStorage.clear();
    this._authenticated = false;
    this._router.navigate(["/account/login"]);
  }
}
