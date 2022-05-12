import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-add-request',
  templateUrl: './add-request.component.html',
  styleUrls: ['./add-request.component.css']
})
export class AddRequestComponent implements OnInit {
  accountId: string = "";
  accountObj: any = null;
  caseForm!: FormGroup;
  caseFormSubmitted: boolean = false;
  contactObj: any = null;
  caseOptionList: Array<any> = [];
  accountPropertyList: Array<any> = [];

  constructor(private _commonService: CommonService,
    private _storage: StorageMap,
    private _toastrService: ToastrService,
    private _spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder,
    private _router: Router) {
    _storage.get('accountId').subscribe((accId: string) => {
      this.accountId = accId;
    });
    _storage.get('userDetails').subscribe((user: any) => {
      this.contactObj = new Object();
      this.contactObj.id = user?.contactId;
      this.contactObj.name = user?.fullName;
      this.accountObj = null;
      user?.accountList.filter(i => {
        if (i.recordID == this.accountId) {
          this.accountObj = i;
          this.getCaseOptionSets();
          this.patchFormValues();
        }
      });
    });
  }

  ngOnInit(): void {
    this._spinner.show();
    this.caseFormSubmitted = false;
    this.caseForm = this._formBuilder.group({
      title: ['', [Validators.required]],
      caseType: [null, [Validators.required]],
      contactId: [null],
      customerId: [null],
      rentPropId: [null, [Validators.required]],
      description: ['']
    });
    this.getPropertyList();
  }


  patchFormValues(): void {
    this.caseForm.patchValue({
      contactId: this.contactObj.name,
      customerId: this.accountObj.name
    })
    this.caseForm.controls['contactId'].disable();
    this.caseForm.controls['customerId'].disable();
    this.caseForm.updateValueAndValidity();
  }

  //form control
  get formCtrl() {
    return this.caseForm.controls;
  }

  getCaseOptionSets(): void {
    let url = "Case/GetCaseTypeOptionset?entityName=incident&optionSetName=casetypecode";

    this._commonService.getResult(url, "").subscribe((options: any) => {
      this.caseOptionList = options;
      // Hide spinner
      this._spinner.hide();
    }, (error: any) => {
      // Hide spinner
      this._spinner.hide();
      this._toastrService.error("Something went wrong.", "Error");
    });
  }

  getPropertyList(): void {
    this._commonService.latestAccountList.subscribe(x => {
      this.accountPropertyList = x;
    })
  }

  submitCase() {
    this.caseFormSubmitted = true;
    if (this.caseForm.invalid) {
      return;
    }

    // Show spinner
    this._spinner.show();

    // Disable the form
    this.caseForm.disable();
    let url = "Case/CreateCase";

    let caseObj = {
      title: this.caseForm.get('title').value,
      caseType: parseInt(this.caseForm.get('caseType').value),
      contactId: this.contactObj?.id,
      customerId: this.accountObj?.recordID,
      rentPropId: this.caseForm.get('rentPropId').value,
      description: this.caseForm.get("description").value
    }

    this._commonService.post(url, caseObj).subscribe((res: any) => {
      if (res !== null){
        this._toastrService.success("Case created successfully", "Success");
        this._router.navigate(['/admin/support-tickets']);
      }

      // Hide spinner
      this._spinner.hide();
      this.caseForm.enable();

    }, (error: any) => {
      // Hide spinner
      this._spinner.hide();
      this.caseForm.enable();
      this._toastrService.error("Something went wrong.", "Error");
    });
  }

}
