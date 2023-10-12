export function onRequest({ locals, request, context, params }, next) {
  // intercept response data from a request
  // optionally, transform the response by modifying `locals`
  // locals.title = "New title";
  // console.log(request, locals, context, params);

  const symbols = Object.getOwnPropertySymbols(request);
  let body;
  for (const sym of symbols) {
    if (request[sym].hasOwnProperty('body')) {
      body = request[sym].body;
      break;
    }
  }
  // console.log(request);

  function getNestedProperty(obj, ...props) {
    return props.reduce((prev, prop) => (prev && prev[prop]) ? prev[prop] : null, obj);
  }

  const source = getNestedProperty(body, 'source');

  if (source) {
    // console.log(source);
    const decoder = new TextDecoder();
    const decodedString = decoder.decode(source);

    locals['_storybook_preview'] = JSON.parse(decodedString);
  } else {
    // console.log('Source property does not exist');
  }

  return next();
};
