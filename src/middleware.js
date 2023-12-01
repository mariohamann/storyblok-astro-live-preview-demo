export function onRequest({ locals, request, context, params }, next) {
  // Helper to extract the body from the request in an usable form
  function getRequestBody(req) {
    const symbols = Object.getOwnPropertySymbols(req);
    let body;

    // Find and extract the body from the request
    for (const sym of symbols) {
      if (req[sym].hasOwnProperty('body')) {
        body = req[sym].body;
        break;
      }
    }

    // Safely retrieves a nested property from an object
    function getNestedProperty(obj, ...props) {
      return props.reduce((prev, prop) => (prev && prev[prop]) ? prev[prop] : null, obj);
    }

    // Retrieve and process the 'source' property
    const source = getNestedProperty(body, 'source');
    if (source) {
      const decoder = new TextDecoder();
      const decodedString = decoder.decode(source);
      return JSON.parse(decodedString);
    }

    return null;
  }

  // Process the request and update locals if necessary
  if (request['method'] === 'POST') {
    const requestBody = getRequestBody(request);

    if (requestBody && requestBody['is_storyblok_preview']) {
      locals['_storybook_preview_data'] = requestBody;
    }
  }

  return next();
}
