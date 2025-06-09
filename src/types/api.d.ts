interface ApiResponseData<T> {
  code: number;
  msg: string;
  data: T;
}