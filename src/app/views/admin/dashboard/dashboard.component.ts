import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { CommonService } from "src/app/services/common.service";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.component.html",
})
export class DashboardComponent implements OnInit {
  accountList: Array<any> = [];
  activityList: Array<any> = [];

  constructor(private _commonService: CommonService, private _router: Router) {}

  ngOnInit() {
    this.getLatestAccountList();
    this.getActivityTimeline();
  }

  getLatestAccountList() {
    this._commonService.latestAccountList.subscribe(x => {
      this.accountList = x;
    });
  }

  getActivityTimeline(){
    this._commonService.latestActivityList.subscribe(x => {
      this.activityList = x;
    });
  }

  showProperty(account: any){
    this._commonService.updatePropertyObj(account);
    this._router.navigate(['/admin/property/' + account?.recordID]);
  }
}
