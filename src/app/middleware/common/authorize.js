const { responseError } = require("@/utils/helpers");

export const authorize =  (role) => {
    return  (req, res, next) => {
        if (req.currentUser.role !== role) {

            return responseError(res, 403, "Bạn không có quyền truy cập !");
        }
        next();
        
    };

};