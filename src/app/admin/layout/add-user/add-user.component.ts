import { Component, EventEmitter, Output } from '@angular/core';
import { AdminDataService } from '../../../services/admin-data.service';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [
    FormsModule
  ],
  templateUrl: './add-user.component.html',
  styleUrl: './add-user.component.scss'
})
export class AddUserComponent {

  user : any;
  constructor(
    private adminDataService: AdminDataService,
    public authService: AuthService,
  ) { 
    this.authService.user.subscribe((user)=>this.user = user);
  }

  @Output()
  closeModelEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  userAddedEvent: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output()
  errorEvent: EventEmitter<boolean> = new EventEmitter<boolean>();

  handalAddUser(userForm: any) {
    console.log(userForm.value);
    this.adminDataService.addUser(userForm.value).then((user) => {
      this.userAddedEvent.emit(true);
    }).catch((error) => {
      this.errorEvent.emit(true);
    });
  }

  closeModel() {
    this.closeModelEvent.emit(true);
  }

}
