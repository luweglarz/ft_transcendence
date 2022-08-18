import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtData, JwtPayload } from '../modules/jwt/interfaces';

/*
 * @brief extract request.user and use it as a parameter in a controller.
 * @usage if your route is protected by a guard:
 *        routeHandler(@User user: JwtPayload) { ... }
 */
export const User = createParamDecorator(
  (_: unknown, ctx: ExecutionContext) => {
    const user = ctx.switchToHttp().getRequest().user as JwtData;
    // Filter iat and exp of the token
    const filteredUser: JwtPayload = { sub: user.sub, username: user.username };
    return filteredUser;
  },
);
