const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

exports.handler = async (event) => {
  // '/.netlify/functions/api-proxy' 또는 '/api'를 제거
  let path = event.path;
  if (path.startsWith('/.netlify/functions/api-proxy')) {
    path = path.replace('/.netlify/functions/api-proxy', '');
  } else if (path.startsWith('/api')) {
    path = path.replace('/api', '');
  }
  const url = `http://158.179.167.189:8000/api/v1${path}`;
  console.log('프록시 요청 URL:', url);

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