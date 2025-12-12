import { inject } from "@angular/core";
import { Router } from "@angular/router";

export const adminGuard = ()=>{
    const router = inject(Router)
    const user = JSON.parse(localStorage.getItem('user') as string);
    if(!user){
        router.navigate(['/login']);
        return false; 
    }
    if(!user?.role?.includes('admin')){
        router.navigate(['/login']);
        return false; 
    }
    return true;

}