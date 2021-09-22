import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { validate } from 'class-validator';
import { classToPlain, plainToClass } from 'class-transformer';

interface Type<T = any> extends Function {
    new(...args: any[]): T;
}

@Injectable()
export class PageQueryPipe<T> implements PipeTransform<T> {

    async transform(value: any, { metatype }: ArgumentMetadata) {

        if (!metatype) return value;

        let object = plainToClass(metatype, value, { enableImplicitConversion: true });
        object = this.excludeExtraFields(metatype, object);

        const errors = await validate(object);

        if (errors.length > 0) {
            const errData = errors.reduce((prev, e) => {
                Object.values(e.constraints).forEach(message => {
                    prev.push(message);
                })
                return prev;
            }, [] as string[])
            throw new BadRequestException(errData);
        }
        return classToPlain(object);
    }

    private excludeExtraFields(metatype: Type<any>, object: any) {
        const obj = new metatype();
        Object.keys(obj).forEach(key => {
            obj[key] = object[key]
        })
        return obj;
    }

}