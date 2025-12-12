import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  constructor(private authService: AuthService, private router: Router) { }

  email: string = "";
  password: string = "";
  errormsg: string = "";
  loading: boolean = false;

  loginHandler() {
    
    if(this.validateEmailPassword()){
      this.loading = true;
      this.authService.loginUser(this.email, this.password).then((user) => {
        if(user){
          this.router.navigate(["/admin"])
        }
        else{
          this.errormsg = "Invalid Email or Password";
        }
        this.loading = false;
      }).catch((error) => {
        console.log(error);
        this.errormsg = "Error";
        this.loading = false;
      })
    }
  }

  validateEmailPassword(){
    if(this.email.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)){
      if(this.password.length >= 6){
        return true;
      }
      else{
        this.errormsg = "Password must be 6 characters"
      }
    }
    else{
      this.errormsg = "Enter Valid Email"
    }
    return false;
  }
}
