import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public user = new BehaviorSubject(null);

  constructor(
    private angularAuth: AngularFireAuth,
    private db: AngularFirestore,
    private router: Router,
  ) { 
    this.user.next(JSON.parse(localStorage.getItem('user') as string));
  }

  async loginUser(email: string, password: string): Promise<any> {
    // return this.angularAuth.signInWithEmailAndPassword(email, password);
    try {
      const docs: any = await this.db.collection("data").ref.where("email", "==", email).where("password", "==", password).get()
      if(docs.size >0){
        const doc = docs.docs.map((doc:any) =>doc.data())[0];
        
        // const org = await doc.organization.get();
        // const user = {...doc, organization :org.data(),organization_id : org.id }
        const user = {...doc }

        this.user.next(user);
        localStorage.setItem("user", JSON.stringify(user))
        return user;
      }
      else{
        return false;
      }
    }
    catch (err:any) {
      throw new Error(err);
    }
  }

  // signup(email: string, password: string){
  //   this.angularAuth.createUserWithEmailAndPassword("dhanraj@gmail.com", "123456").then((user) => {
  //     console.log(user);
  //   })
  // }

  logout() {
    localStorage.clear();
    this.router.navigate(['/login'])
  }


}
