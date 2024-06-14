import { SetMetadata } from '@nestjs/common';
/**
 * 标记为公开接口
 */
export const IS_PUBLIC_KEY = 'isPublic';

/**
 * 公开接口
 * @returns {Function}
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
