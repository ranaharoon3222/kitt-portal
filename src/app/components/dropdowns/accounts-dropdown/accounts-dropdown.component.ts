import { ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { createPopper } from "@popperjs/core";

@Component({
  selector: 'app-accounts-dropdown',
  templateUrl: './accounts-dropdown.component.html',
  styleUrls: ['./accounts-dropdown.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AccountsDropdownComponent implements OnInit {
  dropdownPopoverShow = false;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef: ElementRef;
  displayImage: string = "";
  accountList: Array<any> = [];

  constructor(private _storage: StorageMap) { 
    // _storage.get("userDetails").subscribe((user: any)=>{
    //   this.accountList = user?.accountList;
    // })

  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    // createPopper(
    //   this.btnDropdownRef.nativeElement,
    //   this.popoverDropdownRef.nativeElement,
    //   {
    //     placement: "bottom-end",
    //   }
    // );
  }

  toggleDropdown(event) {
    // event.preventDefault();
    // if (this.dropdownPopoverShow) {
    //   this.dropdownPopoverShow = false;
    // } else {
    //   this.dropdownPopoverShow = true;
    // }
  }

}
