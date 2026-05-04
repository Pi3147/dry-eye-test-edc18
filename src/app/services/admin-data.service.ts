// import { Injectable } from '@angular/core';
// import { AngularFirestore } from '@angular/fire/compat/firestore';
// import { map } from 'rxjs';
// import { AuthService } from './auth.service';
// import { Timestamp } from '@angular/fire/firestore';
// import { BehaviorSubject } from 'rxjs';
// import {
//   getFirestore,
//   collection,
//   query,
//   where,
//   getCountFromServer,
//   doc,
//   getDocs,
// } from 'firebase/firestore';

// import moment from 'moment'; // or use native Date methods

// function chunkArray(array: any[], size: number): any[][] {
//   const chunks = [];
//   for (let i = 0; i < array.length; i += size) {
//     chunks.push(array.slice(i, i + size));
//   }
//   return chunks;
// }

// @Injectable({
//   providedIn: 'root',
// })
// export class AdminDataService {
//   public mrs: any[] = [];
//   public user: any;

//   constructor(
//     private fireStore: AngularFirestore,
//     private authService: AuthService
//   ) {
//     this.authService.user.subscribe((user) => (this.user = user));
//   }

//   async getNextLogs(last: any, calcName: string) {
//     if (this.mrs.length === 0) {
//       const mrs = await this.getOrganizationMrs();
//       this.mrs = mrs;
//     }

//     // console.log(this.mrs);

//     const mrRefs = this.mrs.map(
//       (mr: any) => this.fireStore.doc(`mrs/${mr.id}`).ref
//     );

//     const chunks = chunkArray(mrRefs, 30);

//     let logs: any[] = [];
//     let lastDate = last ? last['date'] : 0;

//     for (const chunk of chunks) {
//       if (logs.length >= 10) break;

//       const querySnapshot: any = await this.fireStore
//         .collection('score-logs', (ref) =>
//           ref
//             .where('calculator_name', '==', calcName)
//             .where('mr_id', 'in', chunk)
//             .orderBy('date')
//             .startAfter(lastDate)
//             .limit(10 - logs.length)
//         )
//         .get()
//         .toPromise();

//       const chunkLogs = querySnapshot.docs.map((doc: any) => ({
//         ...doc.data(),
//         id: doc.id,
//       }));

//       logs = logs.concat(chunkLogs);

//       if (chunkLogs.length > 0) {
//         lastDate = chunkLogs[chunkLogs.length - 1]['date'];
//       }
//       if (logs.length >= 10) break;
//     }

//     return logs;
//   }

//   getOrganizations() {
//     return this.fireStore.collection('organizations', (ref=>ref.where("name", "==", this.user.organization.name)))
//     .valueChanges({ idField: 'id' });
//   }

//   async getNextLogsFilterDate(last: any, calcName: string, filterDate: string, filterToDate: string) {
//     const date = new Date(filterDate)
//     if (this.mrs.length === 0) {
//       const mrs = await this.getOrganizationMrs();
//       this.mrs = mrs;
//     }

//     const startOfDay = new Date(`${filterDate}T00:00:00`);
//     const endOfDay = new Date(`${filterToDate}T23:59:59.999`);
//     console.log(filterDate);
//     console.log(startOfDay);
//     console.log(endOfDay);

//     // console.log(this.mrs);

//     const mrRefs = this.mrs.map(
//       (mr: any) => this.fireStore.doc(`mrs/${mr.id}`).ref
//     );

//     const chunks = chunkArray(mrRefs, 30);

//     let logs: any[] = [];
//     let lastDate = last ? last['date'] : 0;

//     for (const chunk of chunks) {
//       if (logs.length >= 10) break;

//       const querySnapshot: any = await this.fireStore
//         .collection('score-logs', (ref) =>
//           ref
//             .where('calculator_name', '==', calcName)
//             .where('mr_id', 'in', chunk)
//             .where('date', '>=', Timestamp.fromDate(startOfDay))
//             .where('date', '<=', Timestamp.fromDate(endOfDay))
//             .orderBy('date')
//             .startAfter(lastDate)
//             .limit(10 - logs.length)
//         )
//         .get()
//         .toPromise();

//       const chunkLogs = querySnapshot.docs.map((doc: any) => ({
//         ...doc.data(),
//         id: doc.id,
//       }));

//       logs = logs.concat(chunkLogs);

//       if (chunkLogs.length > 0) {
//         lastDate = chunkLogs[chunkLogs.length - 1]['date'];
//       }

