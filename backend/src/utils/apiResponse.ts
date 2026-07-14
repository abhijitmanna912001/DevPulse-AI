import type { ApiErrorResponse, ApiSuccessResponse } from '../types/api.js';

export function successResponse<TData, TMeta = unknown>(
  data: TData,
  meta?: TMeta,
): ApiSuccessResponse<TData, TMeta> {
  return meta === undefined ? { success: true, data } : { success: true, data, meta };
}

export function errorResponse<TDetails = unknown>(
  code: string,
  message: string,
  details?: TDetails,
): ApiErrorResponse<TDetails> {
  return details === undefined
    ? { success: false, error: { code, message } }
    : { success: false, error: { code, message, details } };
}
