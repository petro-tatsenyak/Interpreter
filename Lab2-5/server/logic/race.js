var RaceEngland = /** @class */ (function () {
    function RaceEngland(car) {
        if (car === void 0) { car = { title: 'Ferrari', speed: 100 }; }
        this.myCar = car;
    }
    RaceEngland.prototype.createMap = function () {
        return new EnglandMap();
    };
    RaceEngland.prototype.createEnemies = function () {
        return new EasyEnemies();
    };
    RaceEngland.prototype.findPlaces = function () {
        return new Places();
    };
    return RaceEngland;
}());
var RaceSpain = /** @class */ (function () {
    function RaceSpain(car) {
        if (car === void 0) { car = { title: 'Ferrari', speed: 100 }; }
        this.myCar = car;
    }
    RaceSpain.prototype.createMap = function () {
        return new SpainMap();
    };
    RaceSpain.prototype.createEnemies = function () {
        return new MediumEnemies();
    };
    RaceSpain.prototype.findPlaces = function () {
        return new Places();
    };
    return RaceSpain;
}());
var EnglandMap = /** @class */ (function () {
    function EnglandMap() {
    }
    EnglandMap.prototype.raceLength = function () {
        return 210;
    };
    EnglandMap.prototype.rewards = function (place, map) {
        if (place < 1 || place > 20)
            return 0;
        return map.raceLength() * 10 / place;
    };
    return EnglandMap;
}());
var SpainMap = /** @class */ (function () {
    function SpainMap() {
    }
    SpainMap.prototype.raceLength = function () {
        return 305;
    };
    SpainMap.prototype.rewards = function (place, map) {
        if (place < 1 || place > 20)
            return 0;
        return map.raceLength() * 10 / place;
    };
    return SpainMap;
}());
var EasyEnemies = /** @class */ (function () {
    function EasyEnemies() {
    }
    EasyEnemies.prototype.generateEnemies = function () {
        var Enemies = [];
        for (var i = 0; i < 19; i++)
            Enemies.push({
                title: "Enemy" + (i + 1),
                speed: Math.floor(Math.random() * 500 * 0.8)
            });
        return Enemies;
    };
    return EasyEnemies;
}());
var MediumEnemies = /** @class */ (function () {
    function MediumEnemies() {
    }
    MediumEnemies.prototype.generateEnemies = function () {
        var Enemies = [];
        for (var i = 0; i < 19; i++)
            Enemies.push({
                title: "Enemy" + (i + 1),
                speed: Math.floor(Math.random() * 500 * 1.1)
            });
        return Enemies;
    };
    return MediumEnemies;
}());
var Places = /** @class */ (function () {
    function Places() {
    }
    Places.prototype.racePlaces = function (squad) {
        return squad.sort(function (a, b) { return b["speed"] - a["speed"]; });
    };
    return Places;
}());
module.exports.RaceEngland = RaceEngland;
module.exports.RaceSpain = RaceSpain;
