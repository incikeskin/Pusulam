import type { ClassItem } from "@/store/types";

export interface CreateClassState {
    loading: boolean;
    error: string | null;
    success: boolean;
    createdClass: ClassItem | null;
}