import { Component, OnInit } from '@angular/core';
import html2canvas from 'html2canvas';
import * as p5 from 'p5';

@Component({
  selector: 'ascii-cam-main-view-port',
  templateUrl: './main-view-port.component.html',
  styleUrls: ['./main-view-port.component.css']
})
export class MainViewPortComponent implements OnInit {
  canvas: any;
  private video: any;
  private renderScreen = document.getElementById('sketch-holder');
  private asciiPixels = "(@#W$9876543210?!abc;:+=-,._          ";
  private pause = false;
  //  density = "████████████████████████████            ";
  //  density = '       .:-i|=+%O#@'
  //  density = '        .:░▒▓█';

  constructor() { }

  ngOnInit(): void {
    this.renderScreen = document.getElementById('sketch-holder');

    this.renderCanvas();
  }

  private renderCanvas() {
    const sketch = (currentSketch: any) => {
      currentSketch.setup = () => {
        currentSketch.noCanvas();
        this.video = currentSketch.createCapture(currentSketch.VIDEO);
        this.video.size(120, 45);
      };

      currentSketch.draw = () => {
        if (!this.pause) {
          this.video.loadPixels();
          let asciiImage = "";
          for (let j = 0; j < this.video.height; j++) {
            for (let i = 0; i < this.video.width; i++) {
              const pixelIndex = (i + j * this.video.width) * 4;
              const r = this.video.pixels[pixelIndex + 0];
              const g = this.video.pixels[pixelIndex + 1];
              const b = this.video.pixels[pixelIndex + 2];
              const avg = (r + g + b) / 4;
              const len = this.asciiPixels.length;
              const charIndex = currentSketch.floor(currentSketch.map(avg, 0, 255, 0, len));
              const c = this.asciiPixels.charAt(charIndex);
              if (c == " ") asciiImage += `<span style="color: rgb(${r}, ${g}, ${b});">&nbsp</span>`;
              else asciiImage += `<span style="color: rgb(${r}, ${g}, ${b});">${c}</span>`;
            }
            asciiImage += '<br/>';
          }
          if (this.renderScreen) {
            this.renderScreen.innerHTML = asciiImage;
          }
        };
      }
    };
    this.canvas = new p5(sketch);
  }

  takePicture() {
    this.pause = true;
    let self = this;
    const current = this.renderScreen;
    if (current) {
      html2canvas(current).then(function (canvas) {
        canvas.toBlob((blob: any): void => {
          let link = document.createElement("a");
          link.download = "image.png";
          link.href = URL.createObjectURL(blob);
          link.click();
          self.pause = false;
        }, 'image/png');
      });
    }
  }
}
