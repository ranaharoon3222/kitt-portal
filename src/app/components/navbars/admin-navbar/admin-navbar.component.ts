import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { Router } from "@angular/router";
import { StorageMap } from "@ngx-pwa/local-storage";
import { createPopper, popper } from "@popperjs/core";
import { NgxSpinnerService } from "ngx-spinner";
import { ToastrService } from "ngx-toastr";
import { CommonService } from "src/app/services/common.service";
import { DashboardComponent } from "src/app/views/admin/dashboard/dashboard.component";

@Component({
  selector: "app-admin-navbar",
  templateUrl: "./admin-navbar.component.html",
  styleUrls: ["./admin-navbar.component.css"],
})
export class AdminNavbarComponent implements OnInit {
  @Output() showSidebar: EventEmitter<boolean> = new EventEmitter();
  showSidebarFlag: boolean = true;
  dropdownPopoverShow = false;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef: ElementRef;
  @ViewChild(DashboardComponent) dashboardComp: DashboardComponent;
  displayImage: string = "";
  accountList: Array<any> = [];
  accDisplayName: string = "";
  userData: any;

  constructor(
    private _storage: StorageMap,
    private _commonService: CommonService,
    private _toastrService: ToastrService,
    private _spinner: NgxSpinnerService,
    private _router: Router
  ) {
    _storage.get("userDetails").subscribe((user: any) => {
      this.userData = user;
      this.accountList = user?.accountList;
      if (
        user?.lastUsedAccount !== null &&
        user?.lastUsedAccount !== undefined
      ) {
        if (this.accountList !== null && this.accountList !== undefined) {
          let lastSelectedAccountObj;
          this.accountList.forEach((i) => {
            if (i.recordID === this.userData?.lastUsedAccount) {
              lastSelectedAccountObj = i;
            }
          });

          this.accDisplayName = lastSelectedAccountObj?.name;
          // this.callMultipleMethods(this.accountList[0]);
          this.setLastAccountId(
            lastSelectedAccountObj,
            this.userData?.contactId
          );
          this.selectAccount(lastSelectedAccountObj);
          this.getActivityTimeline(lastSelectedAccountObj?.recordID);
        }
      } else {
        if (this.accountList !== null && this.accountList !== undefined) {
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
    this.showSidebarFlag = true;
    this.dropdownPopoverShow = false;
  }

  ngAfterViewInit() {
    createPopper(
      this.btnDropdownRef.nativeElement,
      this.popoverDropdownRef.nativeElement,
      {
        placement: "bottom-start",
      }
    );
  }

  toggleDropdown(event) {
    event.preventDefault();
    if (this.dropdownPopoverShow) {
      this.dropdownPopoverShow = false;
    } else {
      this.dropdownPopoverShow = true;
    }
  }

  toggleSidebar() {
    this.showSidebarFlag = !this.showSidebarFlag;
    this.showSidebar.emit(this.showSidebarFlag);
  }

  callMultipleMethods(account: any) {
    // Show spinner
    this._spinner.show();
    this.setLastAccountId(account, this.userData?.contactId);
    this.selectAccount(account);
    this.getActivityTimeline(account?.recordID);
    this._router.navigate(["/admin/dashboard"]);
  }

  selectAccount(account: any): void {
    this.accDisplayName = account.name;
    this.dropdownPopoverShow = false;
    let url =
      "RentalProperty/GetRentalPropertiesByAccountId/" + account.recordID;
    this._storage.set("accountId", account.recordID).subscribe(() => {});
    // let url = "RentalProperty/GetRentalPropertiesByAccountId/9781c213-d1eb-ea11-a815-000d3acb4083";
    // let url = "RentalProperty/GetRentalPropertiesByAccountId/488dbfd6-a357-eb11-a812-000d3a6b5ff4";

    this._commonService.getResult(url, "").subscribe(
      (resp: any) => {
        if (resp != null) {
          this._commonService.updateAccountList(resp?.rentalPropertyVM);

          // Hide spinner
          this._spinner.hide();
        }
      },
      (error: any) => {
        // Hide spinner
        this._spinner.hide();
        this._toastrService.error("Something went wrong.", "Error");
      }
    );
  }

  getActivityTimeline(recordID: any): void {
    let url = "Activity/GetPortalActivitiesbyEntity/account/" + recordID;
    // let url = "Activity/GetPortalActivitiesbyEntity/account/488dbfd6-a357-eb11-a812-000d3a6b5ff4";
    this._commonService.getResult(url, "").subscribe(
      (activity: any) => {
        if (activity != null) {
          this._commonService.updateActivityList(activity?.portalActivitiesVM);

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
    // let url = "RentalProperty/GetRentalPropertiesByAccountId/9781c213-d1eb-ea11-a815-000d3acb4083";
    // let url = "RentalProperty/GetRentalPropertiesByAccountId/488dbfd6-a357-eb11-a812-000d3a6b5ff4";
    let lastUsedAccountDM = {
      lastUsedAccount: account.recordID,
      contactId: contactId,
    };
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
}
