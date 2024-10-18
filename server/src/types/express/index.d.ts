// types/express/index.d.ts
import { Request } from "express";

// 定义用户接口
interface UserPayload {
  id: string;
  // 添加其他你需要的用户属性
  email?: string;
  role?: string;
}

// 扩展 Express 的 Request 类型
declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
    }
  }
}
