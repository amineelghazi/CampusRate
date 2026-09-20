import { Injectable, InternalServerErrorException, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

@Injectable()
export class JsonStorageService implements OnModuleInit {
  private path: string;

  constructor(config: ConfigService) {
    this.path = config.getOrThrow<string>('DATA_FILE_PATH');
  }

  async onModuleInit() {
    if (!existsSync(this.path)) {
      await this.write({ places: [], reviews: [] });
    }
  }

  async read() {
    try {
      return JSON.parse(await readFile(this.path, 'utf8'));
    } catch {
      throw new InternalServerErrorException('Data file is corrupted or unreadable');
    }
  }

  async write(data: object) {
    await mkdir(dirname(this.path), { recursive: true });
    await writeFile(this.path, JSON.stringify(data, null, 2));
  }
}