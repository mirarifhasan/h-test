import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as fs from 'fs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        let response = context.switchToHttp().getResponse();

        this.writeInLogFile(
          new Date().toISOString(),
          request.method,
          request.originalUrl,
          JSON.stringify(request.body),
          response.statusCode,
          request['x-forwarded-for'] ?? request.connection.remoteAddress ?? request.ip
        );
      }),
      catchError((err) => {
        this.writeInLogFile(
          new Date().toISOString(),
          request.method,
          request.originalUrl,
          JSON.stringify(request.body),
          err.status,
          request['x-forwarded-for'] ?? request.connection.remoteAddress ?? request.ip
        );

        return throwError(() => err);
      })
    );
  }

  async writeInLogFile(timestamp, method, endpoint, body, status, ip) {
    let line = `[${timestamp}] ${method} ${endpoint} ${body} ${status} ${ip}\n`;
    fs.appendFile('logger.txt', line, function (err) {
      if (err) throw err;
    });
  }
}
