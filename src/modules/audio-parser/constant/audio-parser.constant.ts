export const BIT_RATES = [
    0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320,
  ];
  
export const SAMPLE_RATES = [44100, 48000, 32000];

// Bitwise masks
export const BIT_RATE_MASK = 0xf0;
export const SAMPLE_RATE_MASK = 0x0c;
export const PADDING_BIT_MASK = 0x02;
export const SYNC_WORD_MASK = 0xe0;
export const SYNC_WORD_BYTE = 0xff;



// Define bit rate and sample rate tables based on MPEG version 1, Layer III
        
