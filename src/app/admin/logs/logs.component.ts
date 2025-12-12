// import { Component } from '@angular/core';
// import { AdminDataService } from '../../services/admin-data.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';
// import { AuthService } from '../../services/auth.service';
// import { saveAs } from 'file-saver';
// import { HttpClient } from '@angular/common/http';
// import { ActivatedRoute, RouterModule } from '@angular/router';

// @Component({
//   selector: 'app-logs',
//   standalone: true,
//   imports: [CommonModule, FormsModule, RouterModule],
//   templateUrl: './logs.component.html',
//   styleUrl: './logs.component.scss'
// })
// export class LogsComponent {

//   user: any;
//   calcName: string = '';
//   base_url: string = "https://kometfunction-cmndbj7gmq-uc.a.run.app";

//   reportLoadingState: any = {
//     "gerd-report": false,
//     "sfar-report": false,
//     "pink-report": false,
//     "insomania-report": false,
//     "insomania-hindi-report": false,
//     // COPD-related reports
//     "copd-report": false,
//     "copd-bengali-report": false,
//     "copd-gujrati-report": false,
//     "copd-hindi-report": false,
//     "copd-kannada-report": false,
//     "copd-malyalam-report": false,
//     "copd-marathi-report": false,
//     "copd-odiya-report": false,
//     "copd-punjabi-report": false,
//     "copd-tamil-report": false,
//     "copd-telgu-report": false,

//     // SAAR report
//     "saar-report": false,
//   }

//   isFilterDate = false;
//   filterFromDate = '';
//   filterToDate = '';
//   patientCount = 0;
//   patientCountThisMonth = 0;
//   emp_count = 0;
//   total_camp = 0;
//   total_camp_this_month = 0;

//   selectedYear: number;
//   selectedMonth: number;
//   yearOptions: number[] = [];
//   monthOptions = [
//     { value: 1, label: 'January' },
//     { value: 2, label: 'February' },
//     { value: 3, label: 'March' },
//     { value: 4, label: 'April' },
//     { value: 5, label: 'May' },
//     { value: 6, label: 'June' },
//     { value: 7, label: 'July' },
//     { value: 8, label: 'August' },
//     { value: 9, label: 'September' },
//     { value: 10, label: 'October' },
//     { value: 11, label: 'November' },
//     { value: 12, label: 'December' }
//   ];

//   constructor(
//     private adminDataService: AdminDataService,
//     public authService: AuthService,
//     private http: HttpClient,
//     private activatedRouter: ActivatedRoute,
//   ) {
//     this.authService.user.subscribe(user => this.user = user);
//     // Initialize yearOptions and default selected values
//     const now = new Date();
//     this.selectedYear = now.getFullYear();
//     this.selectedMonth = now.getMonth() + 1;
//     for (let y = now.getFullYear(); y >= now.getFullYear() - 10; y--) {
//       this.yearOptions.push(y);
//     }
//     this.activatedRouter.queryParamMap.subscribe((params: any) => {
//       this.calcName = params.get('calcName') || 'dry-eye-test';
//       console.log(this.calcName);
//       this.init();
//       this.isFilterDate = false;
//       this.filterFromDate = '';
//       this.filterToDate = '';

//       if (this.user?.organization?.calculators?.includes('insomnia-hindi') ||
//         this.user?.organization?.calculators?.includes('insomnia')) {
//         this.adminDataService.getAllPatentCount(this.calcName)
//           .then((count: any) => {
//             this.patientCount = count;
//           });

//         this.adminDataService.getAllPatientCountThisMonth(this.calcName)
//           .then((count: any) => {
//             this.patientCountThisMonth = count;
//           });
//         this.adminDataService.getOrganizationMrsCount()
//           .then((count: any) => {
//             this.emp_count = count;
//           });
//         this.adminDataService.getUniquePatientCounts(this.calcName)
//           .then((count: any) => {
//             this.total_camp = count.total;
//             this.total_camp_this_month = count.thisMonth;
//           });
//       }

//     })
//   }

//   first = 0;
//   last = 0;
//   logs: any[] = [];
//   disablePrev: boolean = true;
//   disableNext = false;
//   searchQuery: string = "";
//   timeOutId: any;

//   ngOnInit() {
//     // this.init();
//   }

//   init() {

//     if (!this.calcName || this.calcName.trim() === '') {
//       console.warn('calcName is missing or empty — skipping logs not loaded');
//       this.logs = [];
//       return;
//     }

//     this.first = 0;
//     this.last = 0;
//     this.logs = [];
//     this.disablePrev = true;
//     this.disableNext = false;
//     this.searchQuery = "";
//     this.timeOutId = 0;

