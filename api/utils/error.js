export const errorHandler = (statucode, message) => {
    const error = new Error()
    error.statucode = statucode
    error.message = message
    return error;
};
