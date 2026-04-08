// /studentSearch-store/studentSearchTypes.ts

export interface StudentSearchResult {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    phone_number?: string;
}

export interface StudentSearchState {
    loading: boolean;
    error: string | null;
    student: StudentSearchResult | null;
}