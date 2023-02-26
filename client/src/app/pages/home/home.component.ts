import { Component, OnInit } from '@angular/core';
import { Post } from "../../models/Post.model";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [`.img-cont::after { content: "" }`]
})
export class HomeComponent implements OnInit {

  posts: Post[] = [
    {
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
    },
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
