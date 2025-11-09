import { ZardButtonComponent } from "@components/button/button.component";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-hero-section",
  templateUrl: "./hero-section.component.html",
  styleUrls: ["./hero-section.component.css"],
  imports: [ZardButtonComponent],
})
export class HeroSectionComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
