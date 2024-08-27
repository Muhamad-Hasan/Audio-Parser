import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AudioParserModule } from './modules/audio-parser/audio-parser.module';

@Module({
  imports: [AudioParserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
