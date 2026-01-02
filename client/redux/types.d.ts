export interface User {
  _id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone_number?: string;
  role?: string; // ileride backend’den role gelirse
}
/* Sınıf (Class) */
export interface ClassItem {
  _id: string;
  name: string;
  teacher?: User | string | null; // populate edilmişse User, değilse id string
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  // ek alanlar varsa ekle
}

/* Student (kayıtlı kullanıcı) */
export interface StudentItem {
  _id: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  // varsa diğer student alanları
}

/* StudentClasses endpoint çıktısı (list-by-class) */
/* Bu obje genelde ilişki (mapping) dokümanı döner: { _id, student: {..}, class: {...} } */
export interface StudentClassRecord {
  _id: string;
  student: StudentItem;
  class?: Partial<ClassItem> | string;
}

/* Assignment (Ödev) */
export interface AssignmentItem {
  _id: string;
  title: string;
  description?: string;
  class?: Partial<ClassItem> | string;
  teacher?: Partial<User> | string;
  due_date?: string | null;
  questions: Question[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

/* Eğer ileride soru/option getireceksen: */
export interface OptionItem {
  _id: string;
  text: string;
  is_correct?: boolean;
  image?: string | null;
}
export interface CategoryItem {
  _id: string;
  name: string;
}
export interface QuestionItem {
  _id: string;
  text: string;
  category?: string | CategoryItem;
  image?: string | null;
  difficulty?: string;
  // vb.
  options?: OptionItem[];
}

/* ClassDetail Redux state */
export interface ClassDetailState {
  info: ClassItem | null;
  students: StudentClassRecord[]; // veya StudentItem[]'e dönüştürebilirsin
  assignments: AssignmentItem[];
  loading: boolean;
  error: string | null;
}