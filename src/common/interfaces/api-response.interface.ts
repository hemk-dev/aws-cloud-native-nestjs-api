export interface IApiResponse<T> {
  success: boolean;
  statusCode: number;
  message: string;
  data?: T;
  error?: string | object;
  timestamp: string;
  path: string;
}
