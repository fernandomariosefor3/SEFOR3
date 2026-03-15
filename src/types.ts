export interface School {
  id: string;
  name: string;
  inep?: string;
  address?: string;
}

export interface FrequencyRecord {
  id: string;
  schoolId: string;
  date: string;
  present: number;
  absent: number;
  notes?: string;
}

export interface EvaluationRecord {
  id: string;
  schoolId: string;
  studentName: string;
  subject: string;
  grade: number;
  date: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  status: 'planejado' | 'em-execucao' | 'concluido';
  startDate: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  location: string;
  description: string;
}

export interface AppData {
  schools: School[];
  freqRec: FrequencyRecord[];
  avalRec: EvaluationRecord[];
  projList: Project[];
  evtList: CalendarEvent[];
  savedAt?: string;
}
