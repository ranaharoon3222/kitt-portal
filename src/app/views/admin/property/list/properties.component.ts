import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {
  openTab = 1;
  accountList: Array<any> = [];

  constructor(private commonService: CommonService, private _router: Router, private _spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // Show spinner
    this._spinner.show()
    this.getLatestAccountList();
  }

  getLatestAccountList() {
    this.commonService.latestAccountList.subscribe(x => {
      this.accountList = x;
      // Hide spinner
      this._spinner.hide();
    });
  }

  showProperty(account: any) {
    this.commonService.updatePropertyObj(account);
    this._router.navigate(['/admin/property/' + account?.recordID]);
  }

}
