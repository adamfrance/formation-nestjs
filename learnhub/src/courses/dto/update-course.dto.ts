import { PartialType } from '@nestjs/swagger';
import { CreateCourseDto } from './create-course.dto.js';

// Les mêmes champs et les mêmes règles que la création, tous devenus facultatifs
export class UpdateCourseDto extends PartialType(CreateCourseDto) {}
