/**
 * @description: Response result
 * @argument SUCCESS  Request succeeded
 * @argument EXPIRE   Token expired or validation failed
 * @argument ERROR    Request error
 * @argument TIMEOUT  Request timeout
 * @argument TYPE     Request type
 */
// export enum ResultEnum {
//   SUCCESS = 200,
//   EXPIRE = 203,
//   ERROR = -1,
//   ERRMESSAGE = 'Request failed',
//   TIMEOUT = 25000,
//   TYPE = 'success',
// }
export const ResultEnum = {
  SUCCESS: 200,
  EXPIRE: [305, 601, 602],
  ERROR: -1,
  ERRMESSAGE: 'Request failed',
  TIMEOUT: 25000,
  TYPE: 'success',
  } as const