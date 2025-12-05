import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ZardButtonComponent } from '@ui/button/button.component';
import { ZardInputDirective } from '@ui/input/input.directive';
import { ZardIconComponent } from '@ui/icon/icon.component';

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
import { RichTextEditorComponent } from '../../components/rich-text-editor.component';
import { ImageUploaderComponent } from '../../components/image-uploader.component';
import { TagInputComponent } from '../../components/tag-input/tag-input.component';
import { PostStatusPanelComponent } from '../../components/post-status-panel/post-status-panel.component';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    // TopNavBarComponent,
    RichTextEditorComponent,
    ImageUploaderComponent,
    TagInputComponent,
    PostStatusPanelComponent,
    ZardButtonComponent,
    ZardInputDirective,
    ZardIconComponent,
  ],
  templateUrl: './editor.component.html',
})
export class EditorComponent implements OnInit {
  allTags: string[] = [];
  postForm!: FormGroup;

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

  constructor(
    private fb: FormBuilder,
    private tagService: TagsService,
  ) {}

  ngOnInit(): void {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: [''],

      featuredImage: [null],

      tags: [[]],

      status: this.fb.group({
        visibility: ['Public', Validators.required],
        publishDate: ['immediate', Validators.required],
      }),
    });

    this.tagService.getAll().subscribe(tags => {
      this.allTags = tags.map(t => t.name);
    });
  }

  get statusForm() {
    return this.postForm.get('status') as FormGroup;
  }

  onSaveDraft(): void {
    this.postForm.markAllAsTouched();
    console.log('Saving draft:', this.postForm.value);
  }

  onPublish(): void {
    this.postForm.markAllAsTouched();
    if (this.postForm.invalid) {
      console.error('Form is invalid. Cannot publish.');
      return;
    }
    console.log('Publishing post:', this.postForm.value);
  }
}
