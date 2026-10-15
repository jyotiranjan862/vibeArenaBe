export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export type HttpStatusCode = typeof HttpStatus[keyof typeof HttpStatus];

export const SocketEvents = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  JOIN_ROOM: 'room:join',
  LEAVE_ROOM: 'room:leave',
  SEND_MESSAGE: 'chat:send_message',
  RECEIVE_MESSAGE: 'chat:receive_message',
  MESSAGE_DELIVERED: 'chat:message_delivered',
  MESSAGE_READ: 'chat:message_read',
  TYPING_START: 'chat:typing_start',
  TYPING_STOP: 'chat:typing_stop',
  USER_ONLINE: 'presence:user_online',
  USER_OFFLINE: 'presence:user_offline',
} as const;

export type SocketEvent = typeof SocketEvents[keyof typeof SocketEvents];
