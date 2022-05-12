import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth.service';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  userData: any;
  propertyObj: any;
  ismenu = false;
  selectedacc = ''
  accDisplayName: string = "";
  accountId: any;
  accountList: Array<any> = [];
  notification: any = [];

  constructor(private _authService: AuthService, private _storage: StorageMap, private _toastrService: ToastrService, private _spinner: NgxSpinnerService, public _router: Router, private _commonService: CommonService) {
    _storage.get("userDetails").subscribe((user: any) => {
      this.userData = user;
      this.accountList = user?.accountList;
      if (user?.lastUsedAccount !== null && user?.lastUsedAccount !== undefined)
      {
        if (this.accountList !== null && this.accountList !== undefined) 
        {
          let lastSelectedAccountObj;
          this.accountList.forEach((i) => {
            if (i.recordID === this.userData?.lastUsedAccount) {
              lastSelectedAccountObj = i;
            }
          });
          // this.accDisplayName = lastSelectedAccountObj?.name;
          // this.callMultipleMethods(this.accountList[0]);
          this.setLastAccountId(lastSelectedAccountObj, this.userData?.contactId);
          this.selectAccount(lastSelectedAccountObj);
          this.getActivityTimeline(lastSelectedAccountObj?.recordID);
        }
      } 
      else 
      {
        if (this.accountList !== null && this.accountList !== undefined) 
        {
          this.accDisplayName = this.accountList[0]?.name;
          // this.callMultipleMethods(this.accountList[0]);
          this.setLastAccountId(this.accountList[0], this.userData?.contactId);
          this.selectAccount(this.accountList[0]);
          this.getActivityTimeline(this.accountList[0]?.recordID);
        }
      }
    });
   }

   ngOnInit(): void {
    this.getPropertyDetailsForHeader();
  }

  selectAccount(account: any): void {
    this.accDisplayName = account.name;
    let url =
      "RentalProperty/GetRentalPropertiesByAccountId/" + account.recordID;
      this._storage.set('accountId', account.recordID).subscribe(()=>{});
    this._commonService.getResult(url, "").subscribe(
      (resp: any) => {
        if (resp != null) {
          this._commonService.updateAccountList(resp?.rentalPropertyVM);
          this._spinner.hide();
        }
      },
      (error: any) => {
        this._spinner.hide();
        this._toastrService.error("Something went wrong.", "Error");
      }
    );
  }
  
  selectedaccount(account: any) {
    this._spinner.show();
    this.setLastAccountId(account, this.userData?.contactId);
    this.selectAccount(account);
    this.getActivityTimeline(account?.recordID);
    this._router.navigate(["/frontend/dashboard"]);
  }

  getPropertyDetailsForHeader(){
    this._commonService.showPropertyDetails.subscribe(x => {
      if (x !== undefined){
        this.propertyObj = x;
        localStorage.setItem('propertyObj', JSON.stringify(this.propertyObj));
      }
      else{
        let propObj = localStorage.getItem('propertyObj');
        this.propertyObj = JSON.parse(propObj);
      }
    })
  }

  getActivityTimeline(recordID: any): void {
    let url = "Activity/GetPortalActivitiesbyEntity/account/" + recordID;
    // let url = "Activity/GetPortalActivitiesbyEntity/account/488dbfd6-a357-eb11-a812-000d3a6b5ff4";
    this._commonService.getResult(url, "").subscribe(
      (activity: any) => {
        if (activity != null) {
          this._commonService.updateActivityList(activity?.portalActivitiesVM);
          
          this.notification = activity?.portalActivitiesVM;
          // Hide spinner
          this._spinner.hide();
        }
      },
      (error: any) => {
        this._toastrService.error("Something went wrong.", "Error");
      }
    );
  }

  setLastAccountId(account: any, contactId: string): void {
    let url = "Authenticate/UpdateRecentUsedAccountInContact/";
    let lastUsedAccountDM = {lastUsedAccount: account.recordID, contactId: contactId }
    this._commonService.post(url, lastUsedAccountDM).subscribe(
      (resp: any) => {
        this._spinner.hide();
      },
      (error: any) => {
        // Hide spinner
        this._spinner.hide();
        this._toastrService.error("Something went wrong.", "Error");
      }
    );
  }

  openmobilemenu() {
    this.ismenu = !this.ismenu
  }

  closemobilemenu() {
    this.ismenu = false;
  }

  logout(): void {
    this._authService.logout();
  }

}
