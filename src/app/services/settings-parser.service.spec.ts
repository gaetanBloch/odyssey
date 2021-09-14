import { TestBed } from '@angular/core/testing';

import { SettingsParserService } from './settings-parser.service';

describe('SettingsParserService', () => {
  let service: SettingsParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SettingsParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
