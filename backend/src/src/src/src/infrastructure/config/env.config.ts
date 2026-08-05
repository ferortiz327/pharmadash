import dotenv from 'dotenv';
dotenv.config();

export class EnvConfig {
  static get(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error('Environment variable ' + key + ' not defined');
    }
    return value;
  }

  static getNumber(key: string): number {
    const value = parseInt(this.get(key));
    if (isNaN(value)) {
      throw new Error(key + ' must be a number');
    }
    return value;
  }

  static getBoolean(key: string): boolean {
    return this.get(key).toLowerCase() === 'true';
  }

  static getOrDefault(key: string, defaultValue: string): string {
    return process.env[key] || defaultValue;
  }

  static getNodeEnv(): 'development' | 'production' | 'test' {
    const env = this.getOrDefault('NODE_ENV', 'development');
    if (!['development', 'production', 'test'].includes(env)) {
      throw new Error('NODE_ENV must be development, production or test');
    }
    return env as 'development' | 'production' | 'test';
  }

  static isDevelopment(): boolean {
    return this.getNodeEnv() === 'development';
  }

  static isProduction(): boolean {
    return this.getNodeEnv() === 'production';
  }

  static isTest(): boolean {
    return this.getNodeEnv() === 'test';
  }
}
