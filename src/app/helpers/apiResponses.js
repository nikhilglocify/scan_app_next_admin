import { NextResponse } from "next/server";


export async function successResponseWithMessage(res, status, statusCode,message) {
  return res.json(
    {
      status: true,
      statusCode: 200,
      message,
    },
    {
      status: 200,
    }
  );
}

export async function errorResponseWithMessage(res, status, statusCode,message) {
  return res.json(
    {
      status: false,
      statusCode: 400,
      message,
    },
    {
      status: 400,
    }
  );
}

export async function successResponseWithData(
  res,
  message,
  data = {}
) {
  const response = NextResponse.json({
    message,
    statusCode: 200,
    success: true,
    data,
  });

  response.headers.set('Cache-Control', 'no-store'); // Set header using NextResponse

  return response;
}



export async function unauthorizedError(res, message) {
  return res.json(
    {
      message,
      statusCode: 401,
      success:false,
      
    },
    {
      status: 401,
    }
  );
}

export async function badRequest(res, message,errors) {
  return res.json(
    {
      message,
      statusCode: 400,
      success:false,
      errors
    },
    {
      status: 400,
    }
  );
}

export async function serverError(res, message) {
  message = message ? message : "INTERNAL SERVER ERROR"
  return res.json(
    {
      message,
      status: 500,
    },
    {
      status: 500,
    }
  );
}
