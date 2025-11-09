import { Component } from '@angular/core';
import { Article, ArticleCardComponent } from '@components/article-card/article-card.component';

@Component({
  selector: 'app-latest-posts',
  imports: [ArticleCardComponent],
  template: `
    <section class="bg-surface-light dark:bg-surface-dark py-12 md:py-20">
      <div class="max-w-6xl mx-auto px-4 sm:px-6">
        <div class="text-center pb-12 md:pb-16">
          <h2 class="text-3xl md:text-4xl font-display font-bold text-text-light dark:text-text-dark">
            Latest Articles
          </h2>
        </div>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          @for (article of articles; track article.id) {
            <app-article-card [article]="article" />
          }
        </div>
      </div>
    </section>
  `,
  styles: ``,
})
export class LatestPostsComponent {
  articles: Article[] = [
    {
      id: 1,
      title: 'The Future of Remote Collaboration',
      description: 'Exploring the tools and techniques that will define the next generation of digital teamwork.',
      author: 'Waribo Jaja',
      date: 'Oct 26, 2023',
      imageUrl: 'https://picsum.photos/id/371/800/700',
      imageAlt: 'Abstract vibrant seas flowing in opposite directions',
    },
    {
      id: 2,
      title: 'Crafting the Perfect Morning Routine',
      description: 'How a structured start to your day can significantly boost productivity and well-being.',
      author: 'Carl Jenkinson',
      date: 'Oct 25, 2023',
      imageUrl: 'https://picsum.photos/id/311/800/700',
      imageAlt: 'Close-up of a vintage typewriter keyboard',
    },
    {
      id: 3,
      title: 'Sustainable Tech: A Contradiction?',
      description: 'A deep dive into the environmental impact of our digital lives and the path to a greener future.',
      author: 'Monica Lewinsky',
      date: 'Oct 24, 2023',
      imageUrl: 'https://picsum.photos/id/67/800/700',
      imageAlt: "A person's hands pushing a mechanical lever",
    },
    {
      id: 4,
      title: 'The Art of Storytelling in Design',
      description: "Learn how narrative can transform a user's experience from functional to unforgettable.",
      author: 'Samson Siasia',
      date: 'Oct 23, 2023',
      imageUrl: 'https://picsum.photos/id/500/800/700',
      imageAlt: 'A person designing a wireframe',
    },
    {
      id: 5,
      title: 'Navigating the AI Revolution',
      description: 'A practical guide for creatives and professionals on leveraging artificial intelligence.',
      author: 'Alex Johansson',
      date: 'Oct 22, 2023',
      imageUrl: 'https://picsum.photos/id/128/800/700',
      imageAlt: 'Water bending boarding haha',
    },
    {
      id: 6,
      title: 'Mental Models for Better Decisions',
      description: 'Improve your thinking by understanding these fundamental frameworks for problem-solving.',
      author: 'Steele Cookey',
      date: 'Oct 21, 2023',
      imageUrl: 'https://picsum.photos/id/299/800/700',
      imageAlt: 'A gun talking, a.k.a. Nas',
    },
  ];
}
