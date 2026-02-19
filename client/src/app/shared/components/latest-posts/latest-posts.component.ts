import { Category } from '@/gql-types';
import { Component } from '@angular/core';
import { Article, ArticleCardComponent } from '@components/article-card/article-card.component';

@Component({
  selector: 'app-latest-posts',
  imports: [ArticleCardComponent],
  template: `
    <section class="bg-background py-12 md:py-20">
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
  articles = [
    {
      "id": 1,
      "title": "Understanding TypeORM Decorators",
      "content": "<p>TypeORM is a powerful ORM but the decorators can be tricky at first glance.</p><p>Here is a quick breakdown:</p><ul><li><strong>@Entity()</strong>: Marks a class as a database table.</li><li><strong>@Column()</strong>: Marks a property as a table column.</li></ul><blockquote><em>\"Always define your primary key explicitly!\"</em></blockquote><p>You can also use relations like <code>@ManyToOne</code> to link tables together seamlessly.</p>",
      "image": "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000",
      "desc": "A deep dive into how TypeORM decorators map your classes to database tables and columns.",
      "category": Category.TECHNOLOGY,
      "slug": "understanding-typeorm-decorators-x92k1",
      "tags": [
        { "id": 1, "name": "Backend" },
        { "id": 2, "name": "NodeJS" }
      ],
      "comments": [
        {
          "id": 101,
          "text": "This finally helped me understand @ManyToMany! Thanks Xavier.",
          "post": null,
          "author": {
            "id": crypto.randomUUID().toString(),
            "username": "dev_sarah",
            "name": "Sarah Connor"
          },
          "likes": null,
          "likeCount": 12,
          "createdAt": "2023-11-10T08:30:00Z",
          "updatedAt": "2023-11-10T08:30:00Z"
        },
        {
          "id": 102,
          "text": "Do you have a guide on Subscribers? I'm struggling with events.",
          "post": null,
          "author": {
            "id": crypto.randomUUID().toString(),
            "username": "newbie_coder",
            "name": "John Smith"
          },
          "likes": null,
          "likeCount": 2,
          "createdAt": "2023-11-11T14:20:00Z",
          "updatedAt": "2023-11-11T14:20:00Z"
        }
      ],
      "likes": null,
      "author": {
        "id": crypto.randomUUID().toString(),
        "username": "xavier",
        "name": "Xavier Doe"
      },
      "likeCount": 42,
      "commentCount": 2,
      "deletedAt": null,
      "views": 120,
      createdAt: new Date(),
      updatedAt: new Date().toISOString(),
    },
    {
      "id": 2,
      "title": "Morning Routines for Productivity",
      "content": "<h2>Start with Water</h2><p>Before reaching for that coffee, drink a full glass of water. It rehydrates your body after a long sleep.</p><h2>The 5-Minute Journal</h2><p>Taking just five minutes to write down what you are grateful for can shift your entire mindset for the day.</p><p><br></p><p>Consistency is key. It takes 21 days to form a habit.</p>",
      "image": "https://images.unsplash.com/photo-1484627147104-f5197bcd6651?auto=format&fit=crop&q=80&w=1000",
      "desc": "Simple habits to implement in your morning to boost focus and energy throughout the day.",
      "category": Category.LIFESTYLE,
      "slug": "morning-routines-productivity-a8b2q",
      "tags": [
        { "id": 3, "name": "Health" },
        { "id": 4, "name": "Self-Care" }
      ],
      "comments": null,
      "likes": null,
      "author": {
        "id": crypto.randomUUID().toString(),
        "username": "xavier",
        "name": "Xavier Doe"
      },
      "likeCount": 128,
      "commentCount": 12,
      "deletedAt": null,
      "views": 340,
      createdAt: new Date(),
      updatedAt: new Date().toISOString(),
    },
    {
      "id": 3,
      "title": "Hidden Gems in Kyoto",
      "content": "<p>Everyone knows about Fushimi Inari, but have you visited the <strong>Arashiyama Bamboo Grove</strong> early in the morning?</p><p>The light filtering through the stalks is magical. Afterward, take a walk down the river path.</p><blockquote>Pro tip: Avoid the weekends if you want photos without crowds.</blockquote><p>We also recommend trying the matcha soft serve near the entrance.</p>",
      "image": "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000",
      "desc": "Exploring the quieter, less touristy spots in Japan's ancient capital.",
      "category": Category.LIFESTYLE,
      "slug": "hidden-gems-kyoto-c9z3x",
      "tags": [
        { "id": 5, "name": "Japan" },
        { "id": 6, "name": "Photography" }
      ],
      "comments": [
        {
          "id": 103,
          "text": "The photos are stunning! Which camera did you use for this shot?",
          "post": null,
          "author": {
            "id": crypto.randomUUID().toString(),
            "username": "dev_sarah",
            "name": "Sarah Connor"
          },
          "likes": null,
          "likeCount": 8,
          "createdAt": "2023-10-05T09:15:00Z",
          "updatedAt": "2023-10-05T09:15:00Z"
        }
      ],
      "likes": null,
      "author": {
        "id": crypto.randomUUID().toString(),
        "username": "xavier",
        "name": "Xavier Doe"
      },
      "likeCount": 89,
      "commentCount": 1,
      "deletedAt": null,
      "views": 560,
      createdAt: new Date(),
      updatedAt: new Date().toISOString(),
    },
    {
      "id": 4,
      "title": "GraphQL vs REST: The Ultimate Guide",
      "content": "<p>For years, REST was the standard. But <strong>GraphQL</strong> has changed the game by allowing clients to request exactly the data they need.</p><p><br></p><p><strong>Key differences:</strong></p><ul><li>Over-fetching vs. Under-fetching</li><li>Single Endpoint vs. Multiple Endpoints</li><li>Schema-driven development</li></ul><p>While REST is simpler for small apps, GraphQL scales beautifully for complex frontends.</p>",
      "image": "https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=1000",
      "desc": "Comparing two major API architectures to help you decide which to use for your next project.",
      "category": Category.TECHNOLOGY,
      "slug": "graphql-vs-rest-ultimate-guide-z7m3q",
      "tags": [
        { "id": 7, "name": "API" },
        { "id": 1, "name": "Backend" }
      ],
      "comments": null,
      "likes": null,
      "author": {
        "id": crypto.randomUUID().toString(),
        "username": "xavier",
        "name": "Xavier Doe"
      },
      "likeCount": 205,
      "commentCount": 24,
      "deletedAt": null,
      "views": 890,
      createdAt: new Date(),
      updatedAt: new Date().toISOString(),
    },
    {
      "id": 5,
      "title": "Minimalist Workspace Setup",
      "content": "<p>A cluttered desk leads to a cluttered mind. Here is how I achieved a minimalist setup.</p><ol><li>Cable management is everything. Use ties and trays.</li><li>Keep only what you use daily on the desk.</li><li>Invest in good lighting.</li></ol><p>The result? A workspace that actually makes you <em>want</em> to work.</p>",
      "image": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000",
      "desc": "Creating a clean, distraction-free environment to boost your coding efficiency.",
      "category": Category.DIY,
      "slug": "minimalist-workspace-setup-p2k9l",
      "tags": [
        { "id": 8, "name": "Setup" },
        { "id": 4, "name": "Minimalism" }
      ],
      "comments": null,
      "likes": null,
      "author": {
        "id": crypto.randomUUID().toString(),
        "username": "xavier",
        "name": "Xavier Doe"
      },
      "likeCount": 15,
      "commentCount": 2,
      "deletedAt": null,
      "views": 45,
      createdAt: new Date(),
      updatedAt: new Date().toISOString(),
    },
    {
      "id": 6,
      "title": "Mastering CSS Grid",
      "content": "<p>CSS Grid is the most powerful layout system available in CSS. It is a 2-dimensional system.</p><p>Unlike Flexbox, which is largely 1-dimensional, Grid can handle columns and rows simultaneously.</p><pre><code>.container {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 20px;\n}</code></pre><p>This snippet creates a responsive 3-column layout with ease.</p>",
      "image": "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?auto=format&fit=crop&q=80&w=1000",
      "desc": "A comprehensive tutorial on moving beyond Flexbox to master 2D web layouts.",
      "category": Category.TECHNOLOGY,
      "slug": "mastering-css-grid-tutorial-m4n7v",
      "tags": [
        { "id": 9, "name": "CSS" },
        { "id": 10, "name": "Frontend" }
      ],
      "comments": null,
      "likes": null,
      "author": {
        "id": crypto.randomUUID().toString(),
        "username": "xavier",
        "name": "Xavier Doe"
      },
      "likeCount": 67,
      "commentCount": 3,
      "deletedAt": null,
      "views": 215,
      createdAt: new Date(),
      updatedAt: new Date().toISOString(),
    }
  ];
  articles2: Article[] = [
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
