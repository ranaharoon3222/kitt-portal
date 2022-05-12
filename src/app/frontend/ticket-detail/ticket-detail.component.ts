import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StorageMap } from '@ngx-pwa/local-storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-ticket-detail',
  templateUrl: './ticket-detail.component.html',
  styleUrls: ['./ticket-detail.component.scss']
})
export class TicketDetailComponent implements OnInit {

  caseId: string = "";
  caseObj: any = null;
  commentList: Array<any> = [];
  showModalFlag = false;
  commentsForm!: FormGroup;
  commentsFormSubmitted: boolean = false;
  contactId: string = "";


  constructor(private _commonService: CommonService,
    private _storage: StorageMap,
    private _toastrService: ToastrService,
    private _spinner: NgxSpinnerService,
    private _formBuilder: FormBuilder) {
    _storage.get('caseId').subscribe((caseId: string) => {
      this.caseId = caseId;
      this.getCaseDetails();
      this.getPortalComments();
    });
    _storage.get('userDetails').subscribe((user: any) => {
      this.contactId = user?.contactId;
    });
  }

  ngOnInit(): void {
    this._spinner.show();
    this.commentsFormSubmitted = false;
    this.commentsForm = this._formBuilder.group({
      subject: [null, [Validators.required]],
      description: [null, [Validators.required]]
    });
  }

  //form control
  get formCtrl() {
    return this.commentsForm.controls;
  }

  getCaseDetails() {
    let url = 'Case/GetCaseById/' + this.caseId;

    this._commonService.getResult(url, "").subscribe((caseDetails: any) => {
      if (caseDetails != null) {
        this.caseObj = caseDetails;
        
      }
      // Hide spinner
      // this._spinner.hide();

    }, (error: any) => {
      // Hide spinner
      this._spinner.hide();
      this._toastrService.error("Something went wrong.", "Error");
    });
  }

  getPortalComments() {
    let url = 'Activity/GetActivitiesByCase/' + this.caseId;
    // let url = 'Activity/GetActivitiesByCase/9bb246a6-2668-eb11-8fed-28187879a315';

    this._commonService.getResult(url, "").subscribe((comments: any) => {
      if (comments?.activitiesVM != null) {
        this.commentList = comments?.activitiesVM;
        
        this.commentList.forEach((i: any) => {
          i.isActive = true;
        });
      }
      // Hide spinner
      this._spinner.hide();

    }, (error: any) => {
      // Hide spinner
      this._spinner.hide();
      this._toastrService.error("Something went wrong.", "Error");
    });
  }

  showModal() {
    this.showModalFlag = !this.showModalFlag;
  }

  showText(index: number) {
    if (this.commentList[index].isActive) {
      this.commentList[index].isActive = false;
    } else {
      this.commentList[index].isActive = true;
    }
  }

  modalCloseButton() {
    this.commentsForm.reset();
    this.commentsFormSubmitted = false;
    this.commentsForm.clearValidators();
    this.commentsForm.enable();
    this.showModalFlag = !this.showModalFlag;
  }

  submitComment() {
    this.commentsFormSubmitted = true;
    if (this.commentsForm.invalid) {
      return;
    }

    // Show spinner
    this._spinner.show();

    // Disable the form
    this.commentsForm.disable();
    let url = "Activity/CreatePortalCommentRegardingCase";

    let commentObj = {
      fromId: this.contactId,
      toId: this.caseObj?.owner.id,
      caseId: this.caseId,
      subject: this.commentsForm.get("subject").value,
      description: this.commentsForm.get("description").value
    }
    // remove it afterwards
    // commentObj.caseId = "9bb246a6-2668-eb11-8fed-28187879a315";

    this._commonService.post(url, commentObj).subscribe((res: any) => {
      this.getPortalComments();
      // Re-enable the form
      this.modalCloseButton();
      // Hide spinner
      this._spinner.hide();

    }, (error: any) => {
      // Re-enable the form
      this.commentsForm.enable();
      // Hide spinner
      this._spinner.hide();
      this._toastrService.error("Something went wrong.", "Error");
    });
  }

}
