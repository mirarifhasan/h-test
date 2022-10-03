import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@Controller()
@ApiTags('Health')
export class IndexController {
  @Get()
  index() {
    return {
      app: 'Hoppscotch application is running...',
      api_doc_path: '/docs'
    };
  }
}
