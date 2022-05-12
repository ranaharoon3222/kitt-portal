import { Component, AfterViewInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { StorageMap } from "@ngx-pwa/local-storage";
import { createPopper } from "@popperjs/core";
import { AuthService } from "src/app/services/auth.service";

@Component({
  selector: "app-user-dropdown",
  templateUrl: "./user-dropdown.component.html",
})
export class UserDropdownComponent implements AfterViewInit {
  dropdownPopoverShow = false;
  @ViewChild("btnDropdownRef", { static: false }) btnDropdownRef: ElementRef;
  @ViewChild("popoverDropdownRef", { static: false })
  popoverDropdownRef: ElementRef;
  displayImage: string = "";

  constructor(private _storage: StorageMap, private _authService: AuthService, private _router: Router) {
    _storage.get("userDetails").subscribe((user: any) => {
      let img = user?.entityImg;
      if (img !== null){
        this.displayImage = 'data:image/jpeg;base64,' + img;
      }
      else{
        this.displayImage = 'assets/img/no-image-found.png';
      }
    })
  }

  ngAfterViewInit() {
    createPopper(
      this.btnDropdownRef.nativeElement,
      this.popoverDropdownRef.nativeElement,
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

  changePassword(): void{
    this.dropdownPopoverShow = false;
    this._router.navigate(['/auth/change-password']);
  }

  logout(): void {
    this._authService.logout();
  }
}
