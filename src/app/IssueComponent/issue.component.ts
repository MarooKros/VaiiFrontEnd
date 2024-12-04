import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { IssueService } from '../Services/issue.service';
import { IssueModel, IssueType, Priority } from '../Models/IssueModel';

@Component({
  selector: 'app-issue',
  standalone: true,
  imports: [
    RouterModule,
    CommonModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    IssueService
  ],
  templateUrl: './issue.component.html',
  styleUrls: ['./issue.component.scss']
})
export class IssueComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  issue: IssueModel = {
    id: 0,
    title: '',
    description: '',
    priority: Priority.Low,
    type: IssueType.Feature,
    created: new Date()
  };
  issues: IssueModel[] = [];
  selectedIssueId: number | null = null;
  showCreateIssuePopup: boolean = false;
  showEditIssuePopup: boolean = false;
  editTitle: string = '';
  editDescription: string = '';
  selectedIssue: IssueModel | null = null;
  newIssue: IssueModel = {
    id: 0,
    title: '',
    description: '',
    priority: Priority.Low,
    type: IssueType.Feature,
    created: new Date()
  };

  Priority = Priority;
  IssueType = IssueType;

  constructor(private issueService: IssueService) {}

  ngOnInit(): void {
    this.loadIssues();
  }

  loadIssues(): void {
    this.issueService.getIssues().subscribe(issues => {
      this.issues = issues;
    });
  }

  selectIssue(issue: IssueModel): void {
    this.selectedIssueId = issue.id;
    this.selectedIssue = issue;
  }

  deleteIssue(): void {
    if (this.selectedIssueId !== null) {
      this.issueService.deleteIssue(this.selectedIssueId).subscribe(() => {
        this.issues = this.issues.filter(issue => issue.id !== this.selectedIssueId);
        this.selectedIssueId = null;
        this.selectedIssue = null;
        this.loadIssues();
      });
    }
  }

  saveIssue() {
    if (this.selectedIssue) {
      this.selectedIssue.title = this.editTitle;
      this.selectedIssue.description = this.editDescription;
      this.issueService.updateIssue(this.selectedIssue.id, this.selectedIssue).subscribe(() => {
        this.closeEditIssuePopup();
        this.loadIssues();
      });
    }
  }

  createIssue() {
    this.newIssue.created = new Date();
    this.issueService.createIssue(this.newIssue).subscribe(() => {
      this.closeCreateIssuePopup();
      this.loadIssues();
    });
  }

  onIssueCreated(): void {
    this.loadIssues();
    this.closeCreateIssuePopup();
  }

  openCreateIssuePopup() {
    this.newIssue = {
      id: 0,
      title: '',
      description: '',
      priority: Priority.Low,
      type: IssueType.Feature,
      created: new Date()
    };
    this.showCreateIssuePopup = true;
    this.showEditIssuePopup = false;
  }

  closeCreateIssuePopup() {
    this.showCreateIssuePopup = false;
  }

  closeEditIssuePopup() {
    this.showEditIssuePopup = false;
  }

  openEditIssuePopup() {
    if (this.selectedIssue) {
      this.editTitle = this.selectedIssue.title;
      this.editDescription = this.selectedIssue.description;
      this.showEditIssuePopup = true;
      this.showCreateIssuePopup = false;
    }
  }
}
