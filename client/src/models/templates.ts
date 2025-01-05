export interface TemplateAccess {
  id: number;
  templates_id: number;
  user: {
    id: number;
    username: string;
    email: string;
  };
  users_id: number;
}

export interface Templates {
  id?: number | undefined;
  title: string;
  description: string;
  category: string;
  image_url: string;
  isPublic: boolean;
  tags?: string[];
  created_at: string;
  templateAccesses?: TemplateAccess[];
  hasAccess?: boolean; // Добавьте это поле
}
export interface Answer {
  answer: string;
  formId: number;
  questionsId: number;
}
