import { Component, Input, OnInit } from '@angular/core';
import { Post } from '../../models/Post.model';
import { User } from 'src/app/models/User.model';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styles: [
  ]
})
export class PostCommentsComponent implements OnInit {

  @Input() post?: Post;
  @Input() currentUser?: User;
  @Input() show?: boolean;
  threeDotMenuOpen: boolean = false;

  constructor() { }

  ngOnInit(): void {
    // this.post?.comments[0].author.avatar
    // this.post?.comments[0].createdAt
    // this.currentUser?.avatar
  }

  toggleThreeDotMenuOpen () {
    this.threeDotMenuOpen = !this.threeDotMenuOpen;
  }

}
