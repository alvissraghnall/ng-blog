import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-layout",
  template: `
    <app-top-nav-bar></app-top-nav-bar>
    <router-outlet></router-outlet>
    <app-footer></app-footer>
  `,
  styles: [],
})
export class LayoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
