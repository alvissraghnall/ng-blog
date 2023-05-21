import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContentChange } from 'ngx-quill';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
import { switchMap, tap } from 'rxjs';
import { Category } from '@models/enum/category.enum';
import { CreatePostInput } from '@models/inputs/create-post.input';
import { PostService } from 'src/app/services/post.service';
import { Post } from "@models/Post.model";


Quill.register('modules/blotFormatter', BlotFormatter)

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styles: []
})
export class CreateComponent implements OnInit {

  greenStyles = 'bg-green-50 border-green-500 text-green-900 placeholder-green-700 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block dark:bg-green-100 dark:border-green-400';
  redStyles = 'bg-red-50 border-red-500 placeholder-red-700 text-sm rounded-lg focus:ring-red-500 focus:border-red-500 block dark:bg-red-100 dark:border-red-400';

  templateForm: FormGroup;
  quillEditorModules = {};
  selectedFile!: File;
  categoryOptions = Object.keys(Category);
  private _post?: Post;

  get post (): Post | undefined {
    return this._post;
  }

  set post (post: Post | undefined) {
    this._post = post;
  }

  constructor(
    protected readonly postService: PostService,
    private readonly route: ActivatedRoute
  ) { 
    console.log(this.categoryOptions, Object.values(Category));
    this.templateForm = new FormGroup({
      textEditor: new FormControl("", {
        validators: [Validators.required, Validators.minLength(66)]
      }),
      title: new FormControl(this.post?.title ?? "", {
        validators: [Validators.required, Validators.minLength(5), Validators.maxLength(66)]
      }),
      desc: new FormControl("", {
        validators: [Validators.required, Validators.minLength(11), Validators.maxLength(86)]
      }),
      category: new FormControl(Category.LIFESTYLE, {
        validators: [Validators.required]
      })
    });
    this.quillEditorModules = {
      blotFormatter: {}
    };
  }

  ngOnInit(): void {
    const isEdit = this.checkIsUpdate();
    const postId = this.getPostId();

    if(isEdit) this.getPost(postId);
  }

  handleContentChange($event: ContentChange) {
    // console.log($event);
  }

  selectFile(file: File) {
    this.selectedFile = file;
  }

  onSubmit (event: Event) {
    event.preventDefault();
    this.uploadImage();
  }

  uploadPost (imageUrl: string) {
    
    const post: CreatePostInput = {
      desc: this.templateForm.value.desc,
      content: this.templateForm.value.textEditor,
      title: this.templateForm.value.title,
      category: this.templateForm.value.category,
      image: imageUrl
    }

    return this.postService.createPost(post);
      // .subscribe(
      //   (results: any) => {
      //     console.log(results);
      //   }
      // );
  }

  uploadImage () {
    const fd = new FormData();
    fd.append("image", this.selectedFile);
    const res = this.postService.uploadPostImage(fd)
      .pipe(
        tap(res => console.log("one", res)),
        switchMap(r => this.uploadPost(r.url))
      )
      .subscribe(r => {
        console.log("final", r);
      }
    );
    return res;
  }

  checkIsUpdate () {
    return Boolean(this.route.snapshot.queryParamMap.get("edit"));
  }

  getPostId () {
    return Number(this.route.snapshot.queryParamMap.get("id"));
  }

  getPost (id: number) {
    this.postService.getPost(id, 'no-cache')
      .subscribe(
        (results: any) => {
          console.log(results);
          // if (results.errors) 
          this.post = results.data?.post;
        }
      );
  }

}
