import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RequestUserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): number => {
    const req = ctx.switchToHttp().getRequest();
    const raw = req.headers['x-user-id'];
    const parsed = Number(raw);
    return Number.isFinite(parsed) ? parsed : 0;
  },
);
