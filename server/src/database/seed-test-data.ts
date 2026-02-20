import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { Post } from '../posts/entities/post.entity';
import { Tag } from '../posts/entities/tag.entity';
import { Category } from '../posts/enum/category.enum';

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'eviltwin',
  password: process.env.DB_PASSWORD || 'ALVISSALVISS',
  database: process.env.DB_DATABASE || 'sharewithalviss',
  synchronize: false,
  entities: [__dirname + '/../**/*.entity.ts'],
});

async function seedTestData() {
  await AppDataSource.initialize();
  console.log('Database connected');

  const userRepository = AppDataSource.getRepository(User);
  const postRepository = AppDataSource.getRepository(Post);
  const tagRepository = AppDataSource.getRepository(Tag);

  const hashedPassword = await bcrypt.hash('password123', 10);

  let testUser = await userRepository.findOne({ where: { username: 'testuser' } });
  
  if (!testUser) {
    testUser = userRepository.create({
      username: 'testuser',
      email: 'testuser@example.com',
      password: hashedPassword,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop',
      bio: 'Test user for development',
      emailVerified: true,
    });
    await userRepository.save(testUser);
    console.log('Created test user: testuser (password: password123)');
  } else {
    console.log('Test user already exists');
  }

  const tagsData = [
    { name: 'Technology' },
    { name: 'Programming' },
    { name: 'Lifestyle' },
    { name: 'Travel' },
    { name: 'DIY' },
    { name: 'CSS' },
    { name: 'TypeScript' },
    { name: 'NodeJS' },
  ];

  const tags: Tag[] = [];
  for (const tagData of tagsData) {
    let tag = await tagRepository.findOne({ where: { name: tagData.name } });
    if (!tag) {
      tag = tagRepository.create(tagData);
      await tagRepository.save(tag);
    }
    tags.push(tag);
  }
  console.log(`Ensured ${tags.length} tags exist`);

  const postsData = [
    {
      title: 'Understanding TypeScript Generics',
      content: `<p>TypeScript generics are a powerful feature that allows you to write flexible, reusable code while maintaining type safety.</p>
<h2>Why Use Generics?</h2>
<p>Generics allow you to create components that work with any type while still enforcing type constraints. This is particularly useful for:</p>
<ul>
<li><strong>Reusable functions</strong> - Write once, use with multiple types</li>
<li><strong>Type safety</strong> - Catch errors at compile time</li>
<li><strong>Better IntelliSense</strong> - Get accurate autocomplete suggestions</li>
</ul>
<h2>Basic Example</h2>
<pre><code>function identity&lt;T&gt;(arg: T): T {
  return arg;
}

const result = identity&lt;string&gt;("hello");</code></pre>
<p>This simple function demonstrates how generics preserve the type information throughout the function.</p>`,
      desc: 'A deep dive into TypeScript generics and how to use them effectively in your projects.',
      image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1000',
      category: Category.TECHNOLOGY,
      tags: [tags[0], tags[1], tags[6]],
    },
    {
      title: 'Morning Routines for Productivity',
      content: `<p>Starting your day with intention can dramatically improve your productivity and overall well-being.</p>
<h2>The 5-Step Morning Routine</h2>
<ol>
<li><strong>Wake up early</strong> - Give yourself time before the day begins</li>
<li><strong>Hydrate first</strong> - Drink water before coffee</li>
<li><strong>Move your body</strong> - Even 10 minutes of stretching helps</li>
<li><strong>Plan your day</strong> - Write down your top 3 priorities</li>
<li><strong>Deep work first</strong> - Tackle important tasks before checking email</li>
</ol>
<blockquote>How you start your day is how you live your day. How you live your day is how you live your life.</blockquote>
<p>Consistency is key. Try this routine for 21 days to form the habit.</p>`,
      desc: 'Simple habits to implement in your morning to boost focus and energy throughout the day.',
      image: 'https://images.unsplash.com/photo-1484627147104-f5197bcd6651?auto=format&fit=crop&q=80&w=1000',
      category: Category.LIFESTYLE,
      tags: [tags[2]],
    },
    {
      title: 'Hidden Gems in Kyoto',
      content: `<p>Beyond the famous Fushimi Inari and Kinkaku-ji, Kyoto offers countless hidden treasures waiting to be discovered.</p>
<h2>Off the Beaten Path</h2>
<p>While tourists flock to the main attractions, locals know about these quieter spots:</p>
<ul>
<li><strong>Arashiyama Bamboo Grove</strong> - Visit at dawn for a magical experience</li>
<li><strong>Philosopher\'s Path</strong> - A peaceful canal-side walk</li>
<li><strong>Gion at night</strong> - Spot geishas heading to appointments</li>
</ul>
<h2>Local Tips</h2>
<p>The best time to visit is during cherry blossom season (late March to early April) or autumn foliage (November). Weekday mornings are significantly less crowded.</p>
<p>Don\'t miss the matcha soft serve near Kiyomizu-dera!</p>`,
      desc: 'Exploring the quieter, less touristy spots in Japan\'s ancient capital.',
      image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=1000',
      category: Category.TRAVEL,
      tags: [tags[3]],
    },
    {
      title: 'Building a REST API with NestJS',
      content: `<p>NestJS provides an excellent structure for building scalable REST APIs with TypeScript.</p>
<h2>Getting Started</h2>
<p>First, install the CLI and create a new project:</p>
<pre><code>npm i -g @nestjs/cli
nest new my-api</code></pre>
<h2>Creating a Resource</h2>
<p>Use the CLI to generate a complete CRUD resource:</p>
<pre><code>nest g resource posts</code></pre>
<p>This creates controller, service, module, DTOs, and entity files with basic CRUD operations.</p>
<h2>Key Concepts</h2>
<ul>
<li><strong>Modules</strong> - Organize related components</li>
<li><strong>Controllers</strong> - Handle HTTP requests</li>
<li><strong>Services</strong> - Business logic layer</li>
<li><strong>DTOs</strong> - Define data shapes for validation</li>
</ul>
<p>The decorator-based approach makes the code clean and maintainable.</p>`,
      desc: 'A comprehensive guide to building production-ready REST APIs with NestJS framework.',
      image: 'https://images.unsplash.com/photo-1558494949-ef526b0042a0?auto=format&fit=crop&q=80&w=1000',
      category: Category.TECHNOLOGY,
      tags: [tags[0], tags[1], tags[7]],
    },
    {
      title: 'Minimalist Workspace Setup',
      content: `<p>A clutter-free workspace leads to a clutter-free mind. Here's how to create the perfect minimalist desk setup.</p>
<h2>Essential Elements</h2>
<ol>
<li><strong>Quality desk</strong> - Invest in a solid, clean surface</li>
<li><strong>Ergonomic chair</strong> - Your back will thank you</li>
<li><strong>Monitor at eye level</strong> - Reduce neck strain</li>
<li><strong>Cable management</strong> - Use trays and ties</li>
<li><strong>Good lighting</strong> - Natural light + task lamp</li>
</ol>
<h2>What to Remove</h2>
<ul>
<li>Unnecessary decor</li>
<li>Old cables and accessories</li>
<li>Paper clutter (go digital!)</li>
<li>Multiple pen holders</li>
</ul>
<p>The goal is to have only what you use daily within reach. Everything else should be stored away.</p>`,
      desc: 'Creating a clean, distraction-free environment to boost your coding efficiency.',
      image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000',
      category: Category.DIY,
      tags: [tags[2], tags[4]],
    },
  ];

  const existingPosts = await postRepository.count();
  if (existingPosts === 0) {
    for (const postData of postsData) {
      const post = postRepository.create({
        ...postData,
        author: testUser,
      });
      await postRepository.save(post);
    }
    console.log(`Created ${postsData.length} test posts`);
  } else {
    console.log(`Skipping posts creation - ${existingPosts} posts already exist`);
  }

  console.log('\n=== Seed Complete ===');
  console.log('Test credentials:');
  console.log('  Username: testuser');
  console.log('  Email: testuser@example.com');
  console.log('  Password: password123');
  
  await AppDataSource.destroy();
}

seedTestData().catch((error) => {
  console.error('Seed error:', error);
  process.exit(1);
});
