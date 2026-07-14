export type ApiSuccessResponse<TData = unknown, TMeta = unknown> = {
  success: true;
  data: TData;
  meta?: TMeta;
};

export type ApiErrorResponse<TDetails = unknown> = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: TDetails;
  };
};
