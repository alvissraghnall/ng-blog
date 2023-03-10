import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/Post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styles: []
})
export class PostDetailsComponent implements OnInit {

  post?: Post;

  constructor(
    private readonly postService: PostService,
    private readonly route: ActivatedRoute
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
  }

}
