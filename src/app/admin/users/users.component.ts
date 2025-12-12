import { Component } from '@angular/core';
import { AdminDataService } from '../../services/admin-data.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  constructor(private adminDataService: AdminDataService) { }

  first = 0;
  last = 0;
  users: any[] = [];
  disablePrev: boolean = true;
  disableNext = false;
  searchQuery: string = "";
  timeOutId : any;

  ngOnInit() {
    this.adminDataService.getNextUsers(this.last).subscribe((users: any) => {
      if (users.length > 0) {
        this.last = users[users.length - 1];
        this.first = users[0];
        this.users = users;
      }
      else {
        this.disableNext = true;
      }
    });
  }

  nextPage() {
    this.adminDataService.getNextUsers(this.last).subscribe((users: any) => {
      if (users.length > 0) {
        this.last = users[users.length - 1];
        this.first = users[0];
        this.users = users;
        console.log(users);
        this.disablePrev = false;
      }
      else {
        this.disableNext = true;
      }
    });
  }

  prevPage() {
    this.adminDataService.getPrevUsers(this.first).subscribe((users: any) => {
      if (users.length > 0) {
        this.last = users[users.length - 1];
        this.first = users[0];
        this.users = users;
        console.log(users);
        this.disableNext = false;
      }
      else {
        this.disablePrev = true;
      }
    });
  }

  search() {
    clearInterval(this.timeOutId);
    this.timeOutId = setTimeout(() => {
      this.adminDataService.searchUsers(this.searchQuery).subscribe(data => {
        console.log(data);
        this.users = data
      })
    }, 1000);
  }

}
