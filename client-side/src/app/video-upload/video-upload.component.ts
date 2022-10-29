import { Component, OnInit } from '@angular/core';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-video-upload',
  templateUrl: './video-upload.component.html',
  styleUrls: ['./video-upload.component.scss']
})
export class VideoUploadComponent implements OnInit {
  selectedFile: File | undefined;
  isFileSelected = false
  constructor(private videoService: VideoService) { }

  ngOnInit(): void {
  }
  onFileSelected(event: any){
    if(event?.target?.files?.length > 0){
      this.selectedFile = event?.target?.files[0]
      this.isFileSelected = true
    }
    else{
      this.isFileSelected = false
    }
    
  }
  async onUpload(event: any){
    if(this.isFileSelected && this.selectedFile){
      console.log('inside if ')
      await this.videoService.uploadVideo(this.selectedFile)
    }
    else{
      console.log('inside else')
      alert('please choose a video file!')
    }
  }

}
