import { Component } from '@angular/core';
import { SocialShareComponent } from '../../components/social-share/social-share.component';
import { AuthorBioComponent } from '../../components/author-bio/author-bio.component';
import { CommentsSectionComponent } from '../../components/comments-section/comments-section.component';
import { ZardAvatarComponent } from '@ui/avatar/avatar.component';

interface Author {
  username: string;
  avatar: string;
  bio: string;
}
interface Article {
  title: string;
  publishedDate: string;
  readTime: string;
  featuredImageUrl: string;
  featuredImageAlt: string;
  bodyHtml: string;
  author: Author;
}

@Component({
  selector: 'app-article',
  imports: [SocialShareComponent, AuthorBioComponent, CommentsSectionComponent, ZardAvatarComponent],
  templateUrl: './article.component.html',
  styles: ``,
})
export default class ArticleComponent {
  protected ALT_TEXT = "'s profile avatar'";
  author: Author = {
    username: 'Alex Johnson',
    avatar: 'https://picsum.photos/id/555/100/100',
    bio: "Alex is a senior product designer with over a decade of experience in creating intuitive and beautiful user interfaces. He's passionate about user-centric design and the intersection of technology and creativity.",
  };

  article: Article = {
    title: 'The Art of Minimalist Web Design',
    publishedDate: 'October 26, 2023',
    readTime: '7 min read',
    featuredImageUrl: 'https://picsum.photos/id/744/800/800',
    featuredImageAlt: 'Abstract gradient of blue and purple light trails on a dark background',
    author: this.author,
    bodyHtml: `
      <p>
        In a world saturated with digital noise, minimalism in web design isn't just an aesthetic choice; it's a strategic one. By stripping away the superfluous, we create experiences that are not only beautiful but also faster, more accessible, and profoundly user-centric. This article explores the core principles of minimalist design and how you can apply them to your own projects.
      </p>
      <h2 class="font-bold text-3xl text-neutral-light dark:text-neutral-dark pt-6 pb-2">Principle 1: Generous White Space</h2>
      <p>
        Often referred to as "negative space," white space is the empty area around elements on a page. It's not necessarily white; it's just the absence of content. Proper use of white space can improve readability, guide the user's eye, and create a sense of calm and order. It allows content to breathe, making it easier for users to digest information without feeling overwhelmed. Think of it as the silence between musical notes—it’s what gives the composition its rhythm and clarity.
      </p>
      <h2 class="font-bold text-3xl text-neutral-light dark:text-neutral-dark pt-6 pb-2">Principle 2: Simplicity in Color</h2>
      <p>
        A minimalist color palette is typically limited to two or three colors. This restraint helps to create a cohesive and visually uncluttered experience. Often, designs will feature a monochromatic or analogous color scheme, using a single vibrant accent color to draw attention to key interactive elements like buttons and links. This focused approach ensures that color serves a purpose, guiding user actions rather than distracting from the content.
      </p>
      <blockquote>
        <p class="border-l-4 border-primary pl-4 italic text-muted-light dark:text-muted-dark">“Perfection is achieved, not when there is nothing more to add, but when there is nothing left to take away.” - Antoine de Saint-Exupéry</p>
      </blockquote>
      <p>
        This quote perfectly encapsulates the ethos of minimalist design. It's about intentionality and purpose. Every element on the page must have a reason to be there. If it doesn't serve a clear function or enhance the user's understanding, it should be removed. This ruthless editing process is what leads to elegant, efficient, and effective design. By embracing these principles, you can create web experiences that are not just seen, but felt.
      </p>
    `,
  };
}
