import type { ClassItem } from "@/redux/types";

export interface CreateClassState {
    loading: boolean;
    error: string | null;
    success: boolean;
    createdClass: ClassItem | null;
}
