import { Module } from '@nestjs/common';
import { CountryModule } from './country/country.module';
import { IndexModule } from './index/index.module';

@Module({
  imports: [IndexModule, CountryModule],
  controllers: [],
  providers: []
})
export class AppModule {}
