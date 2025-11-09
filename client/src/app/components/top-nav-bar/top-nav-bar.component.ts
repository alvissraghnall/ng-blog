import { ZardButtonComponent } from "@components/button/button.component";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-top-nav-bar",
  templateUrl: "./top-nav-bar.component.html",
  styleUrls: ["./top-nav-bar.component.css"],
  imports: [ZardButtonComponent],
})
export class TopNavBarComponent implements OnInit {
  private links = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "About",
      href: "/about",
    },
    {
      name: "Contribute",
      href: "/contribute",
    },
    {
      name: "Blog",
      href: "/blog",
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
