export enum Priority {
  Low = 0,
  Medium = 1,
  High = 2
}

export enum IssueType {
  Feature = 0,
  Bug = 1,
  Documentation = 2
}

export interface IssueModel {
  id: number;
  title: string;
  description: string;
  priority: Priority;
  type: IssueType;
  created: Date;
  completed?: Date;
}
