import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Post } from 'src/app/models/Post.model';
import { User } from 'src/app/models/User.model';
import { AuthService } from 'src/app/services/auth.service';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styles: [ `
    .cntnt .ql-editor { 
      font-size: 1.23rem !important;
      line-height: 1.5;
     }
  `]
})
export class PostDetailsComponent implements OnInit {

  _post?: Post;
  currentUser?: User
  _show: boolean = false;
  loading?: boolean;
  requestError?: any;

  constructor(
    private readonly postService: PostService,
    private readonly route: ActivatedRoute,
    private readonly authService: AuthService,
    private readonly _toastService: ToastrService,
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
    this.postService.getPost(id, 'no-cache')
      .subscribe(
        (results: any) => {
          this.loading = results.loading;
          if (results.errors as any[]) {
            this.requestError = results.errors[0]?.extensions?.response?.message;
          }
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
          if (!result.loading) {
            if ((result.errors as any[])?.find(item => (item.extensions.response.message as string).includes("Expired JWT"))) {
              this._toastService.error("Your session has expired. Please login again.");
              this.logout();
            } else if ((result.errors as any[])?.find(item => (item.extensions.response.message as string).includes("Invalid Authorization"))) {
              this._toastService.error("Something went wrong with your session. You are required to login.");
              this.logout();
            }
          }

          if (result.data?.likePost) {
            this.getPost(postId);
          }
        }
      )
  }

  showComments () {
    this._show = !this._show;
  }

  logout(): void {
    this.authService.logout();
    console.log(this.route.snapshot.url, this.route.snapshot.url.map(el => el.path).join("/"));
    setTimeout(() => this.router.navigate(["/login"], {
      queryParams: {
        url: this.route.snapshot.url.map(el => el.path).join("/")
      }
    }), 5000);
  }

  updatePost(postId: number) {
    console.log("updating on pd...")
    this.getPost(postId);
  }
}
