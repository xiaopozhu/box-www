export class ResponseError extends Error {
  public response: Response;

  constructor(response: Response) {
    super(response.statusText);
    this.response = response;
  }
}
/**
 * Parses the JSON returned by a network request
 *
 * @param  {object} response A response from a network request
 *
 * @return {object}          The parsed JSON from the request
 */
function parseJSON(response: Response) {
  if (response.status === 204 || response.status === 205) {
    return null;
  }

  return response.json();
}

/**
 * Checks if a network request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from a network request
 *
 * @return {object|undefined} Returns either the response, or throws an error
 */
function checkStatus(response: Response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  if (response.status >= 400 && response.status < 500) {
    return response;
  }
  const error = new ResponseError(response);
  throw error;
}

/**
 * @param {object} returnTo A contain return_to url decode and encode
 */
export function getReturnTo() {
  if (window.location.search.startsWith("?return_to=")) {
    return {
      origin: window.location.search,
      decode: decodeURIComponent(window.location.search.substring(11)),
    };
  }
  return null;
}

/**
 * Requests a URL, returning a promise
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 *
 * @return {object}           The response data
 */
export async function request(
  url: string,
  options?: RequestInit
): Promise<any | { err: ResponseError }> {
  const fetchOptions: RequestInit = {
    credentials: "include",
    ...options,
  };
  const fetchResponse = await fetch(
    `${process.env.API_HOST}${url}`,
    fetchOptions
  );
  const response = checkStatus(fetchResponse);
  return parseJSON(response);
}
