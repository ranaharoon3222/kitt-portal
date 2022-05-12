import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';
import { OwlOptions } from 'ngx-owl-carousel-o';

// import $ from 'jquery';

declare var $: any;

@Component({
  selector: 'app-properties-view',
  templateUrl: './properties-view.component.html',
  styleUrls: ['./properties-view.component.scss']
})
export class PropertiesViewComponent implements OnInit {
  imageObject: Array<any> = [];
  tabname = 'Overview';
  activityList: Array<any> = [];
  propertyId: string = "";
  bathRoom: number = 0;
  bedRoom: number = 0;
  propertyObj: Array<any> = [];
  propertyPhotoList: Array<any> = [];
  displayImg: string = "";
  tenantDocumentList: Array<any> = [];
  inspectionList: Array<any> = [];
  zoom = 12
  center: google.maps.LatLngLiteral
  options: google.maps.MapOptions = {
    mapTypeId: 'hybrid',
    zoomControl: true,
    scrollwheel: true,
    disableDoubleClickZoom: true,
    maxZoom: 20,
    minZoom: 2,
  };
  marker!: any;
  mapHeight: any;
  // infoContent!: any;

  // for carousel
  cellHeight: number = 50;
  cellWidth: number = 50;
  width: number = 300;

  constructor(private _commonService: CommonService, private _activatedRoute: ActivatedRoute, private _toastrService: ToastrService, private _spinner: NgxSpinnerService, private cd: ChangeDetectorRef) {

  }




  ngOnInit(): void {
    this._spinner.show();
    this._activatedRoute.queryParams.subscribe((params) => {
      this.propertyId = params.recordId;
      this.bathRoom = params.bathRoom;
      this.bedRoom = params.bedRoom;
      this.getPropertyDetails();
      this.getPropertyTimeline();
      this.getPropertyPhotos();
      this.getPropertyInspections();
    })
    navigator.geolocation.getCurrentPosition((position) => {
      this.center = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      }
      this.addMarker();
    })

    setTimeout(() => {
      $(".img-div").click(function () {
        var img = $(this).find(".custom-image-main img"); 
        var img_src = img.attr("src"); 
          $('.pre-main-img').attr('src', img_src);
      });
    }, 1000);

  }




  addMarker() {
    this.marker = {
      position: {
        lat: this.propertyObj[0]?.latitude,
        lng: this.propertyObj[0]?.longitude
      },
      label: {
        color: 'red',
        text: this.propertyObj[0]?.address + ", " + this.propertyObj[0]?.addressLine2 + ", " + this.propertyObj[0]?.city
      },
      title: this.propertyObj[0]?.address + ", " + this.propertyObj[0]?.addressLine2 + ", " + this.propertyObj[0]?.city,
      options: { animation: google.maps.Animation.BOUNCE }
    };

    const map = document.getElementById('map') as any;
    if (map !== null) {
      if (map.style.maxHeight) {
        map.style.maxHeight = null;
      } else {
        map.style.maxHeight = map.clientHeight + "px";
        this.mapHeight = map.clientHeight + "px";
      }
    }
  }

  getPropertyDetails() {
    let url = "RentalProperty/GetRentalPropertyAndTenancyById/" + this.propertyId;
    this._commonService.getResult(url, "").subscribe((resp: any) => {
      if (resp != null) {
        this.propertyObj = resp;

        navigator.geolocation.getCurrentPosition((position) => {
          this.center = {
            lat: this.propertyObj[0]?.latitude,
            lng: this.propertyObj[0]?.longitude,
          }
          this.addMarker();
          this.cd.detectChanges();
        })
        this.getTenantAccountDocuments(this.propertyObj[1]?.tenantAccID);
      }
      // Hide spinner
      this._spinner.hide();
    }, (error: any) => {
      // Hide spinner
      this._spinner.hide();
      this._toastrService.error("Something went wrong.", "Error");
    })
  }

  getPropertyPhotos() {
    let url = "RentalProperty/GetPhotosOfRentalProperty/" + this.propertyId;
    this._commonService.getResult(url, "").subscribe((photos: any) => {
      if (photos != null) {
        photos?.picturesColl?.forEach(element => {
          let obj = {
            image: element.photoUrl,
            thumbImage: element.photoUrl,
          }
          this.imageObject.push(obj);
        });
        this.propertyPhotoList = photos?.picturesColl;
        this.displayImg = this.propertyPhotoList[0]?.photoUrl;

      }


      // Hide spinner
      this._spinner.hide();
    }, (error: any) => {
      // Hide spinner
      this._spinner.hide();
      this._toastrService.error("Something went wrong.", "Error");
    },
    )
  }

  getPropertyTimeline() {
    let url = "Activity/GetPortalActivitiesbyEntity/cre96_property/" + this.propertyId;
    this._commonService.getResult(url, "").subscribe((activity: any) => {
      if (activity != null) {
        this.activityList = activity?.portalActivitiesVM;
      }
      // Hide spinner
      this._spinner.hide();
    }, (error: any) => {
      // Hide spinner
      this._spinner.hide();
      this._toastrService.error("Something went wrong.", "Error");
    })
  }

  getTenantAccountDocuments(tenantId: any) {
    let url = "Sharepoint/GetTenancyDocumentsByAccount/" + tenantId;
    this._commonService.getResult(url, "").subscribe((docs: any) => {
      if (docs != null) {
        this.tenantDocumentList = docs?.tenancyDocuments;
      }
      // Hide spinner
      this._spinner.hide();
    }, (error: any) => {
      // Hide spinner
      this._spinner.hide();
      this._toastrService.error("Something went wrong.", "Error");
    })
  }

  getPropertyInspections() {
    let url = "RentalProperty/GetPropertyInspectionsByRentalProperty/" + this.propertyId;
    this._commonService.getResult(url, "").subscribe((inspections: any) => {
      if (inspections != null) {
        this.inspectionList = inspections?.propertyInspectionsVM;
      }
      // Hide spinner
      this._spinner.hide();
    }, (error: any) => {
      // Hide spinner
      this._spinner.hide();
      this._toastrService.error("Something went wrong.", "Error");
    })
  }

  toggletab(tabname: any) {
    this.tabname = tabname;
    $(document).ready(function () {
      $('.owl-carousel').owlCarousel({
        loop: true,
        margin: 10,
        nav: true,
        responsive: {
          0: {
            items: 1
          },
          600: {
            items: 3
          },
          1000: {
            items: 5
          }
        }
      })
    });
  }

}
