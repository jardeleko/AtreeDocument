module.exports = {
    iAdmin: ((req, res, next) => {
        if(req.isAuthenticated() && req.user.iAdmin == 1)  return next();
        res.redirect('/')
    }
)}


