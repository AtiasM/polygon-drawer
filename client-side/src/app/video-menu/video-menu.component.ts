import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoService } from '../services/video.service';

@Component({
  selector: 'app-video-menu',
  templateUrl: './video-menu.component.html',
  styleUrls: ['./video-menu.component.scss']
})
export class VideoMenuComponent implements OnInit {
  videosNames: string[] = []
  constructor(
    private videoService: VideoService,
    private router: Router,
    ) { }

  ngOnInit(): void {
    this.init()
  }
  async init(){
    this.videosNames = await this.videoService.getVideoNames()
  }

  editVideo(videoName: string){
    this.router.navigate(['../video-editor', {videoName: videoName}])

  }

}
