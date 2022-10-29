import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VideoEditorComponent } from './video-editor/video-editor.component';
import { VideoMenuComponent } from './video-menu/video-menu.component';
import { VideoUploadComponent } from './video-upload/video-upload.component';

const routes: Routes = [
{
  path: 'login',
  component: LoginComponent
},
{
  path: 'register',
  component: RegisterComponent
},
{
  path: 'video-upload',
  component: VideoUploadComponent, 
  canActivate: [AuthGuard]
},
{
  path: 'video-editor',
  component: VideoEditorComponent,
  canActivate: [AuthGuard]
},
{
  path: 'video-menu',
  component: VideoMenuComponent,
  canActivate: [AuthGuard]
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
