import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-file-upload',
  template: `
    <input type="file" id="file" class="hidden" (change)="onFileSelected($event)" #fileUpload [accept]="requiredFileType" />
    <!-- <label for="file" class="underline cursor-pointer">Upload Image</label>  -->

    <div class="flex items-center gap-2">
      {{ fileName || 'No file uploaded yet!' }}
      <button (click)="fileUpload.click()" class="rounded-full p-2 m-1 bg-cyan-400" type="button">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
          <path stroke-linecap="round" stroke-linejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
        </svg>
      </button>
    </div>
    
  `,
  styles: [
  ]
})
export class FileUploadComponent implements OnInit {

  fileName? = '';
  @Input() requiredFileType!: string;
  @Output() selectedFileEvent = new EventEmitter<File>();

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    event.preventDefault();
    event.stopPropagation()
    const file: File = (event.target as HTMLInputElement).files![0];

    this.fileName = file?.name;
    this.selectedFileEvent.emit(file);

    // if (file) {

    //     this.fileName = file.name;

    //     const formData = new FormData();

    //     formData.append("thumbnail", file);

    //     // const upload$ = this.http.post("/api/thumbnail-upload", formData);

    //     // upload$.subscribe();
    // }
  }

  ngOnInit(): void {
  }

}
