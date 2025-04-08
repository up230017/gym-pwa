import jwt from 'jsonwebtoken';
import cookie from 'cookie';

export const authMiddleware = (handler) => {
  return async (context) => {
    const { req, res } = context;
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) {
      console.log('No token found, redirecting to login');
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }

    try {
      const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
      req.user = decoded;
      return handler(context);
    } catch (error) {
      console.log('Token verification failed, redirecting to login:', error.message);
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }
  };
};