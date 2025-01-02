export interface Questions {
  id: number;
  title: string;
  description: string;
  order?: string;
  type: string;
  showInResults?: string;
  correct_answer: string | number;
}
