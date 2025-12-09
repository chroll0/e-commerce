import { Request } from "express";
import { UserRole } from "../enums/user-role.enum";

export type JwtPayload = {
  id: number;
  email: string;
  role: UserRole;
};

export type AuthRequest = Request & { user: JwtPayload };
