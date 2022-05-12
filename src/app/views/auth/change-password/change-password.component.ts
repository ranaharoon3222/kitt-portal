import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  email: any;
  changePasswordForm: FormGroup;
  passwordRegExp: RegExp = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  // Private
  private _unsubscribeAll: Subject<any>;
  contactId: any;
  preferredLanguage: string = "";
  changePassFormSubmitted: boolean = false;
  passwordMismatchFlag : boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private _storage: StorageMap,
    private _toastrService: ToastrService,
    private _spinner: NgxSpinnerService
  ) {
    // Set the private defaults
    this._unsubscribeAll = new Subject();
  }

  ngOnInit(): void {
    // Create the form
    this.changePasswordForm = this._formBuilder.group({
      password: [null, [Validators.required, Validators.pattern(this.passwordRegExp), Validators.minLength(8), Validators.maxLength(20)]],
      passwordConfirm: [null, [Validators.required, Validators.pattern(this.passwordRegExp), Validators.minLength(8), Validators.maxLength(20)]]
    });
    this.changePassFormSubmitted = false;

    // Get User Details
    this._storage.get("userDetails").subscribe((user: any)=>{
      this.contactId = user?.contactId;
    })
  }

  //form control
  get formCtrl() {
    return this.changePasswordForm.controls;
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    // Unsubscribe from all subscriptions
    this._unsubscribeAll.next();
    this._unsubscribeAll.complete();
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  matchPassword(): void {
    if (this.changePasswordForm.value.password !== this.changePasswordForm.value.passwordConfirm) {
      this.passwordMismatchFlag = true;
    }
    else{
      this.passwordMismatchFlag = false;
    }
  }

  /**
   * Reset password
   */
  changePassword(): void {
    // Do nothing if the form is invalid
    if (this.changePasswordForm.invalid) {
      return;
    }

    // Show spinner
    this._spinner.show();

    // Disable the form
    this.changePasswordForm.disable();
    this.next();
  }

  next() { // modified by Udbhav
    this._authService.changePassword(this.contactId, this.changePasswordForm.get("password").value)
      .subscribe((res: any) => {

        this.changePasswordForm.enable();
        // Hide spinner
        this._spinner.hide();

        this._toastrService.success("Your password has been reset.", "Success");

        // change in message after 5sec.
        setTimeout(() => {
          this._toastrService.info("Please login again with your new password.", "Info");
        }, 5000);

        //delay of 5sec more after previous message
        setTimeout(() => {
          this._authService.logout();
        }, 10000);


      }, (error) => {

        // Emulate server delay
        setTimeout(() => {
          
          // Re-enable the form
          this.changePasswordForm.enable();
          
          // Reset the form
          this.changePasswordForm.reset({});

          // Hide spinner
          this._spinner.hide();

          this._toastrService.error("Unable to reset password due to some technical issues. Try again later", "Error");
        }, 1000);
      });
  }
}
