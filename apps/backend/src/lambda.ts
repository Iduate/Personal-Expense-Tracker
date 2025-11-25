import app from './index';

// AWS Lambda handler that adapts Express app to Lambda + API Gateway
export const handler = async (event: any): Promise<any> => {
  // Parse request details from API Gateway event
  const method = event.requestContext?.http?.method || 'GET';
  const path = event.rawPath || '/';
  const query = event.rawQueryString || '';
  const headers = event.headers || {};
  const body = event.isBase64Encoded 
    ? Buffer.from(event.body || '', 'base64').toString() 
    : (event.body || '');

  // Collect response
  let statusCode = 200;
  let responseHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,Authorization',
  };
  let responseBody = '';

  // Create mock request object for Express
  const req: any = {
    method,
    url: path + (query ? `?${query}` : ''),
    headers: {
      ...headers,
      'content-type': headers['content-type'] || 'application/json',
    },
    body: body ? (typeof body === 'string' ? JSON.parse(body) : body) : {},
  };

  // Create mock response object for Express
  const res: any = {
    statusCode,
    setHeader: function(key: string, value: string) {
      responseHeaders[key] = value;
      return this;
    },
    send: function(data: any) {
      responseBody = typeof data === 'string' ? data : JSON.stringify(data);
      return this;
    },
    json: function(data: any) {
      responseBody = JSON.stringify(data);
      responseHeaders['Content-Type'] = 'application/json';
      return this;
    },
    status: function(code: number) {
      statusCode = code;
      return this;
    },
    end: function() {
      return this;
    },
  };

  // Handle request through Express
  return new Promise((resolve, reject) => {
    try {
      app(req, res, (err: any) => {
        if (err) {
          statusCode = 500;
          responseBody = JSON.stringify({ error: 'Internal Server Error', message: err.message });
        }
        resolve({
          statusCode,
          headers: responseHeaders,
          body: responseBody || '',
          isBase64Encoded: false,
        });
      });
    } catch (error: any) {
      resolve({
        statusCode: 500,
        headers: responseHeaders,
        body: JSON.stringify({ error: 'Lambda Error', message: error.message }),
        isBase64Encoded: false,
      });
    }
  });
};
