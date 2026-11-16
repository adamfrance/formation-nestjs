// Une leçon d'un cours
export interface Lesson {
  id: string;
  courseId: string; // le cours auquel elle appartient
  title: string;
  content: string;
  position: number; // son rang dans le cours : 1, 2, 3…
}
