import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal.component';
import { SimpleModalModule } from 'ngx-simple-modal';



@NgModule({
  declarations: [
    ModalComponent
  ],
  imports: [
    CommonModule,
    SimpleModalModule
  ],
  exports: [ModalComponent]
})
export class ModalModule { }
