
export interface Course {
  id: string;
  title: string;
  price: number;
  free: boolean;
  description: string;
  details: string;
  modules: string[];
  cert: string;
  icon: string;
}

export interface User {
  name: string;
  email: string;
  password?: string;
  progress: number;
  enrolledCourses: string[];
}

export enum ModalType {
  NONE,
  AUTH,
  COURSE_DETAILS,
  PAYMENT,
  DASHBOARD
}
