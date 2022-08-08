const messageError = (messageError, codeStatus) => {
  const error = new Error(messageError);
  return res.status(404).json({
    status: "error",
    message: error.message,
  });
};
