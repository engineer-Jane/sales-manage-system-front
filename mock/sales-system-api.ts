import type { Request, Response } from 'express';
import { SALES_API_MOCK_BODY } from '../src/mock/apiHandlers';

/** Umi dev Mock：与客户端共用 SALES_API_MOCK_BODY */
export default Object.fromEntries(
  Object.entries(SALES_API_MOCK_BODY).map(([routeKey, body]) => [
    routeKey,
    (_req: Request, res: Response) => {
      res.json(body);
    },
  ]),
);
