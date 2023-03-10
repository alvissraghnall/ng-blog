import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { Category } from 'src/app/models/enum/category.enum';
import { PostService } from 'src/app/services/post.service';
import { Post } from "../../models/Post.model";


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [`.img-cont::after { content: "" }`]
})
export class HomeComponent implements OnInit, OnChanges {
  category?: string | null = null;
  
  posts: Post[] = [
  ];

  constructor(
    private readonly apollo: Apollo,
    private readonly postService: PostService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { 
    this.router.onSameUrlNavigation = 'reload';
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  ngOnInit(): void {
    this.category = this.route.snapshot.queryParamMap.get("category")?.toUpperCase();
    let indexOfCat = Object.values(Category).indexOf(this.category as unknown as Category)
    const catEnum = Object.keys(Category)[indexOfCat];
    console.log(catEnum);
    
    this.postService.getPosts(Category[catEnum as keyof typeof Category])
      .subscribe(
        (results: any) => {
          console.log(results);
          this.posts = (results.data?.posts as Post[]).slice(0, 7);
        }
      )
  }

  ngOnChanges () {
    console.log("changes");
    
  }

}
