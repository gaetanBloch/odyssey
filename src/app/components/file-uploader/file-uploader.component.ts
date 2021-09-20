import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild
} from '@angular/core';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss']
})
export class FileUploaderComponent {
  // Make it optional because of TS strict initilization
  @ViewChild('fileUpload', { static: false }) fileUpload?: ElementRef;
  @Input() label = ''
  @Output() fileUploaded = new EventEmitter<File>();
  file?: File;

  onClick(): void {
    const fileElement: HTMLInputElement = this.fileUpload?.nativeElement;
    fileElement.onchange = () => {
      if (fileElement.files === null) return;
      // We're taking the one and only file
      this.file = fileElement.files[0];
      this.emitFile();
    };
    // Clear the file input cache
    fileElement.click();
  }

  private emitFile = (): void => {
    if (!this.fileUpload) return;
    this.fileUpload.nativeElement.value = '';
    this.fileUploaded.emit(this.file);
  };
}
