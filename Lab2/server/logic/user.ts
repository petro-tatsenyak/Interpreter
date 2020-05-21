interface Subject {
    createUser(user: Object): void;
}

class User implements Subject {
    public createUser(user: Object): Object {
        return user
    }
}

class ProxyUser implements User {
    private realUSer: User;

    constructor(realUSer: User) {
        this.realUSer = realUSer;
    }

    public createUser(user: Object ): Object {
        if (this.checkUserName(user["name"])) {
            user["level"] = this.levelCalculate(user["experience"])
            return this.realUSer.createUser(user);
        }
    }

    private checkUserName(userName: string): boolean {
        if(userName.length > 4)
            return true;
        return false
    }

    private levelCalculate(experience: number): number {
        return Math.floor(experience/100) + 1;
    }
}

module.exports.User = User;
module.exports.ProxyUser = ProxyUser

