import { Injectable, Logger, PipeTransform } from '@nestjs/common';

@Injectable()
export class TrajetPipe implements PipeTransform {
  transform(value: string): string {
    new Logger('Trajet').log(`4. pipe : « ${value} » devient « ${value.toUpperCase()} »`);
    return value.toUpperCase(); // la valeur que recevra la méthode
  }
}