//       console.log(chunk);
//       console.log(chunkLogs);
//       if (logs.length >= 10) break;
//     }

//     return logs;
//   }

//   async getPrevLogs(first: any, calcName: string) {
//     if (!this.mrs || this.mrs.length === 0) {
//       const mrs = await this.getOrganizationMrs();
//       this.mrs = mrs;
//     }

//     // console.log(this.mrs);

//     const mrRefs = this.mrs.map(
//       (mr: any) => this.fireStore.doc(`mrs/${mr.id}`).ref
//     );

//     const chunks = chunkArray(mrRefs, 30);

//     let logs: any[] = [];
//     let lastDate = first ? first['date'] : 0;

//     for (const chunk of chunks) {
//       if (logs.length >= 10) break;

//       const querySnapshot: any = await this.fireStore
//         .collection('score-logs', (ref) =>
//           ref
//             .where('calculator_name', '==', calcName)
//             .where('mr_id', 'in', chunk)
//             .orderBy('date')
//             .endBefore(lastDate)
//             .limitToLast(10 - logs.length)
//         )
//         .get()
//         .toPromise();

//       const chunkLogs = querySnapshot.docs.map((doc: any) => ({
//         ...doc.data(),
//         id: doc.id,
//       }));

//       logs = logs.concat(chunkLogs);

//       if (chunkLogs.length > 0) {
//         lastDate = chunkLogs[chunkLogs.length - 1]['date'];
//       }

//       if (logs.length >= 10) break;
//     }

//     // console.log(logs);
//     return logs;
//   }
//   async getPrevLogsFilterDate(
//     first: any,
//     calcName: string,
//     filterDate: string,
//     filterToDate: string
//   ) {
//     if (!this.mrs || this.mrs.length === 0) {
//       const mrs = await this.getOrganizationMrs();
//       this.mrs = mrs;
//     }

//     // console.log(this.mrs);
//     const startOfDay = new Date(`${filterDate}T00:00:00.000Z`);
//     const endOfDay = new Date(`${filterToDate}T23:59:59.999Z`);

//     const mrRefs = this.mrs.map(
//       (mr: any) => this.fireStore.doc(`mrs/${mr.id}`).ref
//     );

//     const chunks = chunkArray(mrRefs, 30);

//     let logs: any[] = [];
//     let lastDate = first ? first['date'] : 0;

//     for (const chunk of chunks) {
//       if (logs.length >= 10) break;

//       const querySnapshot: any = await this.fireStore
//         .collection('score-logs', (ref) =>
//           ref
//             .where('calculator_name', '==', calcName)
//             .where('mr_id', 'in', chunk)
//             .where('date', '>=', Timestamp.fromDate(startOfDay))
//             .where('date', '<=', Timestamp.fromDate(endOfDay))
//             .orderBy('date')
//             .endBefore(lastDate)
//             .limitToLast(10 - logs.length)
//         )
//         .get()
//         .toPromise();

//       const chunkLogs = querySnapshot.docs.map((doc: any) => ({
//         ...doc.data(),
//         id: doc.id,
//       }));

//       logs = logs.concat(chunkLogs);

//       if (chunkLogs.length > 0) {
//         lastDate = chunkLogs[chunkLogs.length - 1]['date'];
//       }

//       if (logs.length >= 10) break;
//     }

//     // console.log(logs);
//     return logs;
//   }

//   getNextUsers(last: any) {
//     const organizationRef = this.fireStore.doc(
//       `organizations/${this.user.organization_id}`
//     ).ref;
//     console.log(organizationRef.id);
//     return this.fireStore
//       .collection('mrs', (ref) =>
//         ref
//           .where('organization', '==', organizationRef)
//           .orderBy('employee_id')
//           .startAfter(last ? last['employee_id'] : 0)
//           .limit(10)
//       )
//       .valueChanges();
//   }

//   getPrevUsers(first: any) {
//     const organizationRef = this.fireStore.doc(
//       `organizations/${this.user.organization_id}`
//     ).ref;
//     return this.fireStore
//       .collection('mrs', (ref) =>
//         ref
//           .where('organization', '==', organizationRef)
//           .orderBy('employee_id')
//           .endBefore(first['employee_id'])
//           .limitToLast(10)
//       )
//       .valueChanges();
//   }

