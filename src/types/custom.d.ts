// src/types/custom.d.ts

import { User } from '@prisma/client'; // Import your User model

declare global {
  namespace Express {
    interface Request {
      user?: User; // Add the 'user' property to the Request object
    }
  }
}

// src/types/custom.d.ts (or a new file)
export interface JwtPayload {
    email: string;
    password: string;
    username: string;
    id: number;
  }
  