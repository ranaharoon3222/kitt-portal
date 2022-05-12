import { Component, OnInit, ViewChild } from '@angular/core';
import { GoogleMap, MapInfoWindow } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from 'src/app/services/common.service';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit {
  @ViewChild(GoogleMap, { static: false }) map: GoogleMap
  // @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow
  openTab = 1;
  activityList: Array<any> = [];
  propertyId: string = "";
  propertyObj: Array<any> = [];
  propertyPhotoList: Array<any> = [];
  displayImg: string = "";
  tenantDocumentList: Array<any> = [];
  inspectionList: Array<any> = [];
  // map: google.maps.Map;

  // for google maps
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


  constructor(private _commonService: CommonService,
    private _activatedRoute: ActivatedRoute,
    private _toastrService: ToastrService,
    private _spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    // this.getActivityTimeline();

    // Show spinner
    this._spinner.show();

    this._activatedRoute.params.subscribe(params => {
      this.propertyId = params['id'];
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
    if ( map !== null){
      if (map.style.maxHeight) {
        map.style.maxHeight = null;
      } else {
        map.style.maxHeight = map.clientHeight + "px";
        this.mapHeight = map.clientHeight + "px";
      }
    }
  }

  toggleTabs($tabNumber: number) {
    this.openTab = $tabNumber;
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
        this.propertyPhotoList = photos?.picturesColl;
        this.displayImg = this.propertyPhotoList[0]?.photoUrl;
      }
      // Hide spinner
      this._spinner.hide();
    }, (error: any) => {
      // Hide spinner
      this._spinner.hide();
      this._toastrService.error("Something went wrong.", "Error");
    })
  }

  getPropertyTimeline() {
    let url = "Activity/GetPortalActivitiesbyEntity/cre96_property/" + this.propertyId;
    // let url = "Activity/GetPortalActivitiesbyEntity/account/488dbfd6-a357-eb11-a812-000d3a6b5ff4";
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

  displayImage(evt) {
    this.displayImg = evt;
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

  toggleAccordian(event, index) {
    const element = event.target;
    element.classList.toggle("active");
    if (this.inspectionList[index].isActive) {
      this.inspectionList[index].isActive = false;
    } else {
      this.inspectionList[index].isActive = true;
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
