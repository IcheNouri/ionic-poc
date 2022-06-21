import {Component} from '@angular/core';
import {Chooser} from '@awesome-cordova-plugins/chooser/ngx';
import {File} from '@awesome-cordova-plugins/file/ngx';

@Component({
  selector: 'myp-upload-document',
  templateUrl: './upload-document.component.html',
  styleUrls: ['./upload-document.component.scss'],
})
export class UploadDocumentComponent {


  constructor(private chooser: Chooser, private file: File) {
  }

  selectFile(): void {
    this.chooser.getFile()
    .then(async result => {
      if (result) {
        this.file.resolveLocalFilesystemUrl(result.uri)
        .then(async r => {
          if (r.isFile) {
            const b64 = result.dataURI.substr(result.dataURI.indexOf('base64,') + 'base64,'.length);

            const document: any = {
              nom: result.name,
              mimetype: result.mediaType,
              taille: result.data.length,
              //md5: await this.getMd5FromFile(result.data, result.mediaType, result.name),
              base64: b64
            };

            console.log(b64);
            console.log(result.name);
            console.log(result.mediaType);
            console.log(result.data.length);

            r.name = document.nom;
          }
        })
        .catch(r => {
          console.log(r);
        });
      }
    });
  }
}
