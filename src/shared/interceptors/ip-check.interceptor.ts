import { Injectable, NestInterceptor, ExecutionContext, CallHandler, NotAcceptableException } from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import * as sqlite3 from 'sqlite3';
import { open } from 'sqlite';

@Injectable()
export class IpCheckInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    let request = context.switchToHttp().getRequest();

    let isBlackListed = await this.isIpBlackListed(request);

    if (isBlackListed) throw new NotAcceptableException('Ip blocked!');

    return next.handle().pipe(
      tap(() => {
        let response = context.switchToHttp().getResponse();
      }),
      catchError((err) => {
        return throwError(() => err);
      })
    );
  }

  async isIpBlackListed(request): Promise<boolean> {
    let reqIp = request['x-forwarded-for'] ?? request.connection.remoteAddress ?? request.ip;

    const db = await open({
      filename: 'blacklisted.db',
      driver: sqlite3.Database
    });
    let data = await db.all('SELECT * FROM blacklisted_ips');

    let matchedData = data.find((d) => d.IP == reqIp);

    if (matchedData) return true;
    return false;
  }
}
