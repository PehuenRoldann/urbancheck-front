import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { NgxFileDropEntry, FileSystemFileEntry } from 'ngx-file-drop';

@Component({
  selector: 'app-photo-upload',
  templateUrl: './photo-upload.component.html',
  styleUrls: ['./photo-upload.component.css'],
})
export class PhotoUploadComponent {
  /** Configuración */
  @Input() accept: string = 'image/*';
  @Input() multiple: boolean = true;
  /** En móviles: intentar abrir cámara (si el SO lo soporta) */
  @Input() capture: 'environment' | 'user' | '' = '';

  /** Salida: archivos seleccionados/cargados */
  @Output() filesSelected = new EventEmitter<File[]>();

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  /** Click para abrir selector */
  openFileDialog(event?: MouseEvent) {
    event?.stopPropagation();
    this.fileInput.nativeElement.click();
  }

  /** Selección manual */
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = input.files ? Array.from(input.files) : [];
    if (files.length) {
      const filtered = this.filterByAccept(files);
      this.filesSelected.emit(this.multiple ? filtered : filtered.slice(0, 1));
    }
    input.value = ''; // permitir re-seleccionar el mismo archivo
  }

  /** Drag & drop (ngx-file-drop) */
  dropped(entries: NgxFileDropEntry[]) {
    const pending: Promise<File>[] = [];

    for (const entry of entries) {
      if (entry.fileEntry.isFile) {
        const fe = entry.fileEntry as FileSystemFileEntry;
        pending.push(new Promise<File>((resolve) => fe.file(resolve)));
      }
    }

    Promise.all(pending).then((files) => {
      const filtered = this.filterByAccept(files);
      if (filtered.length) {
        this.filesSelected.emit(
          this.multiple ? filtered : filtered.slice(0, 1)
        );
      }
    });
  }

  /** Acepta solo tipos permitidos (simple, basado en MIME/extension) */
  private filterByAccept(files: File[]): File[] {
    if (!this.accept || this.accept === '*/*') return files;
    const accepts = this.accept.split(',').map((s) => s.trim().toLowerCase());
    return files.filter((f) => {
      const mime = f.type.toLowerCase();
      const ext = '.' + (f.name.split('.').pop() || '').toLowerCase();
      return accepts.some((a) => {
        if (a.endsWith('/*')) return mime.startsWith(a.replace('/*', '/'));
        if (a.startsWith('.')) return ext === a;
        return mime === a; // image/png, etc.
      });
    });
  }
}
