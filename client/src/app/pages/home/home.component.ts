import { Component, OnInit } from '@angular/core';
import { Post } from "../../models/Post.model";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: []
})
export class HomeComponent implements OnInit {

  posts: Post[] = [
    {
      id: 1,
      title: 'Post 1',
      description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestias voluptates architecto, tenetur dolores quia debitis molestiae facere nesciunt, officiis recusandae laboriosam, repellendus officia! Dicta, fuga. Facere maiores commodi reprehenderit? Odit? Quisquam, quod. ",
      img: "https://picsum.photos/200/300"
    },
    {
      id: 2,
      title: 'Post 2',
      description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestias voluptates architecto, tenetur dolores quia debitis molestiae facere nesciunt, officiis recusandae laboriosam, repellendus officia! Dicta, fuga. Facere maiores commodi reprehenderit? Odit? Quisquam, quod. ",
      img: "https://picsum.photos/640/190"
    },
    {
      id: 3,
      title: 'Post 3',
      description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestias voluptates architecto, tenetur dolores quia debitis molestiae facere nesciunt, officiis recusandae laboriosam, repellendus officia! Dicta, fuga. Facere maiores commodi reprehenderit? Odit? Quisquam, quod. ",
      img: "https://picsum.photos/400/220"
    },
    {
      id: 4,
      title: 'Post 4',
      description: "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Molestias voluptates architecto, tenetur dolores quia debitis molestiae facere nesciunt, officiis recusandae laboriosam, repellendus officia! Dicta, fuga. Facere maiores commodi reprehenderit? Odit? Quisquam, quod. ",
      img: "https://picsum.photos/520/360"
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
