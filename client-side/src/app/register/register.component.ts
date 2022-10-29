import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerUserData: any = {}
  constructor(
    private authService: AuthService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  async onRegisterClicked(){
    // console.dir(this.registerUserData, {depth: null, colors: true})
    const res = await this.authService.registerUser(this.registerUserData)
    if(!res){
      return 
    }
    this.router.navigate(['login']).then((res) => {
      alert('you can now use your username and password to login!')
    })
    
    // console.dir(res, {depth: null, colors: true});
  }

}
