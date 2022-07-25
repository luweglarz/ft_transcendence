import { createParamDecorator, ExecutionContext } from '@nestjs/common';

/*
 * @brief extract request.user and use it as a parameter in a controller.
 * @usage if your route is protected by a JwtGuard:
 *        routeHandler(@User user: JwtPayload) { ... }
 */
export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
