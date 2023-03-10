import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-toast',
  template: `
    <div class="text-xl font-semibold mb-2">
    </div>

    <div class="h-2.5 bg-white/30">
      <div class="h-full bg-white duration-200 ease-in-out transition-[width]" [style.width.%]="progress"]>

      </div>
    </div>
  `,
  styles: [
  ]
})
export class ToastComponent implements OnInit {

  @Input() message?: string;
  @Input() progress?: number;

  constructor() { }

  ngOnInit(): void {
  }

}
