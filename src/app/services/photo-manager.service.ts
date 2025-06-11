import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PhotoManagerService {
  private minioBaseUrl = environment.minioUrl; // Cambiar en prod
  private bucketName = environment.minioBucket;

  constructor(private http: HttpClient) {}

  /**
   * Genera un nombre de archivo usando el nombre original + timestamp UTC.
   */
  private generateFilename(originalName: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const extension = originalName.split('.').pop();
    const baseName = originalName.replace(/\.[^.]+$/, '');
    return `${baseName}_${timestamp}.${extension}`;
  }

  /**
   * Sube la imagen directamente al bucket público en MinIO.
   * @param file Imagen a subir
   * @param userid UUID del usuario
   * @returns Promise con la URL pública final
   */
  async uploadImage(file: File, userid: string): Promise<string> {
    const filename = this.generateFilename(userid);
    const fullUrl = `${this.minioBaseUrl}/${this.bucketName}/${filename}`;
    const headers = new HttpHeaders({ 'Content-Type': file.type });

    await this.http.put(fullUrl, file, { headers }).toPromise(); // Espera la subida
    return fullUrl;
  }

  async fetchFileFromUrl (url: string): Promise<File> {
    const response = await fetch(url);
    const blob = await response.blob();
  
    // Podés extraer un nombre sugerido del path o usar uno fijo
    const fileName = url.split('/').pop() || 'downloaded-image';
  
    return new File([blob], fileName, { type: blob.type });
  };

  /**
   * Devuelve la URL pública para una imagen subida.
   */
  getPublicImageUrl(filename: string): string {
    return `${this.minioBaseUrl}/${this.bucketName}/${filename}`;
  }
}
