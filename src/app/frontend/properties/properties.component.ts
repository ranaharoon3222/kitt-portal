import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit(): void {
  }

  propertiesview() {
    this.router.navigate(['/frontend/properties-view']);
  }

}
