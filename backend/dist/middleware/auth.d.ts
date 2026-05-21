import { NextFunction, Request, Response } from 'express';
import { IUser } from '../models/User';
export interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        role: IUser['role'];
    };
}
export declare const authenticate: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const requireAdmin: (req: AuthenticatedRequest, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
//# sourceMappingURL=auth.d.ts.map