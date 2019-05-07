
/**
 * Modified express error handler
 * @returns {void}
 */
export default function errorHandler() {
  // error handlers must always take four arguments
  // eslint-disable-next-line
  return (error, req, res, next) => {
    console.log({ error })
    if (error.validations) return res.status(422).json({ errors: error.validations });
    if (!error.code || !Number.isInteger(error.code)) {
        error.code = 500;
    }
    return res.status(error.code).json({ error: error.message });
  };
}
