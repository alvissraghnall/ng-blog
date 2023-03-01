import { Component, OnInit } from '@angular/core';
import { SimpleModalComponent } from 'ngx-simple-modal';
import { ModalService } from 'src/app/services/modal.service';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styles: []
})
export class ModalComponent<T> extends SimpleModalComponent<null, boolean> implements OnInit {

  display = true;

  constructor(private modalService: ModalService<T>) {
    super();
  }

  confirm() {
    // we set modal result as true on click on confirm button,
    // then we can get modal result from caller code
    this.result = true;
    this.close();
  }

  ngOnInit(): void {
  }

}