//     this.adminDataService.getNextLogs(this.last, this.calcName).then((logs: any) => {
//       if (logs.length > 0) {
//         this.last = logs[logs.length - 1];
//         this.first = logs[0];
//         this.logs = logs;
//       }
//       else {
//         this.disableNext = true;
//       }
//     });
//   }

//   filterDateinit() {

//     if (this.filterFromDate && this.filterToDate) {
//       this.first = 0;
//       this.last = 0;
//       this.logs = [];
//       this.disablePrev = true;
//       this.disableNext = false;
//       this.searchQuery = "";
//       this.timeOutId = 0;

//       this.adminDataService.getNextLogsFilterDate(this.last, this.calcName, this.filterFromDate, this.filterToDate).then((logs: any) => {
//         if (logs.length > 0) {
//           this.last = logs[logs.length - 1];
//           this.first = logs[0];
//           this.logs = logs;
//         }
//         else {
//           this.disableNext = true;
//         }
//       });
//     }
//   }



//   nextPage() {
//     if (!this.isFilterDate) {
//       this.adminDataService.getNextLogs(this.last, this.calcName).then((logs: any) => {
//         if (logs.length > 0) {
//           this.last = logs[logs.length - 1];
//           this.first = logs[0];
//           this.logs = logs;
//           console.log(logs);
//           this.disablePrev = false;
//         }
//         else {
//           this.disableNext = true;
//         }
//       });
//     }
//     else {
//       this.adminDataService.getNextLogsFilterDate(this.last, this.calcName, this.filterFromDate, this.filterToDate).then((logs: any) => {
//         if (logs.length > 0) {
//           this.last = logs[logs.length - 1];
//           this.first = logs[0];
//           this.logs = logs;
//           console.log(logs);
//           this.disablePrev = false;
//         }
//         else {
//           this.disableNext = true;
//         }
//       });
//     }


//   }

//   prevPage() {
//     if (!this.isFilterDate) {
//       this.adminDataService.getPrevLogs(this.first, this.calcName).then((logs: any) => {
//         if (logs.length > 0) {
//           this.last = logs[logs.length - 1];
//           this.first = logs[0];
//           this.logs = logs;
//           console.log(logs);
//           this.disableNext = false;
//         }
//         else {
//           this.disablePrev = true;
//         }
//       });
//     }
//     else {
//       this.adminDataService.getPrevLogsFilterDate(this.first, this.calcName, this.filterFromDate, this.filterToDate).then((logs: any) => {
//         if (logs.length > 0) {
//           this.last = logs[logs.length - 1];
//           this.first = logs[0];
//           this.logs = logs;
//           console.log(logs);
//           this.disableNext = false;
//         }
//         else {
//           this.disablePrev = true;
//         }
//       });
//     }
//   }

//   getQuestionsCount(obj: any): number {
//     if (obj) {
//       return obj?.result?.find((patient: any) => patient.key === 'Answers')?.value?.length;
//     }
//     return 0;
//   }

//   getPatientAge(patient: any): number {

//     if (patient) {
//       return patient.find((patient: any) => patient.key === 'Patient Age')?.value ?? patient.find((patient: any) => patient.key === 'Patient Age Group')?.value;
//     }
//     return 0;
//   }
//   getPatientName(patient: any): number {

//     if (patient) {
//       return patient.find((patient: any) => patient.key === 'Patient Name')?.value;
//     }
//     return 0;
//   }
//   getDoctorName(doctor: any): number {
//     if (doctor) {
//       return doctor.find((doctor: any) => doctor.key === 'Doctor Name')?.value;
//     }
//     return 0;
//   }

//   getPatientGender(patient: any): number {
//     if (patient) {
//       return patient.find((patient: any) => patient.key === 'Patient Gender')?.value;
//     }
//     return 0;
//   }
//   getPoints(obj: any): number {
//     if (obj) {
//       return obj?.result?.find((patient: any) => patient.key === 'Score')?.value;
//     }
//     return 0;
//   }

//   search() {
//     clearInterval(this.timeOutId);
//     this.timeOutId = setTimeout(() => {
//       this.adminDataService.searchLogs(this.searchQuery).subscribe(data => {
//         console.log(data);
//         this.logs = data
//       })
//     }, 1000);
//   }

//   downloadReport(calculator_name: string) {

//     console.log(this.selectedYear)
//     console.log(this.selectedMonth)

//     const org = this.user?.organization?.name
//     console.log(this.user?.organization_id)
//     console.log(org)

