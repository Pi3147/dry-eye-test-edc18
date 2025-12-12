import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import { AddUserComponent } from './add-user/add-user.component';
import { CommonModule } from '@angular/common';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    AddUserComponent,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {
  constructor(
    private angularFireAuth : AngularFireAuth, 
    private router : Router,  
    private toastr: ToastrService,
    private authService : AuthService,
  ){}

  showAddUserModal = false;
  user:any;

  ngOnInit() {
    // this.angularFireAuth.authState.subscribe((user) => {
    //   if(!user){
    //     this.router.navigate(['/login']);
    //   }
    // });
    this.authService.user.subscribe((user) => this.user = user)
  }

  logoutHandler() {
    this.authService.logout()
  }

  showAddUserModalHandaler(){
    this.showAddUserModal = true;
  }

  closeAddUser(){
    this.showAddUserModal = false;
  }

  successUserAdded(){
    this.showAddUserModal = false;
    this.toastr.success('User Added', '', {
      timeOut: 3000,
      positionClass : "toast-top-center"
    });
  }

  errorUserAdded(){
    this.showAddUserModal = false;
    this.toastr.error('Error', '', {
      timeOut: 3000,
      positionClass : "toast-top-center"
    });
  }

  getLabel(calc: string): string {
    if(calc.includes("usg")){
      return "USG";
    }
    if(calc.includes("fssg")){
      return "FSSG";
    }
    if (calc.startsWith('copd')) {
      const parts = calc.split('-');
      return parts.length === 1
        ? 'COUGH English'
        : `COUGH-${parts.slice(1).join('-').toUpperCase()}`.replaceAll("-", " ");
    }
    return calc === 'pink-camp' ? 'PINK' : calc.toUpperCase().replaceAll("-", " ");
  }
  

}
