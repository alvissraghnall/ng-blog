import { Component, OnInit } from '@angular/core';
import { Post } from 'src/app/models/Post.model';

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

  posts: Post[] = [{
      id: 1,
      title: 'Post 1',
      desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestias voluptates architecto, tenetur dolores quia debitis molestiae facere nesciunt, officiis recusandae laboriosam, repellendus officia! Dicta, fuga. Facere maiores commodi reprehenderit? Odit? Quisquam, quod. ",
      image: "../../../assets/phone-bg-02.jpg"
    },
    {
      id: 2,
      title: 'Post 2',
      desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestias voluptates architecto, tenetur dolores quia debitis molestiae facere nesciunt, officiis recusandae laboriosam, repellendus officia! Dicta, fuga. Facere maiores commodi reprehenderit? Odit? Quisquam, quod. ",
      image: "../../../assets/phone-bg.jpg"
    },
    {
      id: 3,
      title: 'Post 3',
      desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestias voluptates architecto, tenetur dolores quia debitis molestiae facere nesciunt, officiis recusandae laboriosam, repellendus officia! Dicta, fuga. Facere maiores commodi reprehenderit? Odit? Quisquam, quod. ",
      image: "../../../assets/Pivo-Pod-review-9.jpeg"
    },
    {
      id: 4,
      title: 'Post 4',
      desc: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestias voluptates architecto, tenetur dolores quia debitis molestiae facere nesciunt, officiis recusandae laboriosam, repellendus officia! Dicta, fuga. Facere maiores commodi reprehenderit? Odit? Quisquam, quod. ",
      image: "../../../assets/razor-kishi.jpeg"
    },]

  constructor() { }

  ngOnInit(): void {
  }

}
