import { NextResponse } from 'next/server';

export const ok = (data: unknown, status = 200) =>
  NextResponse.json(
    {
      success: true,
      ...(typeof data === 'object' && data !== null ? data : { data }),
    },
    { status }
  );

export const created = (data: unknown) => ok(data, 201);

export const err = (message: string, status = 400) =>
  NextResponse.json({ success: false, message }, { status });

export const unauthorized = () => err('Unauthorized', 401);
export const notFound = (msg = 'Not found') => err(msg, 404);
export const serverError = () => err('Internal server error', 500);
