import { Module } from '@nestjs/common';
import { SambaNovaService } from './application/samba-nova.service';
import { SambaNovaModelProvider } from './application/samba-nova.provider';

@Module({
  providers: [SambaNovaService, SambaNovaModelProvider],
  exports: [SambaNovaService],
})
export class SambaNovaModule {}
