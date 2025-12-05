import { Component, forwardRef, Input, ViewChild, AfterViewInit, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { QuillEditorComponent, QuillModule } from 'ngx-quill';

import { ZardButtonComponent } from '@ui/button/button.component';
import { ZardIconComponent } from '@ui/icon/icon.component';
import { ZardTooltipComponent } from '@ui/tooltip/tooltip';

@Component({
  selector: 'app-rich-text-editor',
  standalone: true,
  imports: [CommonModule, QuillModule, ZardButtonComponent, ZardIconComponent, ZardTooltipComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => RichTextEditorComponent),
      multi: true,
    },
  ],
  template: `
    <div class="flex w-full flex-1 items-stretch flex-col rounded-xl border border-border bg-card">
      <div class="flex flex-wrap items-center gap-1 p-2 border-b border-border">
        <z-tooltip content="Bold">
          <z-button zType="ghost" zSize="icon" (click)="format('bold')">
            <z-icon [zType]="formatBoldIcon" class="text-xl text-muted-foreground" />
          </z-button>
        </z-tooltip>
        <z-tooltip content="Italic">
          <z-button zType="ghost" zSize="icon" (click)="format('italic')">
            <z-icon [zType]="formatItalicIcon" class="text-xl text-muted-foreground" />
          </z-button>
        </z-tooltip>
        <z-tooltip content="Underline">
          <z-button zType="ghost" zSize="icon" (click)="format('underline')">
            <z-icon [zType]="formatUnderlineIcon" class="text-xl text-muted-foreground" />
          </z-button>
        </z-tooltip>
        <div class="w-px h-6 bg-border mx-1"></div>
        <z-tooltip content="Ordered List">
          <z-button zType="ghost" zSize="icon" (click)="format('list', 'ordered')">
            <z-icon [zType]="formatListOrderedIcon" class="text-xl text-muted-foreground" />
          </z-button>
        </z-tooltip>
        <z-tooltip content="Bullet List">
          <z-button zType="ghost" zSize="icon" (click)="format('list', 'bullet')">
            <z-icon [zType]="formatListUnorderedIcon" class="text-xl text-muted-foreground" />
          </z-button>
        </z-tooltip>
        <div class="w-px h-6 bg-border mx-1"></div>
        <z-tooltip content="Link">
          <z-button zType="ghost" zSize="icon" (click)="format('link')">
            <z-icon [zType]="linkIcon" class="text-xl text-muted-foreground" />
          </z-button>
        </z-tooltip>
        <z-tooltip content="Image">
          <z-button zType="ghost" zSize="icon" (click)="format('image')">
            <z-icon [zType]="imageIcon" class="text-xl text-muted-foreground" />
          </z-button>
        </z-tooltip>
      </div>

      <!-- Quill Editor -->
      <quill-editor
        #quillEditor
        class="flex-1"
        [ngModel]="value"
        (ngModelChange)="onContentChanged($event)"
        (onEditorCreated)="onEditorCreated($event)"
        [modules]="editorModules"
        [placeholder]="placeholder"
        [style]="{ 'min-height': '384px' }"
        theme="snow"
      >
      </quill-editor>

      <div class="flex justify-between items-center text-xs text-muted-foreground border-t border-border px-4 py-2">
        <span>Word Count: {{ wordCount }}</span>
        <span class="text-green-600 dark:text-green-500" [class.opacity-0]="!isSaving"> Draft saved </span>
      </div>
    </div>
  `,
})
export class RichTextEditorComponent implements ControlValueAccessor, AfterViewInit {
  @Input() placeholder: string = '';
  @ViewChild('quillEditor') quillEditor!: QuillEditorComponent;

  value: string = '';
  wordCount: number = 0;
  isSaving: boolean = false;

  editorModules = {
    toolbar: [
      ['bold', 'italic', 'underline', 'strike'],
      ['blockquote', 'code-block'],
      [{ header: 1 }, { header: 2 }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ script: 'sub' }, { script: 'super' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ direction: 'rtl' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ font: [] }],
      [{ align: [] }],
      ['clean'],
      ['link', 'image', 'video'],
    ],
  };

  private onChange: (value: string) => void = () => {};
  private onTouched: () => void = () => {};

  ngAfterViewInit(): void {
    this.updateWordCount();
  }

  writeValue(value: string): void {
    this.value = value || '';
    this.updateWordCount();
  }

  registerOnChange(fn: (value: string) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState?(isDisabled: boolean): void {
    if (this.quillEditor) {
      this.quillEditor.quillEditor.disable();
    }
  }

  onContentChanged(event: any): void {
    this.value = event.html || '';
    this.onChange(this.value);
    this.updateWordCount();
    this.onTouched();

    this.simulateAutoSave();
  }

  onEditorCreated(event: any): void {
    console.log('Quill editor created', event);
  }

  format(command: string, value?: any): void {
    if (this.quillEditor && this.quillEditor.quillEditor) {
      const range = this.quillEditor.quillEditor.getSelection();
      if (range) {
        this.quillEditor.quillEditor.format(command, value, 'user');
      }
    }
  }

  private updateWordCount(): void {
    if (this.value) {
      // Create a temporary div to parse HTML content
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = this.value;
      const textContent = tempDiv.textContent || tempDiv.innerText || '';

      this.wordCount = textContent
        .trim()
        .split(/\s+/)
        .filter(word => word.length > 0).length;
    } else {
      this.wordCount = 0;
    }
  }

  private simulateAutoSave(): void {
    this.isSaving = true;
    setTimeout(() => {
      this.isSaving = false;
    }, 1000);
  }
}
