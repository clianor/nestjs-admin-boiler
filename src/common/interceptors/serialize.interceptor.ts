import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';

import { ClassConstructor, instanceToPlain, plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

export class SerializeInterceptor<T> implements NestInterceptor {
  constructor(private dto: ClassConstructor<T>) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<T> | Promise<Observable<T>> {
    return next.handle().pipe(
      map((data: T) => {
        return instanceToPlain(
          plainToClass(this.dto, data, { excludeExtraneousValues: true }),
        ) as T;
      }),
    );
  }
}
