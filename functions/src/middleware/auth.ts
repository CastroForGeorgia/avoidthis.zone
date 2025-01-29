import {HttpsError, CallableRequest} from "firebase-functions/v2/https";

/**
 * Middleware to enforce authentication for callable functions.
 * Throws an HttpsError if the user is not authenticated.
 *
 * @template T - The type of the data expected in the callable request.
 * @param {function(CallableRequest<T>): Promise<unknown>} fn - The callable
 * function to wrap with authentication enforcement.
 * @return {function(CallableRequest<T>): Promise<unknown>} A new callable
 * function that enforces authentication.
 */
export const withAuth = <T>(
  fn: (request: CallableRequest<T>) => Promise<unknown>
): ((request: CallableRequest<T>) => Promise<unknown>) => {
  return async (request: CallableRequest<T>) => {
    if (!request.auth) {
      throw new HttpsError(
        "unauthenticated",
        "You must be authenticated to call this function."
      );
    }
    return fn(request);
  };
};
