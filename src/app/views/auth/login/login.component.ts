import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
})
export class LoginComponent implements OnInit {

  textRegex: RegExp = /^(\w+[ "'\-\.]*\w+)+$/;
  emailRegex: RegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  signInFormSubmitted: boolean = false;
  signInForm!: FormGroup;

  /**
   * 
   * @param _activatedRoute 
   * @param _authService 
   * @param _formBuilder 
   * @param _router 
   * @param _toastrService 
   */
  constructor(private _activatedRoute: ActivatedRoute,
    private _authService: AuthService,
    private _formBuilder: FormBuilder,
    private _router: Router,
    private _toastrService: ToastrService,
    private _spinner: NgxSpinnerService) {

  }

  /**
      * On init
      */
  ngOnInit(): void {
    this.signInFormSubmitted = false;
    // Create the form
    this.signInForm = this._formBuilder.group({
      email: [null, [Validators.required, Validators.email, Validators.pattern(this.emailRegex)]],
      password: [null, [Validators.required, Validators.minLength(8), Validators.maxLength(20)]],
    });
  }

  //form control
  get formCtrl() {
    return this.signInForm.controls;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
     * Sign in
     */
  signIn(): void {

    this.signInFormSubmitted = true;
    if (this.signInForm.invalid) {
      return;
    }

    // Show spinner
    this._spinner.show();

    // Disable the form
    this.signInForm.disable();

    // Get the credentials
    const credentials = this.signInForm.value;

    // Sign in
    this._authService.signIn(credentials)
      .subscribe(() => {

        // Set the redirect url.
        // The '/signed-in-redirect' is a dummy url to catch the request and redirect the user
        // to the correct page after a successful sign in. This way, that url can be set via
        // routing file and we don't have to touch here.
        const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';

        // Hide spinner
        this._spinner.hide();

        // Navigate to the redirect url
        this._router.navigateByUrl(redirectURL);

      }, (error: any) => {
        // Re-enable the form
        this.signInForm.enable();

        // Hide spinner
        this._spinner.hide();
        // Show the alert
        if (error === "User is already logged in.") {
          this._toastrService.error("User is already logged in.", "Error")
        }

        else if (error.error?.title == null) {
          this._toastrService.error("Something went wrong. Please contact administrator", "Error");
        }

        else if (error.error?.title != null) {
          this._toastrService.error(error.error?.title, "Error");
        }
      });
  }

  forgotPassword() {
    this._router.navigate(['/auth/forgot-password']);
  }
}
