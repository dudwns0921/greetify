const fetch = require('node-fetch');

const SERVER_URL = 'http://158.179.167.189/greetify';

exports.handler = async (event) => {
  let path = event.path;
  if (path.startsWith('/.netlify/functions/api-proxy')) {
    path = path.replace('/.netlify/functions/api-proxy', '');
  } else if (path.startsWith('/api')) {
    path = path.replace('/api', '');
  }
  const url = `${SERVER_URL}${path}`;
  console.log('프록시 요청 URL:', url);

  // Content-Length, host 등 일부 헤더는 제거
  const { host, ...headers } = event.headers;

  // body가 base64로 올 수 있으니 처리
  const isBase64Encoded = event.isBase64Encoded;
  let body = event.body;
  if (isBase64Encoded && body) {
    body = Buffer.from(body, 'base64');
  }

  const response = await fetch(url, {
    method: event.httpMethod,
    headers,
    body: body && body.length > 0 ? body : undefined,
  });

  const resBody = await response.text();

  return {
    statusCode: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') || 'text/plain',
      'Access-Control-Allow-Origin': '*',
    },
    body: resBody,
  };
}; 