//   addUser(user: any) {
//     const id = new Date().getTime();
//     return this.fireStore.collection('mrs').add({
//       ...user,
//       created_at: new Date(),
//       organization: this.fireStore.doc(
//         `organizations/${this.user.organization_id}`
//       ).ref,
//     });
//   } // testZYDUS123

//   searchUsers(queryString: string) {
//     return this.fireStore
//       .collection('mrs', (ref) =>
//         ref
//           .where('name', '>=', queryString)
//           .where('name', '<=', queryString + '\uf8ff')
//       )
//       .get()
//       .pipe(
//         map((querySnapshot) => {
//           return querySnapshot.docs.map((doc) => doc.data());
//         })
//       );
//   }

//   searchLogs(queryString: string) {
//     return this.fireStore
//       .collection('score-logs', (ref) =>
//         ref
//           .where('doctorName', '>=', queryString)
//           .where('doctorName', '<=', queryString + '\uf8ff')
//       )
//       .get()
//       .pipe(
//         map((querySnapshot) => {
//           return querySnapshot.docs.map((doc) => doc.data());
//         })
//       );
//   }

//   async getOrganizationMrs() {
//     try {
//       // console.log(this.user);

//       if (!this.user?.organization_id) {
//         throw new Error('Organization not found');
//       }
//       const organizationRef = this.fireStore.doc(
//         `organizations/${this.user.organization_id}`
//       ).ref;

//       // console.log(organizationRef)

//       const querySnapshot = await this.fireStore
//         .collection('mrs')
//         .ref.where('organization', '==', organizationRef)
//         .get();

//       const docs = querySnapshot.docs.map((doc: any) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       // console.log(docs);
//       return docs;
//     } catch (err) {
//       alert('Error Feching Data');
//       throw err;
//     }
//   }

//   // getAllDoctorsCampCount(calculator_name: string) {
//   //   const db = getFirestore();
//   //   const doctorsRef = collection(db, "score-logs");
//   //   const q = query(doctorsRef, where("calculator_name", "==", calculator_name));
//   //   return getCountFromServer(q).then((countResult) => countResult.data().count);
//   // }

//   getAllPatentCount(calculator_name: string) {
//     const db = getFirestore();
//     const doctorsRef = collection(db, 'score-logs');
//     const q = query(
//       doctorsRef,
//       where('calculator_name', '==', calculator_name)
//     );
//     return getCountFromServer(q).then(
//       (countResult) => countResult.data().count
//     );
//   }

//   getAllPatientCountThisMonth(calculator_name: string) {
//     const db = getFirestore();
//     const doctorsRef = collection(db, 'score-logs');

//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const endOfNow = new Date(); // You can also set to last day of month if needed
//     // const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

//     const q = query(
//       doctorsRef,
//       where('calculator_name', '==', calculator_name),
//       where('date', '>=', Timestamp.fromDate(startOfMonth)),
//       where('date', '<=', Timestamp.fromDate(endOfNow))
//     );

//     return getCountFromServer(q).then(
//       (countResult) => countResult.data().count
//     );
//   }

//   async getOrganizationMrsCount() {
//     try {
//       if (!this.user?.organization_id) {
//         throw new Error('Organization not found');
//       }

//       const db = getFirestore(); // Assuming fireStore is initialized with getFirestore()
//       const organizationRef = doc(
//         db,
//         `organizations/${this.user.organization_id}`
//       );

//       const mrsQuery = query(
//         collection(db, 'mrs'),
//         where('organization', '==', organizationRef)
//       );

//       const countSnapshot = await getCountFromServer(mrsQuery);
//       return countSnapshot.data().count;
//     } catch (err) {
//       alert('Error fetching MR count');
//       throw err;
//     }
//   }

//   async getUniquePatientCounts(
//     calculator_name: string
//   ): Promise<{ total: number; thisMonth: number }> {
//     const db = getFirestore();
//     const doctorsRef = collection(db, 'score-logs');

//     const q = query(
//       doctorsRef,
//       where('calculator_name', '==', calculator_name)
//     );

//     const snapshot = await getDocs(q);

//     const allUnique = new Set<string>();
//     const thisMonthUnique = new Set<string>();

//     const now = new Date();
//     const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
//     const endOfNow = now;

//     snapshot.forEach((doc) => {
//       const data = doc.data();
//       const mrRef = data?.['mr_id'];
//       const date = data?.['date']?.toDate?.();

//       if (mrRef?.id && date) {
//         const dateKey = moment(date).format('YYYY-MM-DD');
//         const dayKey = `${mrRef.id}_${dateKey}`;
//         allUnique.add(dayKey);

