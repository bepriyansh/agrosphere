export interface JoiErrorDetail {
    message: string;
    path: (string | number)[];
    type: string;
    context?: any;
}