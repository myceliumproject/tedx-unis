// @ts-check

/**
 *
 * @template {{ [s: string]: any; }} TParams
 * @template {import("qs").ParsedQs} TQuery
 * @template TBody
 *
 * @param {(...args: Parameters<import("express").RequestHandler<TParams, any, TBody, TQuery>>) => Promise<void> | void} handler
 * @returns {import("express").RequestHandler<TParams, any, TBody, TQuery>}
 */
export function handler(handler) {
  // @ts-ignore
  return (req, res, next) => {
    Promise.resolve()
      // @ts-ignore
      .then(() => handler(req, res, next))
      .catch(next);
  };
}
