import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <footer class="items-center justify-between mt-24 p-5 bg-lime-600 flex text-xs flex">
      <img src="../../../assets/logo.png" alt="logo" class="h-[70px]" />
      <span>
        Made with ❤️ && Angular!
      </span>
    </footer>

  `,
  styles: []
})
export class FooterComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
