import 'next-auth';

declare module 'next-auth' {
  interface User {
    id: string;
    name: string;
    email: string;
    role: 'doctor' | 'receptionist';
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      role: 'doctor' | 'receptionist';
    };
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: 'doctor' | 'receptionist';
  }
}
