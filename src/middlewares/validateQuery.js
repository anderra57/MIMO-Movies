
module.exports = {
    validateQuery: (schema) => (req, res, next) => {
      const query = res.query;
      const result = schema.validate(query);
  
      if (result.error) {
        res.status(400).json({ error: result.error.details });
        return;
      }
  
      next();
    },
  };
  