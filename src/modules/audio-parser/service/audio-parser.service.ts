import { Injectable } from '@nestjs/common';
import { ParseAudioResponseDTO } from '../dto/parse-audio-response.dto';
import { BIT_RATE_MASK, BIT_RATES, PADDING_BIT_MASK, SAMPLE_RATE_MASK, SAMPLE_RATES, SYNC_WORD_BYTE, SYNC_WORD_MASK } from "../constant/audio-parser.constant";

@Injectable()
export class AudioParserService {
  parseAudio(buffer: Buffer): ParseAudioResponseDTO {
    const bufferLength = buffer.length;
    let offset = 0;
    let frameCount = 0;
    // An MP3 frame header is 4 bytes long (32 bits) and contains various 
    //fields that describe the properties of the frame, such as the sync word, 
    //MPEG version, layer, bitrate, sampling rate, etc.
    while (offset < bufferLength) {
      if (bufferLength - offset < 4) break;

      // in mp3 format each frame start with sync word , sync words found in first 11 bits of header
      if (this.isSyncWord(buffer, offset)) {
        const frameLength = this.calculateFrameLength(buffer, offset);
        if (frameLength === 0) break;

        frameCount++;
        offset += frameLength;
      } else {
        offset++;
      }
    }
    return {frameCount};
  }

  private calculateFrameLength(buffer: Buffer, offset: number): number {
    // here we are extracting others values from header which is required to calculate frame Length
    // In second Byte of header we can get these values by masking and shifting values towards right
    const bitRateIndex = (buffer[offset + 2] & BIT_RATE_MASK) >> 4;
    const sampleRateIndex = (buffer[offset + 2] & SAMPLE_RATE_MASK) >> 2;
    const paddingBit = (buffer[offset + 2] & PADDING_BIT_MASK) >> 1;

    const bitRate = this.getBitRate(bitRateIndex);
    const sampleRate = this.getSampleRate(sampleRateIndex);

    if (bitRate === 0 || sampleRate === undefined) return 0;
    // this formula is used for calculating MP3 frame length for MPEG version 1 and layer III 
    return Math.floor((144 * bitRate) / sampleRate + paddingBit);
  }

  private getBitRate(bitRateIndex: number): number {
    // In Mp3 bitRate not stored as plain number it saves index of predefined bit rates 
    // after getting bit rates we need to convert this form kbps to bps, as frame length formula requires 
    return BIT_RATES[bitRateIndex] * 1000;
  }

  private getSampleRate(sampleRateIndex: number): number | undefined {
    // same as bitRate instead of saving value in hz it just store the index of standardized sampling rates
    return SAMPLE_RATES[sampleRateIndex];
  }

  private isSyncWord(buffer: Buffer, offset: number): boolean {
    // first byte should equal to `0xFF` (in binary , 11111111), first 3 bits of second byte should also 111
    // (buffer[offset + 1] & 0xe0) here mask all bits other than first 3 and it should equal to 0xe0 (11100000) 
    return buffer[offset] === SYNC_WORD_BYTE && (buffer[offset + 1] & SYNC_WORD_MASK) === SYNC_WORD_MASK;
  }

}
