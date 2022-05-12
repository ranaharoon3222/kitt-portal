import { Component, OnInit } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {

  userData: any;
  paymentsList: Array<any> = [];
  accountId: string = "";

  constructor(private _commonService: CommonService, private _toastrService: ToastrService, private _spinner: NgxSpinnerService, private _storage: StorageMap) {
    _storage.get('accountId').subscribe((accId: string) => {
      this.accountId = accId;
      this.getAccountPayments();
    })
  }

  ngOnInit(): void {
    this._spinner.show();
  }

  getAccountPayments() {
    let url = "Payment/GetPaymentsByAccount/" + this.accountId;
    this._commonService.getResult(url, "").subscribe((payments: any) => {
      if (payments != null) {
        this.paymentsList = payments?.paymentsColl;
      }
      // Hide spinner
      this._spinner.hide();
    }, (error: any) => {
      // Hide spinner
      this._spinner.hide();
      this._toastrService.error("Something went wrong.", "Error");
    })
  }

}
