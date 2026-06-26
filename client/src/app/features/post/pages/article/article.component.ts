import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PostsService } from '../../services/posts.service';
import type { Post } from '@/gql-types';
import { SocialShareComponent } from '../../components/social-share/social-share.component';
import { AuthorBioComponent } from '../../components/author-bio/author-bio.component';
import { CommentsSectionComponent } from '../../components/comments-section/comments-section.component';
import { ZardAvatarComponent } from '@ui/avatar/avatar.component';

function estimateReadTime(content: string): string {
  const words = content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

@Component({
  selector: 'app-article',
  imports: [RouterLink, SocialShareComponent, AuthorBioComponent, CommentsSectionComponent, ZardAvatarComponent],
  templateUrl: './article.component.html',
  styles: ``,
})
export default class ArticleComponent implements OnInit {
  protected ALT_TEXT = "'s profile avatar'";
  post: Post | null = null;
  isLoading = true;
  readTime = '';
  protected defaultImage = 'assets/images/default-post.png';
  protected defaultAvatar = 'assets/images/default-avatar.png';

  private destroyRef = inject(DestroyRef);

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
  ) {}

  ngOnInit(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (!slug) {
      this.isLoading = false;
      return;
    }

    this.postsService.get(slug)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: post => {
          const avatar = post.author.avatar ?? this.defaultAvatar;
          const bio = post.author.bio ?? '';
          const image = post.image ?? this.defaultImage;
          this.post = {
            ...post,
            image,
            author: { username: post.author.username, avatar, bio },
            createdAt: formatDate(post.createdAt),
          } as Post;
          this.readTime = estimateReadTime(post.content);
          this.isLoading = false;
        },
        error: () => {
          this.isLoading = false;
        },
      });
  }
}
