import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { AdminDataService } from '../services/admin-data.service';

@Component({
  selector: 'app-camp-report-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './camp-report-list.component.html',
  styleUrl: './camp-report-list.component.scss'
})
export class CampReportListComponent implements OnInit {
  organizations: Array<{ id: string; name?: string; calculators?: string[] }> = [];
  expanded: Record<string, boolean> = {};
  base_url: string = "https://kometfunction-cmndbj7gmq-uc.a.run.app";

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

  selectedYearByKey: Record<string, number> = {};
  selectedMonthByKey: Record<string, number> = {};
  loadingByKey: Record<string, boolean> = {};

  constructor(private adminDataService: AdminDataService, private http: HttpClient) {}

  ngOnInit(): void {
    const now = new Date();
    const currentYear = now.getFullYear();
    for (let y = currentYear; y >= currentYear - 10; y--) {
      this.yearOptions.push(y);
    }

    this.adminDataService.getOrganizations().subscribe((orgs: any[]) => {
      this.organizations = (orgs || []).sort((a, b) => (a?.name || '').localeCompare(b?.name || ''));
      // Initialize defaults per calculator row
      const currentMonth = now.getMonth() + 1;
      for (const org of this.organizations) {
        const cals: string[] = org?.calculators || [];
        for (const calc of cals) {
          const key = this.rowKey(org.id, calc);
          if (this.selectedYearByKey[key] == null) this.selectedYearByKey[key] = currentYear;
          if (this.selectedMonthByKey[key] == null) this.selectedMonthByKey[key] = currentMonth;
          if (this.loadingByKey[key] == null) this.loadingByKey[key] = false;
        }
      }
    });
  }

  toggle(orgId: string): void {
    this.expanded[orgId] = !this.expanded[orgId];
  }

  formatCalculator(calc: string): string {
    if (!calc) return '';
    return calc.replace(/-/g, ' ').toUpperCase();
  }

  rowKey(orgId: string, calc: string): string {
    return `${orgId}::${calc}`;
  }

  onYearChange(orgId: string, calc: string, year: number) {
    this.selectedYearByKey[this.rowKey(orgId, calc)] = year;
  }

  onMonthChange(orgId: string, calc: string, month: number) {
    this.selectedMonthByKey[this.rowKey(orgId, calc)] = Number(month);
  }

  download(org: { id: string; name?: string }, calc: string) {
    const key = this.rowKey(org.id, calc);
    const selectedYear = this.selectedYearByKey[key];
    const selectedMonth = this.selectedMonthByKey[key];
    const orgName = org?.name || org.id;

    this.loadingByKey[key] = true;
    this.http.get(this.base_url + "/camp-report" + `?calculator=${encodeURIComponent(calc)}&org=${encodeURIComponent(orgName)}&year=${selectedYear}&month=${selectedMonth}`,
      {
        responseType: 'blob',
        observe: 'response' as const,
        headers: { Accept: 'text/csv' },
      }
    ).subscribe((resp) => {
      const body = resp.body;
      if (body) {
        const date = new Date();
        let day = String(date.getDate());
        if (day.length === 1) day = '0' + day;
        let month = String(date.getMonth() + 1);
        if (month.length === 1) month = '0' + month;
        const year = String(date.getFullYear());
        saveAs(body, `komet-${orgName}-${selectedYear}-${selectedMonth}-${calc}-downloaded_at-${day + month + year}.csv`);
      } else {
        alert('No response');
      }
      this.loadingByKey[key] = false;
    }, () => {
      alert('Error');
      this.loadingByKey[key] = false;
    });
  }
}
