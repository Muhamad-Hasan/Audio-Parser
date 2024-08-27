import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { AudioParserService } from '../service/audio-parser.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ParseAudioResponseDTO } from '../dto/parse-audio-response.dto';

@Controller('audio-parser')
export class AudioParserController {
  constructor(private readonly audioParserService: AudioParserService) {}

  @Post("/file-upload")
  @UseInterceptors(FileInterceptor('file'))
  async createFile(@UploadedFile() file: Express.Multer.File): Promise<ParseAudioResponseDTO>{
    const response = this.audioParserService.parseAudio(file.buffer)
    return response;
  }
}
