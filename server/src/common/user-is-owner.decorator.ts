// import { CanActivate, Injectable, ExecutionContext } from "@nestjs/common";
// import { Observable } from "rxjs";
// import { DataSource } from "typeorm";

// @Injectable()
// export class UserIsOwner implements CanActivate {
//   constructor(private dataSource: DataSource) {}

//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const request = context.switchToHttp().getRequest<Request>();
//     const user = request.user; // Current authenticated user
//     const postId = request.params.id; // Assuming the ID is in the URL parameter

//     if (!user || !postId) {
//       return false; // Not authenticated or no resource ID provided
//     }

//     const post = await this.postService.findById(postId); // Assuming findById method in PostService

//     if (!post) {
//       return false; // Resource not found
//     }

//     return post.owner.id === user.id; // Check if current user is the owner
//   }
// }
