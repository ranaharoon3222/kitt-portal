import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CdkTreeModule } from '@angular/cdk/tree';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CdkTreeModule,
    
  ],
  exports: [
    CdkTreeModule,
    
  ]
})
export class SharedModule { }
