export const sendResErrorsMiddlewares = (res, errors) =>
  res.status(400).json({
    ok: false,
    errors: errors.mapped(),
  });
