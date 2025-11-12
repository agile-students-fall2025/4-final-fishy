export function httpError(status, message, expose = true) {
    const err = new Error(message);
    err.status = status;
    err.expose = expose;
    return err;
  }
  