module.exports = {
    validateParams: (schema) => (req, res, next) => {
      const params = req.params;
      const result = schema.validate(params);
  
      if (result.error) {
        res.status(400).json({ error: result.error.details });
        return;
      }
  
      next();
    },
  };
  