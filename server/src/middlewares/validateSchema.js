export const validateSchema = (schema) => (req, res, next) => {
  try {
    if (req.is('multipart/form-data')) {
      let parsedData;

      if (req.files && req.files.file) {
        parsedData = schema.parse({
          ...req.body,
          file: req.files.file,
        });
      } else {
        parsedData = schema.parse(req.body);
      }

      req.body = { ...req.body, ...parsedData };
    } else {
      req.body = { ...req.body, ...schema.parse(req.body) };
    }
    next();
  } catch (error) {
    next(error);
  }
};
