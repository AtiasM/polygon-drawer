import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginUserData: any = {}

  constructor(
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {

  }
  async onLoginClicked(){
    console.dir(this.loginUserData, {depth: null, colors: true})
    const res = await this.authService.loginUser(this.loginUserData)
    if(!res){
      return
    }
    const token = res.headers.get('auth-token')
    if(token){
      localStorage.setItem('auth-token', token)
      this.router.navigate(['video-upload'])
    
    }
  }
}
