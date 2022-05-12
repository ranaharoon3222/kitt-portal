import { Component, OnInit } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-payments',
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {

paymentsList: Array<any> = [];
accountId: string ="";

  constructor(private _commonService: CommonService,
    private _toastrService: ToastrService,
    private _spinner: NgxSpinnerService,
    private _storage: StorageMap) {
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

  toggleAccordian(event, index) {
    const element = event.target;
    element.classList.toggle("active");
    if (this.paymentsList[index].isActive) {
      this.paymentsList[index].isActive = false;
    } else {
      this.paymentsList[index].isActive = true;
    }
    const panel = document.getElementById(index) as any;
    if ( panel !== null){
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    }
  }

}
