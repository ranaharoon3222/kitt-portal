import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-support-tickets',
  templateUrl: './support-tickets.component.html',
  styleUrls: ['./support-tickets.component.scss']
})
export class SupportTicketsComponent implements OnInit {

  ticketsList: Array<any> = [];
  originalTicketsList: Array<any> = [];
  accountId: string = "";
  caseOptionList: Array<any> = [];
  statusList: Array<any> = [
    { 
      "value": null, 
      "label": "Status Filter" 
    },
    {
        "value": 0,
        "label": "Active"
    },
    {
        "value": 1,
        "label": "Resolved"
    },
    {
        "value": 2,
        "label": "Canceled"
    }
];
  @ViewChild('statusRef') status;
  @ViewChild('caseRef') cases;

  constructor(private _commonService: CommonService,
    private _toastrService: ToastrService,
    private _spinner: NgxSpinnerService,
    private _router: Router,
    private _storage: StorageMap,
    private _formBuilder: FormBuilder) {
    _storage.get('accountId').subscribe((accId: string) => {
      this.accountId = accId;
      this.getAccountSupportTickets();
      this.getCaseOptionSets();
    })
  }

  ngOnInit(): void {
    this._spinner.show();
  }

  getAccountSupportTickets() {
    let url = "Case/GetCasesByAccount/" + this.accountId;
    this._commonService.getResult(url, "").subscribe((tickets: any) => {
      if (tickets != null) {
        this.ticketsList = tickets?.caseColl;
        this.originalTicketsList = tickets?.caseColl;
      }
      // Hide spinner
      this._spinner.hide();
    }, (error: any) => {
      // Hide spinner
      this._spinner.hide();
      this._toastrService.error("Something went wrong.", "Error");
    });
  }

  getCaseOptionSets(): void {
    let url = "Case/GetCaseTypeOptionset?entityName=incident&optionSetName=casetypecode";

    this._commonService.getResult(url, "").subscribe((options: any) => {
      let defaultOptionSet = { value: null, label: "Case Type Filter" };
      this.caseOptionList.push(defaultOptionSet);
      options.forEach(i => {
        this.caseOptionList.push(i);
      })
      // this.getCaseStatus();
    }, (error: any) => {
      // Hide spinner
      this._spinner.hide();
      this._toastrService.error("Something went wrong.", "Error");
    });
  }

  // getCaseStatus(): void {
  //   let url = "./assets/caseStatus.json";

  //   this._commonService.loadJSONFileData(url).subscribe(resp => {
  //     if (resp && resp.length > 0) {
  //       let defaultOptionSet = { value: null, label: "Status Filter" };
  //       this.statusList.push(defaultOptionSet);
  //       resp.forEach(element => {
  //         this.statusList.push(element);
  //       });
  //     }
  //     // Hide spinner
  //     this._spinner.hide();
  //   }, (error: any) => {
  //     // Hide spinner
  //     this._spinner.hide();
  //     this._toastrService.error("Something went wrong.", "Error");
  //   });
  // }

  toggleAccordian(event, index) {
    const element = event.target;
    element.classList.toggle("active");
    if (this.ticketsList[index].isActive) {
      this.ticketsList[index].isActive = false;
    } else {
      this.ticketsList[index].isActive = true;
    }
    const panel = document.getElementById(index) as any;
    if (panel !== null) {
      if (panel.style.maxHeight) {
        panel.style.maxHeight = null;
      } else {
        panel.style.maxHeight = panel.scrollHeight + "px";
      }
    }
  }

  SupportTicketDetails(recordId: string) {
    this._storage.set('caseId', recordId).subscribe(() => { });
    this._router.navigate(['/frontend/ticket-detail']);
  }

  addCase(): void {
    this._router.navigate(['/frontend/add-case']);
  }

  applyCaseTypeFilter(value: any) {
    this.status.nativeElement.value = null;
    if (value !== "null") {
      this.ticketsList = this.originalTicketsList.filter((item: any) => item.caseType?.toString().indexOf(value) === 0)
    }
    else {
      this.ticketsList = this.originalTicketsList;
    }
  }

  applyStatusTypeFilter(value: any) {
    // this.cases.nativeElement.value = null;
    if (value !== "null") {
      this.ticketsList = this.originalTicketsList.filter((item: any) => item.status.toString().indexOf(value) === 0)
    }
    else {
      this.ticketsList = this.originalTicketsList;
    }
  }

  clearFilters(){
    this.ticketsList = this.originalTicketsList;

    this.status.nativeElement.value = null;
    this.cases.nativeElement.value = null;
  }

}
