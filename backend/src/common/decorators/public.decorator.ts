import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/** Skip JWT guard for login, webhooks, or public endpoints */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
