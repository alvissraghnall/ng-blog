import { Component, Input, signal, effect } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ZardIconComponent } from '@ui/icon/icon.component';
import { CircleXIcon, CloudUploadIcon } from 'lucide-angular';

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [ZardIconComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: ImageUploaderComponent,
      multi: true,
    },
  ],
  template: `
    <div class="flex flex-col items-center justify-center w-full">
      <label
        class="flex flex-col items-center justify-center w-full h-48 border-2 border-border border-dashed rounded-xl cursor-pointer bg-card/50 hover:bg-accent"
      >
        <!-- Image Preview -->
        @if (previewUrl()) {
          <div class="relative w-full h-full">
            <img [src]="previewUrl()" alt="Image preview" class="h-full w-full object-cover rounded-xl" />

            <button
              type="button"
              class="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
              (click)="removeImage(); $event.stopPropagation()"
            >
              <z-icon [zType]="closeIcon" class="text-sm" />
            </button>

            @if (uploadProgress() < 100) {
              <div class="absolute bottom-0 left-0 w-full bg-gray-200 h-1 rounded-b-xl overflow-hidden">
                <div
                  class="bg-green-500 h-1 transition-all duration-300"
                  [style.width.%]="uploadProgress()"
                ></div>
              </div>
            }
          </div>
        }

        @if (!previewUrl()) {
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <z-icon [zType]="cloudUploadIcon" class="text-4xl text-muted-foreground" />
            <p class="mb-2 text-sm text-muted-foreground">
              <span class="font-semibold text-primary">Click to upload</span> or drag and drop
            </p>
            <p class="text-xs text-muted-foreground">
              JPG, JPEG, PNG (max {{ maxSizeKB }} KB)
            </p>
            @if (error()) {
              <p class="text-xs text-red-500 mt-1">{{ error() }}</p>
            }
          </div>
        }

        
        <input
          type="file"
          class="hidden"
          [accept]="accept"
          (change)="onFileChange($event)"
        />
      </label>
    </div>
  `,
})
export class ImageUploaderComponent implements ControlValueAccessor {
  @Input() accept = 'image/png, image/jpeg, image/jpg';
  @Input() maxSizeKB = 850;

  file = signal<File | null>(null);
  previewUrl = signal<string | null>(null);
  uploadProgress = signal<number>(100);
  error = signal<string | null>(null);

  cloudUploadIcon = CloudUploadIcon;
  closeIcon = CircleXIcon;

  private onChange = (value: File | null) => {};
  private onTouched = () => {};

  constructor() {
    effect(() => this.onChange(this.file()));
  }

  writeValue(value: File | null): void {
    this.setFile(value);
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private setFile(file: File | null) {
    this.file.set(file);

    if (file) {
      this.previewUrl.set(URL.createObjectURL(file));
      this.uploadProgress.set(0);
      this.simulateUpload();
    } else {
      this.previewUrl.set(null);
      this.uploadProgress.set(100);
      this.error.set(null);
    }
  }

  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0] ?? null;

    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      this.error.set('Invalid file type. Only JPG/PNG allowed.');
      return;
    }

    const maxSizeBytes = this.maxSizeKB * 1024;
    if (file.size > maxSizeBytes) {
      this.error.set(`File is too large. Max ${this.maxSizeKB} KB allowed.`);
      return;
    }

    this.error.set(null);
    this.setFile(file);
    this.onTouched();
  }

  removeImage() {
    this.setFile(null);
    this.onTouched();
  }

  private simulateUpload() {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
      }
      this.uploadProgress.set(progress);
    }, 300);
  }
}
