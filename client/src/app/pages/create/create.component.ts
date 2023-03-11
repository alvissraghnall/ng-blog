import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ContentChange } from 'ngx-quill';
import Quill from 'quill';
import BlotFormatter from 'quill-blot-formatter';
import { Category } from 'src/app/models/enum/category.enum';
import { CreatePostInput } from 'src/app/models/inputs/create-post.input';
import { PostService } from 'src/app/services/post.service';


Quill.register('modules/blotFormatter', BlotFormatter)

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styles: []
})
export class CreateComponent implements OnInit {

  templateForm: FormGroup;
  quillEditorModules = {};
  selectedFile!: File;
  categoryOptions = Object.keys(Category);

  constructor(
    protected readonly postService: PostService,
  ) { 
    console.log(this.categoryOptions, Object.values(Category));
    this.templateForm = new FormGroup({
      textEditor: new FormControl("", {
        validators: [Validators.required, Validators.minLength(66)]
      }),
      title: new FormControl("", {
        validators: [Validators.required, Validators.minLength(5), Validators.maxLength(66)]
      }),
      desc: new FormControl("", {
        validators: [Validators.required, Validators.minLength(5), Validators.maxLength(74)]
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
  }

  handleContentChange($event: ContentChange) {
    // console.log($event);
  }

  selectFile(file: File) {
    this.selectedFile = file;
  }

  uploadPost (event: Event) {
    event.preventDefault();
    const fd = new FormData();
    fd.append("image", this.selectedFile);
    const res = this.postService.uploadPostImage(fd)
      .subscribe(r => console.log(r));

    const post: CreatePostInput = {
      desc: this.templateForm.value.desc,
      content: this.templateForm.value.textEditor,
      title: this.templateForm.value.title,
      category: this.templateForm.value.category,
      image: 'fd'
    }

    console.log(post);
    this.postService.createPost(post)
      .subscribe(
        (results: any) => {
          console.log(results);
        }
      );
    
  }

}
