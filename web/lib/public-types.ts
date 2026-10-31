import type { ReportDetail, ReportListItem } from "./report-shape";

export type ContactRow = {
  id: string;
  createdAt: number;
  name: string;
  email: string;
  message: string;
};

export type DemoRow = {
  id: string;
  createdAt: number;
  name: string;
  email: string;
  organisation: string;
  organisationType: string;
  organisationSize: string;
  role: string;
  phone: string;
  message: string;
};

export type Overview = {
  ok: true;
  liveError: boolean;
  stats: {
    reports: number;
    newThisWeek: number;
    contacts: number | null;
    demos: number | null;
  };
  reports: ReportListItem[];
  contacts: ContactRow[] | null;
  demos: DemoRow[] | null;
};

export type DetailResponse = {
  ok: true;
  report: ReportDetail;
};
