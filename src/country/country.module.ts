import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { CountryController } from './controllers/country.controller';
import { CountryService } from './service/country.service';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10
    })
  ],
  controllers: [CountryController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },
    CountryService
  ]
})
export class CountryModule {}
