import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {

  @ViewChild('screenshotCanvas') screenshotCanvas: ElementRef;
  public screenshotCanvasContext: CanvasRenderingContext2D;

  title = 'angular-screenshot';

  ngAfterViewInit() {
    this.screenshotCanvasContext = (<HTMLCanvasElement>this.screenshotCanvas.nativeElement).getContext('2d');
  }

  public takeScreenshot() {
    this.startStream().then(
      x => console.log(x)
    );
  }

  private async startStream() {

    const displayMediaOptions = {
      // video: {
      //   cursor: 'always',
      //   displaySurface: ['monitor']
      // },
      // audio: false,
      logicalSurface: true
    };

    const userMediaOptions = {
      video: {
        mediaSource: 'screen'
      }
    };

    // check if browser supports getDisplayMedia() in window.navigator
    if ('getDisplayMedia' in window.navigator.mediaDevices) {
      console.log('window.navigator.mediaDevices.getDisplayMedia() is supported.');

      try {

        const mediaStream: MediaStream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

        const videoTrack: MediaStreamTrack = mediaStream.getVideoTracks()[0];

        const imageCapture = new ImageCapture(videoTrack);

        imageCapture.grabFrame().then((img: ImageBitmap) => {
          mediaStream.getTracks().forEach(track => track.stop());

          (<HTMLCanvasElement>this.screenshotCanvas.nativeElement).width = img.width / 4;
          (<HTMLCanvasElement>this.screenshotCanvas.nativeElement).height = img.height / 4;

          this.screenshotCanvasContext.drawImage(img, 0, 0, img.width / 4, img.height / 4);

          console.log((<HTMLCanvasElement>this.screenshotCanvas.nativeElement).toBlob(x => {
            console.log(x);
          }));
        });

      } catch (error) {
        console.log('User did not allow tab or window to be streamed.', error);
      }

    } else {
      // use getUserMedia instead of get DisplayMedia
      console.warn('window.navigator.mediaDevices.getDisplayMedia() not supported. Fallback to navigator.mediaDevices.getUserMedia()');

      try {

        const mediaStream: MediaStream = await navigator.mediaDevices.getUserMedia(userMediaOptions);

      } catch (error) {
        console.log('User did not allow tab or window to be streamed.');
      }
    }

  }
}
