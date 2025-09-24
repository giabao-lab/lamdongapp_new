import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response<ApiResponse<null>>,
  next: NextFunction
): void => {
  console.error('Error:', error);

  // Default error response
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle different types of errors
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid data format';
  } else if (error.code === 11000) { // MongoDB duplicate key error
    statusCode = 409;
    message = 'Resource already exists';
  } else if (error.statusCode) {
    statusCode = error.statusCode;
    message = error.message;
  } else if (error.message) {
    message = error.message;
  }

  res.status(statusCode).json({
    success: false,
    message,
    error: process.env.NODE_ENV === 'development' ? error.stack : undefined
  });
};

export const notFound = (req: Request, res: Response<ApiResponse<null>>): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  });
};