//     this.reportLoadingState[calculator_name] = true;
//     this.http.get(this.base_url + "/" + calculator_name + `?org=${org}&year=${this.selectedYear}&month=${this.selectedMonth}`, {
//       responseType: "blob",
//       observe: 'response',
//       headers: {
//         Accept: 'text/csv',
//       },
//     }).subscribe((value) => {
//       if (value.body) {
//         const date = new Date();
//         let day = String(date.getDate());
//         if (day.length == 1) {
//           day = "0" + day;
//         }
//         let month = String(date.getMonth() + 1);

//         if (month.length == 1) {
//           month = "0" + month;
//         }

//         let year = String(date.getFullYear());
//         saveAs(value.body, `komet-${org}-${this.selectedYear}-${this.selectedMonth}-${calculator_name}-downloaded_at-${day + month + year}.csv`);
//       }
//       else {
//         alert("No response");
//       }
//       this.reportLoadingState[calculator_name] = false;
//     }, (error) => {
//       alert("Error");
//       this.reportLoadingState[calculator_name] = false;
//     })

//   }

//   filterDateCahnge() {

//     if (this.filterFromDate && this.filterToDate) {

//     }
//     else {
//       // this.init()
//     }


//   }


//   getLabel(calc: string | undefined | null): string {
//     // If nothing is passed → show nothing or fallback
//     if (!calc || calc.trim() === '') {
//       return 'Loading...';
//     }

//     if (calc.includes('usg')) return 'USG';
//     if (calc.includes('fssg')) return 'FSSG';

//     if (calc.startsWith('copd')) {
//       const parts = calc.split('-');
//       return parts.length === 1
//         ? 'COUGH English'
//         : `COUGH ${parts.slice(1).join('-').toUpperCase().replace(/-/g, ' ')}`;
//     }

//     if (calc === 'pink-camp') return 'PINK';
//     if (calc === 'dry-eye-test') return 'DRY EYE TEST';   // optional: explicit
//     if (calc === 'gerd') return 'GERD';
//     if (calc === 'sfar-report') return 'SFAR';
//     if (calc.includes('insomnia')) return 'INSOMNIA';

//     // Default: make it readable
//     return calc
//       .toUpperCase()
//       .replace(/-/g, ' ')
//       .replace(/_/g, ' ');
//   }

// }


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';

import { AdminDataService } from '../../services/admin-data.service';
import { AuthService } from '../../services/auth.service'; // adjust path if needed

@Component({
  selector: 'app-logs',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './logs.component.html',
  styleUrls: ['./logs.component.scss']
})
export class LogsComponent {
  user: any = null;
  calcName: string = 'dry-eye-test'; // default
  base_url = 'https://kometfunction-cmndbj7gmq-uc.a.run.app';

  reportLoadingState: Record<string, boolean> = {
    'gerd-report': false,
    'sfar-report': false,
    'pink-report': false,
    'insomania-report': false,
    'insomania-hindi-report': false,
    'copd-report': false,
    'copd-bengali-report': false,
    'copd-gujrati-report': false,
    'copd-hindi-report': false,
    'copd-kannada-report': false,
    'copd-malyalam-report': false,
    'copd-marathi-report': false,
    'copd-odiya-report': false,
    'copd-punjabi-report': false,
    'copd-tamil-report': false,
    'copd-telgu-report': false,
    'saar-report': false,
  };

  isFilterDate = false;
  filterFromDate = '';
  filterToDate = '';

