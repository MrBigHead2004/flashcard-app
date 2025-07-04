module.exports.validateInput = (schema) => {
    return async (req, res, next) => {
        try {
            if(schema.body){
                const {error, value} = schema.body.validate(req.body, {abortEarly: false});
                if(error){
                    console.log(error);
                    return res.status(400).json({
                        message: "Validation error",
                    });
                }
                req.body = value;
            }
            if(schema.query){
                const {error, value} = schema.query.validate(req.query, {abortEarly: false});
                if(error){
                    console.log(error);
                    return res.status(400).json({
                        message: "Validation error",
                    });
                }
                req.query = value;
            }
            if(schema.params){
                const {error, value} = schema.params.validate(req.params, {abortEarly: false});
                if(error){
                    console.log(error);
                    return res.status(400).json({
                        message: "Validation error",
                    });
                }
                req.params = value;
            }
            next();
        } catch (error) {
            console.error(`[Middleware] Validation error:`, error);
            return res.status(500).json({
                message: "Internal server error",
            });
        }
    }
}