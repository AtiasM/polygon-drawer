import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './services/auth.service';
import { TokenInterceptorService } from './services/token-interceptor.service';
import { VideoService } from './services/video.service';
import { VideoUploadComponent } from './video-upload/video-upload.component';
import { VideoEditorComponent } from './video-editor/video-editor.component';
import { VideoMenuComponent } from './video-menu/video-menu.component';
import {MatListModule} from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon'
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { BrowserAnimationsModule} from '@angular/platform-browser/animations'
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgImageSliderModule } from 'ng-image-slider';
import {MatButtonModule} from '@angular/material/button';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    VideoUploadComponent,
    VideoEditorComponent,
    VideoMenuComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    MatListModule,
    MatIconModule,
    NgxGalleryModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    NgImageSliderModule,
    MatButtonModule
  ],
  providers: [
    AuthService,
    VideoService,
    AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