  patientCount = 0;
  patientCountThisMonth = 0;
  emp_count = 0;
  total_camp = 0;
  total_camp_this_month = 0;

  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth() + 1;
  yearOptions: number[] = [];
  monthOptions = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' }
  ];

  first: any = null;
  last: any = null;
  logs: any[] = [];
  disablePrev = true;
  disableNext = false;
  searchQuery = '';
  private timeOutId: any;

  constructor(
    private adminDataService: AdminDataService,
    public authService: AuthService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {
    this.authService.user.subscribe(user => this.user = user);

    const now = new Date();
    this.selectedYear = now.getFullYear();
    this.selectedMonth = now.getMonth() + 1;
    for (let y = now.getFullYear(); y >= now.getFullYear() - 10; y--) {
      this.yearOptions.push(y);
    }

    // THIS IS THE ONLY CHANGE YOU NEED HERE
    this.activatedRoute.queryParamMap.subscribe(params => {
      this.calcName = params.get('calcName') || 'dry-eye-test';
      console.log('Calculator:', this.calcName);
      this.init(); // load logs immediately
      this.isFilterDate = false;
      this.filterFromDate = '';
      this.filterToDate = '';
    });
  }

  init() {
    if (!this.calcName) {
      this.logs = [];
      return;
    }

    this.first = null;
    this.last = null;
    this.logs = [];
    this.disablePrev = true;
    this.disableNext = false;
    this.searchQuery = "";
    this.timeOutId = 0;

    this.adminDataService.getNextLogs(null, this.calcName).then((logs: any) => {
      if (logs.length > 0) {
        this.last = logs[logs.length - 1];    // whole object — correct
        this.first = logs[0];                 // whole object — correct
        this.logs = logs;
        this.disableNext = false;
      } else {
        this.disableNext = true;
      }
    });
  }

  nextPage() {
    if (!this.isFilterDate) {
      this.adminDataService.getNextLogs(this.last, this.calcName).then((logs: any) => {
        if (logs.length > 0) {
          this.last = logs[logs.length - 1];   // whole object
          this.first = logs[0];
          this.logs = logs;
          this.disablePrev = false;
        } else {
          this.disableNext = true;
        }
      });
    } else {
      this.adminDataService.getNextLogsFilterDate(this.last, this.calcName, this.filterFromDate, this.filterToDate).then((logs: any) => {
        if (logs.length > 0) {
          this.last = logs[logs.length - 1];
          this.first = logs[0];
          this.logs = logs;
          this.disablePrev = false;
        } else {
          this.disableNext = true;
        }
      });
    }
  }

  prevPage() {
    if (!this.isFilterDate) {
      this.adminDataService.getPrevLogs(this.first, this.calcName).then((logs: any) => {
        if (logs.length > 0) {
          this.last = logs[logs.length - 1];
          this.first = logs[0];
          this.logs = logs;
          this.disableNext = false;
        } else {
          this.disablePrev = true;
        }
      });
    } else {
      this.adminDataService.getPrevLogsFilterDate(this.first, this.calcName, this.filterFromDate, this.filterToDate).then((logs: any) => {
        if (logs.length > 0) {
          this.last = logs[logs.length - 1];
          this.first = logs[0];
          this.logs = logs;
          this.disableNext = false;
        } else {
          this.disablePrev = true;
        }
      });
    }
  }

  // Helper functions — now safe and correct for your Firestore format
  getDoctorName(details: any[]): string {
    return details?.find(i => i.key === 'Doctor Name')?.value ?? 'N/A';
  }

  getPatientName(details: any[]): string {
    return details?.find(i => i.key === 'Patient Name')?.value ?? 'N/A';
  }

  getPatientAge(details: any[]): string {
    return (
      details?.find(i => i.key === 'Patient Age Group')?.value ??
      details?.find(i => i.key === 'Patient Age')?.value ??
      'N/A'
    );
  }

  getPatientGender(details: any[]): string {
    return details?.find(i => i.key === 'Patient Gender')?.value ?? 'N/A';
  }

  getPoints(log: any): string {
    const osdi = log?.result?.find((i: any) => i.key === 'OSDI Score')?.value ?? 'N/A';
    const niBut = log?.result?.find((i: any) => i.key === 'NI BUT Score')?.value ?? 'N/A';
    return `OSDI: ${osdi}, NI BUT: ${niBut}`;
  }

  getResults(log: any): string {
    if (!log?.result) return 'N/A';
    const osdiResult = log.result.find((i: any) => i.key === 'OSDI Result')?.value ?? 'N/A';
    const niButResult = log.result.find((i: any) => i.key === 'NI BUT Result')?.value ?? 'N/A';
    return `OSDI: ${osdiResult}, NI BUT: ${niButResult}`;
  }

  search() {
    clearTimeout(this.timeOutId);
    this.timeOutId = setTimeout(() => {
      this.adminDataService.searchLogs(this.searchQuery).subscribe(data => {
        this.logs = data;
      });
    }, 800);
  }

  downloadReport(calc: string) {
    this.reportLoadingState[calc] = true;

    this.http
      .get(`${this.base_url}/${calc}?year=${this.selectedYear}&month=${this.selectedMonth}`, {
        responseType: 'blob',
        observe: 'response',
        headers: { Accept: 'text/csv' }
      })
      .subscribe(
        res => {
          if (res.body) {
            const d = new Date();
            const day = String(d.getDate()).padStart(2, '0');
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const year = d.getFullYear();
            saveAs(res.body, `report-${calc}-${this.selectedYear}-${this.selectedMonth}-${day}${month}${year}.csv`);
          }
          this.reportLoadingState[calc] = false;
        },
        () => {
          alert('Download failed');
          this.reportLoadingState[calc] = false;
        }
      );
  }

  getLabel(calc: string | null): string {
    if (!calc) return 'Loading...';
    if (calc === 'dry-eye-test') return 'DRY EYE TEST';
    if (calc.includes('copd')) return 'COUGH ' + calc.split('-').slice(1).join(' ').toUpperCase();
    if (calc === 'pink-camp') return 'PINK';
    return calc.toUpperCase().replace(/-/g, ' ');
  }
}