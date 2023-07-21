import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-posts-loading-skeleton',
  templateUrl: './posts-loading-skeleton.component.html',
  styles: [`
    .odded {
      @apply md:!flex-row
    }
  `]
})
export class PostsLoadingSkeletonComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
