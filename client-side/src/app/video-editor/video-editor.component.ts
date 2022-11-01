import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { NgImageSliderComponent } from 'ng-image-slider';
import { VideoService } from '../services/video.service';
import { ShowDiffDialogComponent } from '../show-diff-dialog/show-diff-dialog.component';

@Component({
  selector: 'app-video-editor',
  templateUrl: './video-editor.component.html',
  styleUrls: ['./video-editor.component.scss']
})
export class VideoEditorComponent implements OnInit {
  @ViewChild('canvas', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;

  @ViewChild('nav', { static: true })
  slider!: NgImageSliderComponent

  videoName: string | null = null
  currentFrame: any
  gallery: any[] = []
  fps: number = 1
  frameNumber: number = 0
  clicks: any[] = []
  currentImgObject: any
  geometricFile: any = {}
  prevGeometricFile: any = {}
  imageSize = {width: '20%', height: '20%'}
  duration: number = 0
  framesToSkip: number = 0
  currentFps: number = 1
  constructor(
    private videoService: VideoService,
    private router: ActivatedRoute,
    private dialog: MatDialog) { }

  ngOnInit(): void {
    this.videoName = this.router.snapshot.paramMap.get('videoName')
    this.init()
    
  }
  onShowDiffClicked(){
    this.dialog.open(ShowDiffDialogComponent, {
      data: {
        prev: this.prevGeometricFile,
        curr: this.geometricFile
      }
    });
  }

  async onGoButtonClicked(){
    if(this.videoName && this.fps > 0 && this.frameNumber >=0 && this.videoService.isLegalFrame(this.fps, this.frameNumber, this.duration)){
      this.currentFps = this.fps
      this.saveCurrentFrameClicks()
      await this.loadPolygonDrawer(this.videoName)
      console.table(this.gallery)
    }
    else{
      alert("please choose legal frame/fps/image")
    }
  }

  async loadPolygonDrawer(videoName: string){
    this.clicks = []
    const base64ImagesArray = await this.videoService.getFramesArray(videoName, this.frameNumber, this.fps)
    this.gallery = this.createNgxGalleryArray(base64ImagesArray)
    if(this.gallery.length > 0){
      this.setMainImage(this.gallery[0])
    }
  }

  async init(){
    if(this.videoName){
      this.duration = await this.videoService.getVideoDuration(this.videoName)
      this.geometricFile = await this.videoService.getGeometricFile(this.videoName)
      this.prevGeometricFile = JSON.parse(JSON.stringify(this.geometricFile))
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
  async onSkipButtonClicked(){
    if(this.gallery?.length > 0 && this.framesToSkip != 0){
      const frameToMove = ((this.gallery[0].frameNumber/1000) * this.currentFps) + this.framesToSkip
      if(this.videoName && this.currentFps > 0 && this.frameNumber >=0 && this.videoService.isLegalFrame(this.currentFps, ((this.gallery[0].frameNumber * this.currentFps))/(1000) + this.framesToSkip, this.duration)){
        await this.move(frameToMove)
      }
    }else{
      await this.init()
    }
  }

  async move(frameNumber: number){
    this.saveCurrentFrameClicks()
    this.frameNumber = frameNumber
    this.framesToSkip = 0
    await this.loadPolygonDrawer(this.videoName!)
  }

  redraw(ctx: CanvasRenderingContext2D){
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
      return this.createNgxGalleryImage(base64Img)
    })
  }
  createNgxGalleryImage(base64Img: any){
    return {
      image: `data:image/png;base64,${base64Img.img}`,
      thumbImage: `data:image/png;base64,${base64Img.img}`,
      frameNumber: base64Img.frameNumber,
      title: Math.round(((base64Img.frameNumber * this.fps)/(1000))).toString(),
    }
  }

  async onArrowClicked(event: any){
    if(event.action == 'next' && event.nextDisable){
      await this.handleNext()
    }
    else if(event.action == 'prev' && event.prevDisable){
      await this.handlePrev()
    }
  }
  onClearImageClicked(){
    this.geometricFile[this.currentFrame.frameNumber.toString()] = []
    this.clicks = []
    this.setMainImage(this.currentFrame)
  }
  
  async handleNext(){
    const lastFrame = this.gallery[this.gallery.length - 1].frameNumber
    const nextFrame = await this.videoService.getNextFrame(lastFrame, this.videoName!, this.fps, this.duration)
    if(nextFrame){
      const galleryImage = this.createNgxGalleryImage(nextFrame)
      this.gallery.push(galleryImage)
      this.gallery = this.gallery.slice(1)
    }
  }

  async handlePrev(){
    const firstFrame = this.gallery[0].frameNumber
    const prevFrame =  await this.videoService.getNextFrame(firstFrame, this.videoName!, this.fps, this.duration)
    if(prevFrame){
      const galleryImage = this.createNgxGalleryImage(prevFrame)
      this.gallery.unshift(prevFrame)
      this.gallery.pop()
    }
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
    if(imageClicks && imageClicks.length > 0 && ctx){
      imageClicks.map((click: any) => {
        this.clicks.push(click)
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
