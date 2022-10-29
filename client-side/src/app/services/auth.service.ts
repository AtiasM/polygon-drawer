import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { BASE_URL, User } from '../metadata';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})

export class AuthService {
  private userURL = BASE_URL + 'user/'

  constructor(
    private httpService: HttpClient,
    private router: Router) { }

  async registerUser(user: User){
    try{
      return await this.httpService.post(this.userURL + 'register', user, {observe: 'response'}).toPromise()
    }
    catch(err: any){
      alert(err.error)
      return undefined
    }
  }

  async loginUser(user: User){
    try{
      return await this.httpService.post(this.userURL + 'login', user, {observe: 'response'}).toPromise()
    }catch(err: any){
      alert(err.error)
      return undefined
    }
  } 

  logoutUser(){
    localStorage.removeItem('auth-token')
    this.router.navigate(['login'])

  }

  isLoggedIn(){
    return localStorage.getItem('auth-token') != null
  }
  
  getToken(){
    return localStorage.getItem('auth-token')
  }

}