//         if (date >= startOfMonth && date <= endOfNow) {
//           thisMonthUnique.add(dayKey);
//         }
//       }
//     });

//     return {
//       total: allUnique.size,
//       thisMonth: thisMonthUnique.size,
//     };
//   }

//   async getPrescriptionBrands() {
//     const organization: any = await this.fireStore
//       .doc(`organizations/${this.user.organization_id}`)
//       .ref.get();
//     return organization?.data()?.brands ?? [];
//   }

//   async updatePrescriptionBrands(brands: string[]) {
//     try {
//       await this.fireStore
//         .doc(`organizations/${this.user.organization_id}`)
//         .update({
//           brands: brands,
//         });
//       return true;
//     } catch (error) {
//       console.error('Error updating prescription brands:', error);
//       return false;
//     }
//   }
// }

import { Injectable } from '@angular/core';
import { AngularFirestore, DocumentReference } from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

@Injectable({
  providedIn: 'root',
})
export class AdminDataService {
  private mrs: any[] = [];
  public user: any;

  constructor(
    private fireStore: AngularFirestore,
    private authService: AuthService
  ) {
    this.authService.user.subscribe((user) => (this.user = user));
  }

  private async loadAllMrs(): Promise<void> {
    if (this.mrs.length > 0) return;

    try {
      const snapshot = await this.fireStore.collection('mrs').ref.get();

      const validMrs: any[] = [];

      snapshot.docs.forEach(doc => {
        if (doc.exists && doc.id) {
          const data = doc.data() as any;
          validMrs.push({
            id: doc.id,
            name: data.name || 'Unknown',
            employee_id: data.employee_id || '',
            // add other fields if you want
          });
        }
      });

      this.mrs = validMrs;

      console.log(`Successfully loaded ${this.mrs.length} clean MRs`);
    } catch (err) {
      console.error('Failed to load MRs:', err);
      this.mrs = [];
    }
  }

  private getValidMrRefs(): any[] {
    const refs: any[] = [];

    for (const mr of this.mrs) {
      if (mr && mr.id) {
        try {
          const ref = this.fireStore.doc(`mrs/${mr.id}`).ref;
          refs.push(ref);
        } catch (e) {
          console.warn('Bad MR reference skipped:', mr.id);
        }
      }
    }

    console.log(`Returning ${refs.length} valid Firestore references`);
    return refs;
  }
  async getNextLogs(last: any, calcName: string): Promise<any[]> {
    const logs: any[] = [];
    let lastDate = last?.date ?? Timestamp.fromMillis(0);
    // await this.loadAllMrs();

    // const mrRefs = this.getValidMrRefs();
    // if (mrRefs.length === 0) {
    //   console.warn('No valid MR references — returning empty logs');
    //   return [];
    // }
    // const chunks = chunkArray(mrRefs, 30);

    // for (const chunk of chunks) {
    //   if (logs.length >= 10) break;

    //   const querySnapshot = await this.fireStore
    //     .collection('score-logs', (ref) =>
    //       ref
    //         .where('calculator_name', '==', calcName)
    //         .where('mr_id', 'in', chunk)
    //         .orderBy('date')
    //         .startAfter(lastDate)
    //         .limit(10 - logs.length)
    //     )
    //     .get()
    //     .toPromise();

    //   // querySnapshot is guaranteed after await
    //   querySnapshot!.docs.forEach((doc) => {
    //     const data = doc.data() as { [key: string]: any };
    //     logs.push({
    //       id: doc.id,
    //       ...data,
    //       date: data['date'] as Timestamp,
    //       mr_id: data['mr_id'] as DocumentReference,
    //     });
    //   });

    //   if (querySnapshot!.docs.length > 0) {
    //     const lastDoc = querySnapshot!.docs[querySnapshot!.docs.length - 1];
    //     lastDate = (lastDoc.data() as { [key: string]: any })['date'] as Timestamp;
    //   }
    // }

    const querySnapshot = await this.fireStore
        .collection('score-logs', (ref) =>
          ref
            .where('calculator_name', '==', calcName)
            .orderBy('date')
            .startAfter(lastDate)
            .limit(10 - logs.length)
        )
        .get()
        .toPromise();

      // querySnapshot is guaranteed after await
      querySnapshot!.docs.forEach((doc) => {
        const data = doc.data() as { [key: string]: any };
        logs.push({
          id: doc.id,
          ...data,
          date: data['date'] as Timestamp,
          mr_id: data['mr_id'] as DocumentReference,
        });
      });

    return logs;
  }

