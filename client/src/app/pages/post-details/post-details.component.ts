import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from 'angular-toastify';
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

  _post?: Post;
  currentUser?: User

  constructor(
    private readonly postService: PostService,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly _toastService: ToastService,
    private readonly router: Router
  ) { }

  ngOnInit(): void {
    const postId = Number(this.route.snapshot.paramMap.get("id"));
    console.log(postId, this.post);
    this.getPost(postId);
    
    console.log(this.post);
    this.currentUser = this.authService.getCurrentUser();
  }

  getPost (id: number) {
    this.postService.getPost(id)
      .subscribe(
        (results: any) => {
          console.log(results);
          this.post = results.data?.post;
        }
      );
  }

  get post (): Post | undefined {
    return this._post;
  }

  set post (post: Post | undefined) {
    this._post = post;
  }

  likePost (postId: number) {
    this.postService.likePost(postId)
      .subscribe(
        (result: any) => {
          console.log(result);
          if ((result.errors as any[]).find(item => (item.extensions.response.message as string).includes("Expired JWT"))) {
            this._toastService.error("Your session has expired. Please login again.");
            this.logout();
          } else if ((result.errors as any[]).find(item => (item.extensions.response.message as string).includes("Invalid JWT"))) {
            this._toastService.error("Something went wrong with your session. You are required to login.");
            this.logout();
          }

          if (result.data?.likePost) {
            this.getPost(postId);
          }
        }
      )
  }

  logout(): void {
    this.authService.logout();
    setTimeout(() => this.router.navigate(["/login"]), 5000);
  }
}
