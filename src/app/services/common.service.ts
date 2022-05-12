import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { environment as env } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class CommonService {
  account!: any;
  activity!: any;
  property!: any;
  propertyActivity!: any;
  apiUrl = env.apiUrl;

  private accountList = new BehaviorSubject<any>(this.account);
  latestAccountList = this.accountList.asObservable();
  private activityList = new BehaviorSubject<any>(this.activity);
  latestActivityList = this.activityList.asObservable();
  private propertyDetails = new BehaviorSubject<any>(this.property);
  showPropertyDetails = this.propertyDetails.asObservable();

  constructor(private httpClient: HttpClient) { }

  updateAccountList(accData: any) {
    this.accountList.next(accData);
  }

  updateActivityList(actData: any) {
    this.activityList.next(actData);
  }

  updatePropertyObj(propData: any) {
    this.propertyDetails.next(propData);
  }

  //Get All Result
  getAllDataTableResult(method: string, dtParams: any): Observable<any> {
    return this.httpClient.post(this.apiUrl + method, dtParams);
}

//Insert And update operation
insertUpdateDetail(method: string, body: any) {
    const headers = new HttpHeaders().set("content-type", "application/json");
    return this.httpClient.post(this.apiUrl + method, body, {
        headers,
        responseType: "text",
    });
}

//Insert And update operation with response type object 
insertUpdateDetailWithJsonResp(method: string, body: any): Observable<any> {
    const headers = new HttpHeaders().set("content-type", "application/json");
    return this.httpClient.post(this.apiUrl + method, body, {
        headers,
        responseType: "json",
    });
}

// Delete Operation
deleteDetail(method: string, body: any) {
    const headers = new HttpHeaders().set("content-type", "application/json");
    return this.httpClient.post(this.apiUrl + method, body, {
        headers,
        responseType: "text",
    });
}

//Get List or Object
getResult(method: string, dtParams: any): Observable<any> {
  return this.httpClient.get(this.apiUrl + method, dtParams);
}

//Insert And update operation with json response
post(method: string, body: any): Observable<any> {
    const headers = new HttpHeaders().set("content-type", "application/json");
    return this.httpClient.post(this.apiUrl + method, body, {
        headers,
        responseType: "json",
    });
}

//get data from json file
// loadJSONFileData(jsonPath): Observable<any> {
//     return this.httpClient.get(jsonPath);
// }
}
