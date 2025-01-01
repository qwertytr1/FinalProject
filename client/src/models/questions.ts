export interface Questions {
  id: number;
  title: string;
  description: string;
  order?: string;
  type: string;
  showInResults?: string;
  correctAnswer: string | number;
}
