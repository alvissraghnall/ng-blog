import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/Post.model';
import { User } from 'src/app/models/User.model';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styles: []
})
export class PostDetailsComponent implements OnInit {

  post?: Post;
  currentUser?: User

  constructor(
    private readonly postService: PostService,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService
  ) { }

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get("id"));
    console.log(postId, this.post);
    
    this.postService.getPost(postId)
      .subscribe(
        (results: any) => {
          console.log(results);
          this.post = results.data?.post;
        }
      );
    console.log(this.post);
    this.currentUser = this.authService.getCurrentUser();
  }

}
