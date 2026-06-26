import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { DestroyRef } from '@angular/core';
import { tap, catchError, of } from 'rxjs';

import { ZardButtonComponent } from '@ui/button/button.component';
import { ZardIconComponent } from '@ui/icon/icon.component';
import { ZardFormModule } from '@ui/form/form.module';
import { ZardInputDirective } from '@ui/input/input.directive';

import {
  FileText as draftIcon,
  Send as publishIcon,
  Bold as formatBoldIcon,
  Italic as formatItalicIcon,
  Underline as formatUnderlineIcon,
  ListOrdered as formatListOrderedIcon,
  List as formatListUnorderedIcon,
  Link as linkIcon,
  Image as ImageIcon,
  X as closeIcon,
  CloudUpload as cloudUploadIcon,
  Eye as visibilityIcon,
  Calendar as calendarIcon,
  Bell as notificationsIcon,
  Home as homeIcon,
  LayoutDashboard as dashboardIcon,
} from 'lucide-angular';
import { TagsService } from '../../services/tags.service';
import { PostsService } from '../../services/posts.service';
import { RichTextEditorComponent } from '../../components/rich-text-editor.component';
import { ImageUploaderComponent } from '../../components/image-uploader.component';
import { TagInputComponent } from '../../components/tag-input/tag-input.component';
import { PostStatusPanelComponent } from '../../components/post-status-panel/post-status-panel.component';
import { ToastService } from '@core/toast/services/toast.service';
import { Category, CreatePostInput, UpdatePostInput, Post } from '@/gql-types';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RichTextEditorComponent,
    ImageUploaderComponent,
    TagInputComponent,
    PostStatusPanelComponent,
    ZardButtonComponent,
    ZardIconComponent,
    ZardFormModule,
    ZardInputDirective,
  ],
  templateUrl: './editor.component.html',
})
export default class EditorComponent implements OnInit {
  allTags: string[] = [];
  postForm!: FormGroup;
  isEditMode = false;
  postId: number | null = null;
  isSubmitting = false;
  isLoading = false;
  categories = Object.values(Category);

  draftIcon = draftIcon;
  publishIcon = publishIcon;
  formatBoldIcon = formatBoldIcon;
  formatItalicIcon = formatItalicIcon;
  formatUnderlineIcon = formatUnderlineIcon;
  formatListOrderedIcon = formatListOrderedIcon;
  formatListUnorderedIcon = formatListUnorderedIcon;
  linkIcon = linkIcon;
  ImageIcon = ImageIcon;
  closeIcon = closeIcon;
  cloudUploadIcon = cloudUploadIcon;
  visibilityIcon = visibilityIcon;
  calendarIcon = calendarIcon;
  notificationsIcon = notificationsIcon;
  homeIcon = homeIcon;
  dashboardIcon = dashboardIcon;
  yourLogoIcon = homeIcon;

  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private tagService: TagsService,
    private postsService: PostsService,
    private route: ActivatedRoute,
    private router: Router,
    private toastService: ToastService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadTags();
    this.checkEditMode();
  }

  private initForm(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: [''],
      desc: ['', Validators.required],
      category: [Category.TECHNOLOGY, Validators.required],
      featuredImage: [null],
      tags: [[]],
      status: this.fb.group({
        visibility: ['Public', Validators.required],
        publishDate: ['immediate', Validators.required],
      }),
    });
  }

  private loadTags(): void {
    this.tagService.getAll().subscribe(tags => {
      this.allTags = tags.map(t => t.name);
    });
  }

  private checkEditMode(): void {
    const slug = this.route.snapshot.paramMap.get('slug');
    if (slug) {
      this.isEditMode = true;
      this.isLoading = true;
      this.postsService.get(slug)
        .pipe(
          tap((post: Post) => this.populateForm(post)),
          catchError(() => {
            this.toastService.error('Failed to load post');
            this.router.navigate(['/editor']);
            return of(null);
          }),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => {
          this.isLoading = false;
        });
    }
  }

  private populateForm(post: Post): void {
    this.postId = post.id;
    this.postForm.patchValue({
      title: post.title,
      content: post.content,
      desc: post.desc,
      category: post.category,
      featuredImage: post.image,
      tags: post.tags?.map(t => t.name) || [],
    });
  }

  get statusForm() {
    return this.postForm.get('status') as FormGroup;
  }

  private buildPostInput(): CreatePostInput {
    const formValue = this.postForm.value;
    return {
      title: formValue.title,
      content: formValue.content || '',
      desc: formValue.desc,
      image: formValue.featuredImage || '',
      category: formValue.category,
      tags: formValue.tags,
    };
  }

  private buildUpdateInput(): UpdatePostInput {
    const formValue = this.postForm.value;
    return {
      id: this.postId!,
      title: formValue.title,
      content: formValue.content || '',
      desc: formValue.desc,
      image: formValue.featuredImage || '',
      category: formValue.category,
      tags: formValue.tags,
    };
  }

  onSaveDraft(): void {
    this.postForm.markAllAsTouched();
  }

  onPublish(): void {
    this.postForm.markAllAsTouched();
    if (this.postForm.invalid) {
      this.toastService.error('Please fill in all required fields');
      return;
    }

    this.isSubmitting = true;

    if (this.isEditMode && this.postId) {
      this.postsService.update(this.postId, this.buildUpdateInput())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (post) => {
            this.toastService.success('Post updated successfully');
            this.router.navigate(['/article', post.slug]);
          },
          error: () => {
            this.toastService.error('Failed to update post');
            this.isSubmitting = false;
          },
        });
    } else {
      this.postsService.create(this.buildPostInput())
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe({
          next: (post) => {
            this.toastService.success('Post published successfully');
            this.router.navigate(['/article', post.slug]);
          },
          error: () => {
            this.toastService.error('Failed to publish post');
            this.isSubmitting = false;
          },
        });
    }
  }
}
