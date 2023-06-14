import { Component, Input, OnInit, OnChanges, EventEmitter, Output } from '@angular/core';
import { Post } from '../../models/Post.model';
import { User } from 'src/app/models/User.model';
import { Apollo } from 'apollo-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CreateCommentInput } from '@models/inputs/create-comment.input';
import { CommentService } from 'src/app/services/comment.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@app/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-post-comments',
  templateUrl: './post-comments.component.html',
  styles: [
  ]
})
export class PostCommentsComponent implements OnInit, OnChanges {

  @Input() post?: Post;
  @Input() currentUser?: User;
  @Input() show?: boolean;
  @Output() onComment = new EventEmitter<number>();

  threeDotMenuOpen: boolean = false;
  createCommentForm!: FormGroup;
  isSubmitting = false;

  constructor(
    private readonly fb: FormBuilder,
    private readonly commentService: CommentService,
    private readonly _toastService: ToastrService,
    private readonly authService: AuthService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
  ) { }

  ngOnInit(): void {
    this.createCommentForm = this.fb.group({
      text: ["", [Validators.required, Validators.minLength(3), ]]
    })
  }

  ngOnChanges (): void {

  }

  toggleThreeDotMenuOpen () {
    this.threeDotMenuOpen = !this.threeDotMenuOpen;
  }

  submitComment (): void {
    // console.log(this.createCommentForm);
    let self = this;
    const createCommentInput: CreateCommentInput = {
      text: self.createCommentForm?.value.text,
      postId: self.post?.id ?? 0
    }

    this.commentService.createComment(createCommentInput)
      .subscribe(
        (results: any) => {
          console.log(results);
          this.isSubmitting = results.loading;

          if (!results.loading) {
            if ((results.errors as any[])?.find(item => (item.extensions.response.message as string).includes("Expired JWT"))) {
              this._toastService.error("Your session has expired. Please login again.");
              this.logout();
            } else if ((results.errors as any[])?.find(item => (item.extensions.response.message as string).includes("Invalid Authorization"))) {
              this._toastService.error("Something went wrong with your session. You are required to login.");
              this.logout();
            }
          }
          
          if (results.data?.createComment) {
            this.refreshPost(this.post?.id ?? 0);
          }
        }
      )
  }

  public refreshPost (postId: number): void {
    console.log("refresh pcc");
    this.onComment.emit(postId);
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

}
