import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import * as fs from 'fs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    let request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap(() => {
        let response = context.switchToHttp().getResponse();
        
        // [TIMESTAMP] METHOD ENDPOINT BODY STATUS IP
        let line = `[${new Date().toISOString()}] ${request.method} ${request.originalUrl} ${JSON.stringify(
          request.body
        )} ${response.statusCode} ${request['x-forwarded-for'] ?? request.connection.remoteAddress ?? request.ip}\n`;

        fs.appendFile('logger.txt', line, function (err) {
          if (err) throw err;
        });
      })
    );
  }
}
