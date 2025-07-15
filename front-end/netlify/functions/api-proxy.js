const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
  const path = event.path.replace('/.netlify/functions/api-proxy', '');
  const url = `http://158.179.167.189:8000/api/v1${path}`;

  const response = await fetch(url, {
    method: event.httpMethod,
    headers: { ...event.headers, host: undefined },
    body: event.body,
  });

  const body = await response.text();

  return {
    statusCode: response.status,
    headers: {
      'Content-Type': response.headers.get('content-type') || 'text/plain',
      'Access-Control-Allow-Origin': '*',
    },
    body,
  };
}; 