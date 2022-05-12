import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-admin",
  templateUrl: "./admin.component.html",
})
export class AdminComponent implements OnInit {
  showHideSideBarFlag: boolean = true;
  constructor() {}

  ngOnInit(): void {}

  ShowHideSideBar(evt: any){
    this.showHideSideBarFlag = evt;
  }
}
