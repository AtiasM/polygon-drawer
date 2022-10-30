import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-video-editor',
  templateUrl: './video-editor.component.html',
  styleUrls: ['./video-editor.component.scss']
})
export class VideoEditorComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  videoName: string | null = null
  currentFrame: any
  gallery: any[] = []
  fps: number = 1
  frameNumber: number = 1
  clicks: any[] = []
  currentImgObject: any
  geometricFile: any 

  constructor(
    private videoService: VideoService,
    private router: ActivatedRoute) { }

  ngOnInit(): void {
    this.videoName = this.router.snapshot.paramMap.get('videoName')
    this.init()
  }

  async onGoButtonClicked(){
    if(this.videoName){
      await this.loadPolygonDrawer(this.videoName)
      console.table(this.gallery)
    }
  }

  async loadPolygonDrawer(videoName: string){
    const base64ImagesArray = await this.videoService.getFramesArray(videoName, this.frameNumber, this.fps)
    this.gallery = this.createNgxGalleryArray(base64ImagesArray)
    this.setMainImage(this.gallery[0])
  }

  async init(){
    if(this.videoName){
      this.geometricFile = await this.videoService.getGeometricFile(this.videoName)
      await this.loadPolygonDrawer(this.videoName) 
    }
  }

  setMainImage(img: any){
    this.currentFrame = img
    this.loadCanvas(img.image)
  }

  setCanvasCallback(ctx: CanvasRenderingContext2D){
    ctx.canvas.onmouseup = (e) => {
      this.clicks.push({
        x: e.offsetX,
        y: e.offsetY
      })
      this.redraw(ctx)
    }
  }

  redraw(ctx: CanvasRenderingContext2D){
    //in order to clear the canvas, reload image
    ctx.canvas.width = ctx.canvas.width;
    ctx.drawImage(this.currentImgObject, 0, 0, ctx.canvas.width,  ctx.canvas.height)

    this.drawPolygon(ctx)
    this.drawPoints(ctx)
  }
  
  drawPoints(ctx: CanvasRenderingContext2D){
    ctx.strokeStyle = "#df4b26"; 
    ctx.lineJoin = "round"; 
    ctx.lineWidth = 5; 
                
    for(var i=0; i < this.clicks.length; i++){ 
      ctx.beginPath(); 
      ctx.arc(this.clicks[i].x, this.clicks[i].y, 3, 0, 2 * Math.PI, false); 
      ctx.fillStyle = '#ffffff'; 
      ctx.fill(); 
      ctx.lineWidth = 5; 
      ctx.stroke(); 
    }
  }

  drawPolygon(ctx: CanvasRenderingContext2D){
    ctx.fillStyle = 'rgba(100,100,100,0.5)';
    ctx.strokeStyle = "#df4b26";
    ctx.lineWidth = 1;
    
    ctx.beginPath();
    ctx.moveTo(this.clicks[0].x, this.clicks[0].y);
    for(var i=1; i < this.clicks.length; i++) { 
      ctx.lineTo(this.clicks[i].x,this.clicks[i].y);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  createNgxGalleryArray(base64Images: any[]){
    return base64Images.map(base64Img => {
      return {
        image: `data:image/png;base64,${base64Img.img}`,
        thumbImage: `data:image/png;base64,${base64Img.img}`,
        frameNumber: base64Img.frameNumber
      }
    })
  }

  onArrowClicked(event: any){
    console.log(`arrow clicked!`);
    console.table(event);
  }

  async onSaveButtonClicked(){
    if(this.videoName){
      this.saveCurrentFrameClicks()
      await this.videoService.saveGeometricFile(this.videoName, this.geometricFile)
      alert("saved successfully")
    }
  }

  saveCurrentFrameClicks(){
    const currentFrameNumber = this.currentFrame.frameNumber
    this.geometricFile[currentFrameNumber.toString()] = {coordinates : this.clicks}
  }

  onGalleryImageClick(index: number){
    this.saveCurrentFrameClicks()
    this.currentFrame = this.gallery[index]
    this.clicks = []
    this.loadCanvas(this.currentFrame.image)
    console.table(index)
  }

  loadCanvas(img: string){
    const ctx = this.canvas.nativeElement.getContext("2d")
    if(ctx){
      this.drawImageOnCanvas(img, ctx)
      this.setCanvasCallback(ctx)
    }
  }

  drawInitialPolygons(ctx: CanvasRenderingContext2D){
    const imageClicks = this.geometricFile[this.currentFrame.frameNumber.toString()]?.coordinates
    if(imageClicks && ctx){
      imageClicks.map((click: any) => {
        this.clicks.push(click)
        // this.redraw(ctx)
      })
      this.redraw(ctx)
    }
  }

  drawImageOnCanvas(img: string, ctx: CanvasRenderingContext2D){
    this.currentImgObject = new Image()
    this.currentImgObject.onload = () => {
      ctx.drawImage(this.currentImgObject, 0, 0, ctx.canvas.width,  ctx.canvas.height)
      this.drawInitialPolygons(ctx)
    }
    this.currentImgObject.src = img
  }
}