  async getNextLogsFilterDate(
    last: any,
    calcName: string,
    filterDate: string,
    filterToDate: string
  ): Promise<any[]> {
    await this.loadAllMrs();

    const startOfDay = new Date(`${filterDate}T00:00:00.000Z`);
    const endOfDay = new Date(`${filterToDate}T23:59:59.999Z`);

    const mrRefs = this.getValidMrRefs();
    if (mrRefs.length === 0) {
      console.warn('No valid MR references — returning empty logs');
      return [];
    }
    const chunks = chunkArray(mrRefs, 30);
    const logs: any[] = [];
    let lastDate = last?.date ?? Timestamp.fromMillis(0);

    for (const chunk of chunks) {
      if (logs.length >= 10) break;

      const querySnapshot = await this.fireStore
        .collection('score-logs', (ref) =>
          ref
            .where('calculator_name', '==', calcName)
            .where('mr_id', 'in', chunk)
            .where('date', '>=', Timestamp.fromDate(startOfDay))
            .where('date', '<=', Timestamp.fromDate(endOfDay))
            .orderBy('date')
            .startAfter(lastDate)
            .limit(10 - logs.length)
        )
        .get()
        .toPromise();

      querySnapshot!.docs.forEach((doc) => {
        const data = doc.data() as { [key: string]: any };
        logs.push({
          id: doc.id,
          ...data,
        });
      });

      if (querySnapshot!.docs.length > 0) {
        lastDate = (querySnapshot!.docs[querySnapshot!.docs.length - 1].data() as { [key: string]: any })['date'];
      }
    }

    return logs;
  }

async getPrevLogs(first: any, calcName: string): Promise<any[]> {
  const logs: any[] = [];
    // await this.loadAllMrs();

    // const mrRefs = this.getValidMrRefs();
    // if (mrRefs.length === 0) {
    //   console.warn('No valid MR references — returning empty logs');
    //   return [];
    // }
    // const chunks = chunkArray(mrRefs, 30);

    // for (const chunk of chunks) {
    //   if (logs.length >= 10) break;

    //   const querySnapshot = await this.fireStore
    //     .collection('score-logs', (ref) =>
    //       ref
    //         .where('calculator_name', '==', calcName)
    //         .where('mr_id', 'in', chunk)
    //         .orderBy('date', 'desc')
    //         .endBefore(first ? first.date : Timestamp.now())
    //         .limit(10 - logs.length)
    //     )
    //     .get()
    //     .toPromise();

    //   const batch = querySnapshot!.docs.map((doc) => ({
    //     id: doc.id,
    //     ...(doc.data() as { [key: string]: any }),
    //   }));

    //   logs.unshift(...batch); // prepend because we used desc order
    // }

    const querySnapshot = await this.fireStore
        .collection('score-logs', (ref) =>
          ref
            .where('calculator_name', '==', calcName)
            // .where('mr_id', 'in', chunk)
            .orderBy('date', 'desc')
            .endBefore(first ? first.date : Timestamp.now())
            .limit(10 - logs.length)
        )
        .get()
        .toPromise();

      const batch = querySnapshot!.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as { [key: string]: any }),
      }));

      logs.unshift(...batch);
    return logs.slice(0, 10);
  }


  getNextUsers(last: any) {
    const startValue = (typeof last === 'object' && last !== null) ? last.employee_id : last || '';
    return this.fireStore
      .collection('mrs', (ref) =>
        ref
          .orderBy('employee_id')
          .startAfter(startValue)
          .limit(10)
      )
      .valueChanges({ idField: 'id' });
  }

  getPrevUsers(first: any) {
    const endValue = (typeof first === 'object' && first !== null) ? first.employee_id : first || '';
    return this.fireStore
      .collection('mrs', (ref) =>
        ref.orderBy('employee_id').endBefore(endValue).limitToLast(10)
      )
      .valueChanges({ idField: 'id' });
  }

  addUser(user: any) {
    return this.fireStore.collection('mrs').add({
      ...user,
      created_at: Timestamp.now(),
    });
  }

  searchUsers(queryString: string) {
    return this.fireStore
      .collection('mrs', (ref) =>
        ref
          .where('name', '>=', queryString)
          .where('name', '<=', queryString + '\uf8ff')
      )
      .get()
      .pipe(
        map((snapshot) =>
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as { [key: string]: any }),
          }))
        )
      );
  }

  searchLogs(queryString: string) {
    return this.fireStore
      .collection('score-logs', (ref) =>
        ref
          .where('doctorName', '>=', queryString)
          .where('doctorName', '<=', queryString + '\uf8ff')
      )
      .get()
      .pipe(
        map((snapshot) =>
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as { [key: string]: any }),
          }))
        )
      );
  }

  async getAllPatientCount(calculator_name: string): Promise<number> {
    const snapshot = await this.fireStore
      .collection('score-logs', (ref) =>
        ref.where('calculator_name', '==', calculator_name)
      )
      .get()
      .toPromise();

    return snapshot!.size;
  }

  async getAllPatientCountThisMonth(calculator_name: string): Promise<number> {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const snapshot = await this.fireStore
      .collection('score-logs', (ref) =>
        ref
          .where('calculator_name', '==', calculator_name)
          .where('date', '>=', Timestamp.fromDate(startOfMonth))
      )
      .get()
      .toPromise();

    return snapshot!.size;
  }

  async getUniquePatientCounts(calculator_name: string): Promise<{ total: number; thisMonth: number }> {
    const snapshot = await this.fireStore
      .collection('score-logs', (ref) =>
        ref.where('calculator_name', '==', calculator_name)
      )
      .get()
      .toPromise();

    const allUnique = new Set<string>();
    const thisMonthUnique = new Set<string>();

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    snapshot!.forEach((doc) => {
      const data = doc.data() as { [key: string]: any };
      const mrId = data['mr_id']?.id;
      const date: Date | undefined = data['date']?.toDate();

      if (mrId && date) {
        const dateStr = date.toISOString().split('T')[0];
        const key = `${mrId}_${dateStr}`;

        allUnique.add(key);
        if (date >= startOfMonth) {
          thisMonthUnique.add(key);
        }
      }
    });

    return {
      total: allUnique.size,
      thisMonth: thisMonthUnique.size,
    };
  }

  async getOrganizationMrsCount(): Promise<number> {
    const snapshot = await this.fireStore.collection('mrs').ref.get();
    return snapshot.size;
  }

  // Global brands (stored in a fixed document)
  async getPrescriptionBrands(): Promise<string[]> {
    const docSnap = await this.fireStore.doc('config/brands').ref.get();
    if (docSnap.exists) {
      const data = docSnap.data() as { [key: string]: any };
      return data['list'] || [];
    }
    return [];
  }

  async updatePrescriptionBrands(brands: string[]): Promise<boolean> {
    try {
      await this.fireStore.doc('config/brands').set({ list: brands }, { merge: true });
      return true;
    } catch (error) {
      console.error('Error updating brands:', error);
      return false;
    }
  }

    // 1. Fix typo used in logs.component.ts
  async getAllPatentCount(calculator_name: string): Promise<number> {
    // This was a typo — just forward to the correct one
    return this.getAllPatientCount(calculator_name);
  }

  // 2. Bring back the missing prev-with-date-filter method
