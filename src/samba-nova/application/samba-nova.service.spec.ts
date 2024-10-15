import { Test, TestingModule } from '@nestjs/testing';
import { SambaNovaService } from './samba-nova.service';

describe('SambaNovaService', () => {
  let service: SambaNovaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SambaNovaService],
    }).compile();

    service = module.get<SambaNovaService>(SambaNovaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
