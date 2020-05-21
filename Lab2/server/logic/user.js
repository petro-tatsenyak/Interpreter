var User = /** @class */ (function () {
    function User() {
    }
    User.prototype.createUser = function (user) {
        return user;
    };
    return User;
}());
var ProxyUser = /** @class */ (function () {
    function ProxyUser(realUSer) {
        this.realUSer = realUSer;
    }
    ProxyUser.prototype.createUser = function (user) {
        if (this.checkUserName(user["name"])) {
            user["level"] = this.levelCalculate(user["experience"]);
            return this.realUSer.createUser(user);
        }
    };
    ProxyUser.prototype.checkUserName = function (userName) {
        if (userName.length > 4)
            return true;
        return false;
    };
    ProxyUser.prototype.levelCalculate = function (experience) {
        return Math.floor(experience / 100) + 1;
    };
    return ProxyUser;
}());
module.exports.User = User;
module.exports.ProxyUser = ProxyUser;
