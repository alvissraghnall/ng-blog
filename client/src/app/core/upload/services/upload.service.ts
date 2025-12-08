import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Apollo, gql } from 'apollo-angular';
import { uploadFile } from '@graphql/mutations';
import { ValidationError, NetworkError } from '@core/models/errors.model';

export interface UploadResult {
  url: string;
  filename: string;
  size: number;
  mimeType: string;
}

@Injectable({ providedIn: 'root' })
export class UploadService {
  private readonly MAX_FILE_SIZE = 0.44 * 1024 * 1024;

  private readonly ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

  constructor(private readonly apollo: Apollo) {}

  uploadPostImage(file: File): Observable<UploadResult> {
    return this.uploadFile(file, 'post');
  }

  uploadAvatar(file: File): Observable<UploadResult> {
    return this.uploadFile(file, 'avatar');
  }

  private uploadFile(file: File, type: 'post' | 'avatar'): Observable<UploadResult> {
    const error = this.validateFile(file, type);
    if (error) return throwError(() => error);

    return this.apollo
      .mutate({
        mutation: gql`
          mutation uploadFile($file: Upload!, $type: String) {
            uploadFile(file: $file, type: $type) {
              url
              filename
              size
              mimeType
            }
          }
        `,
        variables: {
          file: file,
          type,
        },
        context: {
          useMultipart: true,
        },
      })
      .pipe(
        map(result => {
          if (!(result.data as any).uploadFile) {
            throw new NetworkError('Upload failed.');
          }
          return (result.data as any).uploadFile as UploadResult;
        }),
        catchError(error => {
          return throwError(() => new NetworkError(error.message));
        }),
      );
  }

  private validateFile(file: File, type: 'post' | 'avatar'): ValidationError | null {
    if (file.size > this.MAX_FILE_SIZE) {
      return new ValidationError(`File size must be less than ${this.MAX_FILE_SIZE / 1024 / 1024}MB.`);
    }

    let allowedTypes: string[] = this.ALLOWED_IMAGE_TYPES;

    if (!allowedTypes.includes(file.type)) {
      return new ValidationError(`Invalid file type. Allowed types: ${allowedTypes.join(', ')}`);
    }

    if (type === 'avatar') {
      return this.validateImageDimensions(file);
    }

    return null;
  }

  compressImage(file: File, maxWidth = 1920, quality = 0.8): Observable<File> {
    return new Observable(observer => {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const img = new Image();
        img.src = e.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            blob => {
              if (blob) {
                const compressedFile = new File([blob], file.name, {
                  type: 'image/jpeg',
                  lastModified: Date.now(),
                });
                observer.next(compressedFile);
                observer.complete();
              } else {
                observer.error(new ValidationError('Image compression failed.'));
              }
            },
            'image/jpeg',
            quality,
          );
        };
      };

      reader.readAsDataURL(file);
    });
  }

  private validateImageDimensions(file: File): ValidationError | null {
    return new Observable<ValidationError | null>(observer => {
      const img = new Image();
      const url = URL.createObjectURL(file);

      img.onload = () => {
        URL.revokeObjectURL(url);

        const ratio = img.width / img.height;
        if (ratio < 0.8 || ratio > 1.2) {
          observer.next(new ValidationError('Avatar image should be square or nearly square.'));
        } else {
          observer.next(null);
        }
        observer.complete();
      };

      img.onerror = () => {
        URL.revokeObjectURL(url);
        observer.next(new ValidationError('Failed to load image.'));
        observer.complete();
      };

      img.src = url;
    }).toPromise() as Promise<ValidationError | null> as any;
  }

  // deleteFile(fileUrl: string): Observable<boolean> {
  //   return this.apollo
  //     .mutate({
  //       mutation: deleteFile,
  //       variables: { url: fileUrl },
  //     })
  //     .pipe(
  //       map(result => {
  //         if (result.error) {
  //           throw new NetworkError('Failed to delete file.');
  //         }
  //         return true;
  //       }),
  //       catchError(error => {
  //         const networkError = new NetworkError(error.message || 'Failed to delete file. Please try again.');
  //         return throwError(() => networkError);
  //       }),
  //     );
  // }
}