async getPrevLogsFilterDate(
    first: any,
    calcName: string,
    filterDate: string,
    filterToDate: string
  ): Promise<any[]> {
    await this.loadAllMrs();

    const startOfDay = new Date(`${filterDate}T00:00:00.000Z`);
    const endOfDay   = new Date(`${filterToDate}T23:59:59.999Z`);

    const mrRefs = this.getValidMrRefs();
    if (mrRefs.length === 0) {
      console.warn('No valid MR references — returning empty logs');
      return [];
    }
    const chunks = chunkArray(mrRefs, 30);
    const logs: any[] = [];

    for (const chunk of chunks) {
      if (logs.length >= 10) break;

      const querySnapshot = await this.fireStore
        .collection('score-logs', (ref) =>
          ref
            .where('calculator_name', '==', calcName)
            .where('mr_id', 'in', chunk)
            .where('date', '>=', Timestamp.fromDate(startOfDay))
            .where('date', '<=', Timestamp.fromDate(endOfDay))
            .orderBy('date', 'desc')
            .endBefore(first ? first.date : Timestamp.now())
            .limit(10 - logs.length)
        )
        .get()
        .toPromise();

      const batch = querySnapshot!.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as { [key: string]: any }),
      }));

      logs.unshift(...batch);
    }

    return logs.slice(0, 10);
  }

  getOrganizations() {
    return this.fireStore.collection('mrs').valueChanges({ idField: 'id' }).pipe(map(() => []));

  }
}

