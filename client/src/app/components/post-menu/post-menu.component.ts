import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Post } from 'src/app/models/Post.model';
import { PostService } from 'src/app/services/post.service';

@Component({
  selector: 'app-post-menu',
  template: `
      <h1 class="text-xl text-[#555]">Other posts you might like</h1>
      <div *ngFor="let post of posts" class="flex flex-col gap-2.5">
        <img src="{{post.image}}" class="w-full object-cover h-52 cursor-pointer rounded-md" />
        <h2 class="text-[#555]"> {{ post.title }} </h2>
        <button class="w-max rounded-lg py-2.5 px-5 border bg-[#eee] border-teal-300 text-teal-500 hover:bg-teal-400 hover:text-[#eee] cursor-pointer outline-none"> Read more </button>
      </div>
  `,
  styles: [
  ]
})
export class PostMenuComponent implements OnInit {

  @Input() post?: Post;
  posts: Post[] = [];
  postId?: number;
  constructor(
    private readonly postService: PostService
  ) { }

  ngOnInit(): void {
    this.postService.getPosts(this.post?.category, this.post?.author.id)
      .subscribe(
        (results: any) => {
          console.log(results);
          this.posts = (results.data?.posts as Post[]).slice(0, 3);
        }
      );

    // this.posts = th
  }

}
