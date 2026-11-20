import { plainToInstance } from 'class-transformer';
import { IsIn, IsInt, IsNotEmpty, IsString, Max, Min, MinLength, validateSync } from 'class-validator';

// Les variables d'environnement attendues par LearnHub, avec leurs règles
class EnvironmentVariables {
  @IsIn(['development', 'production', 'test'])
  NODE_ENV: string = 'development'; // valeur par défaut si la variable manque

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number = 3010;

  @IsString()
  @IsNotEmpty()
  DB_HOST: string;

  @IsInt()
  DB_PORT: number;

  @IsString()
  @IsNotEmpty()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  @IsNotEmpty()
  DB_NAME: string;

  @IsString()
  @MinLength(32) // un secret court se devine : 32 caractères au moins
  JWT_SECRET: string;
}

// Appelée par ConfigModule au démarrage : refuse de démarrer si une variable manque ou est fausse
export function validate(config: Record<string, unknown>) {
  const env = plainToInstance(EnvironmentVariables, config, { enableImplicitConversion: true }); // "3010" devient 3010
  const errors = validateSync(env);
  if (errors.length > 0) {
    const details = errors.map((e) => Object.values(e.constraints ?? {}).join(', ')).join('\n- ');
    throw new Error(`Configuration invalide :\n- ${details}`);
  }
  return env;
}
