import { HttpStatus } from "@nestjs/common";

export class BaseApiError {
  code: string;
  status: HttpStatus;
  message?: string;
  data?: object;

  constructor(code: string, status: HttpStatus, message?: string, data?: object) {
    this.code = code;
    this.status = status;
    this.message = message;
    this.data = data || {};
  }
}
