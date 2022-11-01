import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BASE_URL } from '../metadata';

@Injectable({
  providedIn: 'root'
})
export class VideoService {
  videoURL = BASE_URL + 'video'
  constructor(private httpService: HttpClient) { }

  async getVideoNames(){
    return (await this.httpService.get(this.videoURL).toPromise() || []) as string[]
  }
  async getVideoDuration(video: string){
    const params = {
      video: video
    }
    const result = await this.httpService.get(this.videoURL + '/duration', {
      params: params
    }).toPromise() as any
    return result?.duration || 0

  }
  async getFramesArray(videoName: string, frameNumber: number, fps: number){
    const params = {
      video: videoName,
      start: frameNumber,
      fps: fps
    }
    const res = await this.httpService.get(this.videoURL + '/get-frames', {
      params: params
    }).toPromise()
    return res as any[]

  }
  isLegalFrame(fps: number, frameNumber: number, duration: number){
    const rate = Math.floor(1000 / fps)
    const frameOffset = rate * frameNumber
    if(frameOffset < 0 || frameOffset > duration){
      return false
    }
    return true
  }
  async getNextFrame(currentFrameOffset: number, videoName: string, fps: number, duration:number){
    const rate = Math.floor(1000 / fps)
    const nextFrameOffset = currentFrameOffset + rate 
    if(nextFrameOffset > duration){
      return undefined
    }
    const params = {
      video: videoName,
      frame: nextFrameOffset
    }
    return await this.httpService.get(this.videoURL + '/frame',{ params: params } ).toPromise()
  }

  ArrayBufferToBase64(buffer: any){
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
       binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }
  
  async uploadVideo(file: File): Promise<boolean>{
    try{
      console.log('uploading..' , file)
      const fd = new FormData()
      fd.append('file', file, file.name)
      await this.httpService.post(this.videoURL, fd).toPromise()
      alert('success!!!')
      return true
    }
    catch(err: any){
      alert(err.error)
      return false
    }
  }

  async getGeometricFile(videoName: string){
    const params = {
      video: videoName
    }
    return await this.httpService.get(this.videoURL + '/geometric-file', {
       params: params
    }).toPromise()
  }

  async saveGeometricFile(videoName: string, geometricFile: object){
    const geometric = JSON.stringify(geometricFile)
    const body = {
      video: videoName,
      geometric: geometric
    }
    return await this.httpService.post(this.videoURL + '/geometric-file', body, { observe: 'response' }).toPromise()
  }

}
