import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

// @Public() : une étiquette sur une route ; le guard JWT la lit et laisse passer sans jeton
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
