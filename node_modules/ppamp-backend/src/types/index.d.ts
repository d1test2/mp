declare module 'cors' {
  const cors: any;
  export default cors;
}

declare module 'helmet' {
  const helmet: any;
  export default helmet;
}

declare module 'morgan' {
  const morgan: any;
  export default morgan;
}

declare module 'express-rate-limit' {
  const rateLimit: any;
  export default rateLimit;
}

declare module 'jsonwebtoken' {
  const jwt: any;
  export default jwt;
}

declare module 'stripe' {
  const Stripe: any;
  export default Stripe;
}

declare module '@prisma/client' {
  const PrismaClient: any;
  export { PrismaClient };
}

declare module '@sendgrid/mail' {
  const sgMail: any;
  export default sgMail;
}

declare module 'zod' {
  const z: any;
  export { z };
}


