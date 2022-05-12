import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { StorageMap } from "@ngx-pwa/local-storage";
import { CommonService } from "src/app/services/common.service";

@Component({
  selector: "app-header-stats",
  templateUrl: "./header-stats.component.html",
})
export class HeaderStatsComponent implements OnInit {
  userData: any;
  propertyObj: any;

  constructor(private _storage: StorageMap, public _router: Router, private _commonService: CommonService) {
    _storage.get("userDetails").subscribe((user:any)=>{
      this.userData = user;
    })
  }

  ngOnInit(): void {
    this.getPropertyDetailsForHeader();
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

}
