export interface Templates {
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  isPublic: boolean;
  tags?: string;
}
export interface Answer {
  answer: string;
  formId: number;
  questionsId: number;
}
