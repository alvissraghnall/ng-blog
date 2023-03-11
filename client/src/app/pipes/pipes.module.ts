import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimeSincePipe } from './time-since.pipe';



@NgModule({
  declarations: [
    TimeSincePipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    TimeSincePipe
  ]
})
export class PipesModule { }
