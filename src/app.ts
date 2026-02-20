import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';
import { Prisma } from '@prisma/client';
import { customerSatisfactionsRouter } from './modules/customer-satisfactions';
import { kpisRouter } from './modules/kpis';
import { revenuesRouter } from './modules/revenues';
import { salesMapsRouter } from './modules/sales-maps';
import { targetRealitiesRouter } from './modules/target-realities';
import { topProductsRouter } from './modules/top-products';
import { visitorInsightsRouter } from './modules/visitor-insights';
import { volumeServicesRouter } from './modules/volume-services';


dotenv.config();

const app = express();

//  || `http://localhost:${process.env.PORT || 3000}`;

app.use(cors(
  {
    origin: process.env.APP_URL,
    credentials: true,
  }
));

app.use(
  express.json({
    verify: (req, _res, buf) => {
      (req as any).rawBody = buf.toString('utf-8');
    },
  })
);
app.use(express.urlencoded({ extended: true }));




app.use('/docs.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.use('/volume-services', volumeServicesRouter);
app.use('/customer-satisfactions', customerSatisfactionsRouter);
app.use('/kpis', kpisRouter);
app.use('/target-realities', targetRealitiesRouter);
app.use('/revenues', revenuesRouter);
app.use('/visitor-insights', visitorInsightsRouter);
app.use('/top-products', topProductsRouter);
app.use('/sales-maps', salesMapsRouter);

app.use('/', swaggerUi.serve, swaggerUi.setup(undefined, { swaggerUrl: '/docs.json' }));

// Global error handler (must be last)
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err);

  // Handle JSON parse errors from express.json()
  // (bad JSON body should be a 400, not a 500)
  if (err instanceof SyntaxError && (err as any).type === 'entity.parse.failed') {
    return res.status(400).json({
      message: 'Invalid JSON payload',
      error: err.message,
    });
  }

  // Handle Prisma client-side validation errors (missing required fields, unknown fields, wrong types)
  // These are caused by invalid request bodies and should return 400/422, not 500.
  // if (err instanceof Prisma.PrismaClientValidationError) {
  //   return res.status(400).json({
  //     message: 'Validation error',
  //     error: err.message,
  //   });
  // }

  // Handle Prisma errors
  if (err.code) {
    // Foreign key constraint violation
    if (err.code === 'P2003') {
      return res.status(400).json({
        message: 'Invalid reference: The referenced resource does not exist',
        error: 'Foreign key constraint failed',
      });
    }
    // Unique constraint violation
    if (err.code === 'P2002') {
      const field = err.meta?.target?.[0] || 'field';
      return res.status(409).json({
        message: `A record with this ${field} already exists`,
        error: 'Unique constraint failed',
      });
    }
    // Record not found
    if (err.code === 'P2025') {
      return res.status(404).json({
        message: 'Resource not found',
        error: 'Record does not exist',
      });
    }
    // Invalid input
    if (err.code === 'P2000') {
      return res.status(400).json({
        message: 'Invalid input: Value is too long for the field',
        error: 'Input validation failed',
      });
    }
    // Missing required value
    if (err.code === 'P2012') {
      return res.status(400).json({
        message: 'Validation error',
        error: err.message,
      });
    }
    // Invalid value
    if (err.code === 'P2009') {
      return res.status(400).json({
        message: 'Validation error',
        error: err.message,
      });
    }
  }

  // Handle validation errors (from Zod, Joi, etc.)
  if (err.name === 'ValidationError' || err.name === 'ZodError') {
    return res.status(400).json({
      message: 'Validation error',
      error: err.errors || err.message,
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Authentication failed',
      error: err.message,
    });
  }

  // Handle custom errors with statusCode
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      message: err.message || 'An error occurred',
      error: err.error || err.message,
    });
  }

  // Default 500 error
  return res.status(500).json({
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
  });
});

export default app;