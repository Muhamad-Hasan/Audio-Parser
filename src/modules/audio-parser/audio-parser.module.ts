import { Module } from '@nestjs/common';
import { AudioParserService } from './service/audio-parser.service';
import { AudioParserController } from './controller/audio-parser.controller';

@Module({
  controllers: [AudioParserController],
  providers: [AudioParserService],
})
export class AudioParserModule {}
