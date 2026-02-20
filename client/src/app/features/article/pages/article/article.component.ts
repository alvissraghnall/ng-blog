import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { PostsService } from '../../../post/services/posts.service';
import { CommentsService } from '../../../post/services/comments.service';
import { UserService } from '../../../../core/auth/services/user.service';
import { ArticleMetaComponent } from '../../components/article-meta.component';
import { AsyncPipe, NgClass } from '@angular/common';
import { MarkdownPipe } from '../../../../shared/pipes/markdown.pipe';
import { ListErrorsComponent } from '../../../../shared/components/list-errors.component';
import { ArticleCommentComponent } from '../../components/article-comment.component';
import { catchError } from 'rxjs/operators';
import { combineLatest, throwError } from 'rxjs';
import { IfAuthenticatedDirective } from '../../../../core/auth/if-authenticated.directive';
import { Errors } from '../../../../core/models/errors.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FavoriteButtonComponent } from '../../components/favorite-button.component';
import { FollowButtonComponent } from '../../../profile/components/follow-button.component';
import { Post, Comment } from '@/gql-types';

@Component({
  selector: 'app-article-page',
  templateUrl: './article.component.html',
  imports: [
    ArticleMetaComponent,
    RouterLink,
    NgClass,
    FollowButtonComponent,
    FavoriteButtonComponent,
    MarkdownPipe,
    AsyncPipe,
    ListErrorsComponent,
    FormsModule,
    ArticleCommentComponent,
    ReactiveFormsModule,
    IfAuthenticatedDirective,
  ],
})
export default class ArticleComponent implements OnInit {
  post!: Post;
  comments: Comment[] = [];
  canModify = false;

  commentControl = new FormControl<string>('', { nonNullable: true });
  commentFormErrors: Errors | null = null;

  isSubmitting = false;
  isDeleting = false;
  destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly router: Router,
    private readonly userService: UserService,
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.params['slug'];
    combineLatest([
      this.postsService.get(slug),
      this.userService.currentUser,
    ])
      .pipe(
        catchError(err => {
          void this.router.navigate(['/']);
          return throwError(() => err);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([post, currentUser]) => {
        this.post = post;
        this.canModify = currentUser?.id === post.author.id;
        this.loadComments(post.id);
      });
  }

  private loadComments(postId: number): void {
    this.commentsService.getAll(postId)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(comments => {
        this.comments = comments;
      });
  }

  onToggleFavorite(liked: boolean): void {
    if (liked) {
      this.post.likeCount++;
    } else {
      this.post.likeCount--;
    }
  }

  deleteArticle(): void {
    this.isDeleting = true;

    this.postsService
      .delete(this.post.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        void this.router.navigate(['/']);
      });
  }

  addComment() {
    this.isSubmitting = true;
    this.commentFormErrors = null;

    this.commentsService
      .create(this.post.id, this.commentControl.value)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: comment => {
          this.comments.unshift(comment);
          this.commentControl.reset('');
          this.isSubmitting = false;
        },
        error: errors => {
          this.isSubmitting = false;
          this.commentFormErrors = errors;
        },
      });
  }

  deleteComment(comment: Comment): void {
    this.commentsService
      .delete(comment.id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => {
        this.comments = this.comments.filter(item => item !== comment);
      });
  }
}
