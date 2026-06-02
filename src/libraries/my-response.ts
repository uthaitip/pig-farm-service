import { HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export default class MyResponse {
  private static initDefault: object = {
    status: null,
    message: null,
    data: null,
    errors: null,
  };

  static sendOk(res: Response, body: any = null) {
    return res.status(HttpStatus.OK).json({
      ...MyResponse.initDefault,
      status: 200,
      message: 'ok',
      data: body,
    });
  }

  static sendPdf(res: Response, buffer: Buffer, options: { name: string }) {
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `inline; filename="${options.name}"`,
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }
}
