import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FileSystemFileEntry, NgxFileDropEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css']
})
export class PhotoUploadComponent {
  public files: NgxFileDropEntry[] = [];
  @Input() previewUrls!: string[];

  @Output() fileAdded = new EventEmitter<string>();
  @Output() fileRemoved = new EventEmitter<void>();


  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;

    for (const droppedFile of files) {
      if (droppedFile.fileEntry.isFile) {
        const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;
        fileEntry.file((file: File) => {
          const reader = new FileReader();
          reader.onload = (e: any) => {
            // this.previewUrls.push(e.target.result);
            this.fileAdded.emit(e.target.result);
          };
          reader.readAsDataURL(file);
        });
      }
    }

  }
  

  removePhoto() {
    this.previewUrls = [];
    this.fileRemoved.emit();
  }
}
