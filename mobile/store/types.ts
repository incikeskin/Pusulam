export interface User {
    email: string;
    password?: string; // backend'den password gelmeyecek, isteğe bağlı
    is_active?: boolean;
    first_name?: string;
    last_name?: string;
    phone_number?: string;
    _id?: string; // MongoDB idsi
}