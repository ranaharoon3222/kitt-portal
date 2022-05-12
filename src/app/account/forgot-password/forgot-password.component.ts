import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  emailRegex: RegExp = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
  forgotPasswordForm!: FormGroup;
  preferredLanguage: string = "";
  forgetFormSubmitted: boolean = false;

  constructor(
    private _formBuilder: FormBuilder,
    private _authService: AuthService,
    private _router: Router,
    private storage: StorageMap,
    private _toastrService: ToastrService
  ) { }

  ngOnInit(): void {
    this.forgetFormSubmitted = false;
    // Create the form
    this.forgotPasswordForm = this._formBuilder.group({
      email: [null, [Validators.required, Validators.email, Validators.pattern(this.emailRegex)]]
    });
  }

  //form control
  get formCtrl() {
    return this.forgotPasswordForm.controls;
  }

  // -----------------------------------------------------------------------------------------------------
  // @ Public methods
  // -----------------------------------------------------------------------------------------------------

  /**
   * Send the reset link
   */
  sendResetLink(): void {
    this.forgetFormSubmitted = true; 
    // Do nothing if the form is invalid
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    // Disable the form
    this.forgotPasswordForm.disable();

    this._authService.forgetPassword(this.forgotPasswordForm.get("email").value)
      .subscribe((res: any) => {
        this._toastrService.info("New Password has been sent to your Email Account. Please check your inbox.", "Info");

        //alert(this.message?.content);

        //delay of 5sec after previous message
        setTimeout(() => {
          this._router.navigateByUrl("/account/login");
          this.forgotPasswordForm.enable();
        }, 5000);
      }, (error) => {
        // Emulate server delay
        setTimeout(() => {

          // Re-enable the form
          this.forgotPasswordForm.enable();

          // Reset the form
          this.forgotPasswordForm.reset({});

        }, 1000);
      });


  }

  Login(){
    this._router.navigate(['/account/login'])
  }

}
