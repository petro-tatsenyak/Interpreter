interface AbstractRace {
    myCar: Object;

    createMap(): AbstractMap;

    createEnemies(): AbstractEnemies;

    findPlaces(): AbstractPlaces
}

class RaceEngland implements AbstractRace {
    public myCar;

    public constructor(car: Object = { title: 'Ferrari', speed: 100}){
        this.myCar = car
    }

    public createMap(): AbstractMap {
        return new EnglandMap();
    }

    public createEnemies(): AbstractEnemies {
        return new EasyEnemies();
    }

    public findPlaces(): AbstractPlaces {
        return new Places();
    }
}

class RaceSpain implements AbstractRace {
    public myCar

    public constructor(car: Object = { title: 'Ferrari', speed: 100}){
        this.myCar = car
    }

    public createMap(): AbstractMap {
        return new SpainMap();
    }

    public createEnemies(): AbstractEnemies {
        return new MediumEnemies();
    }

    public findPlaces(): AbstractPlaces {
        return new Places();
    }
}

interface AbstractMap {
    raceLength(): number;
    rewards(place: number, map: AbstractMap): number;
}

class EnglandMap implements AbstractMap {
    public raceLength(): number {
        return 210;
    }

    public rewards(place: number, map: AbstractMap): number {
        if(place < 1 || place > 20)
            return 0
        return map.raceLength()*10/place;
    }
}

class SpainMap implements AbstractMap {
    public raceLength(): number {
        return 305;
    }

    public rewards(place: number, map: AbstractMap): number {
        if(place < 1 || place > 20)
            return 0
        return map.raceLength()*10/place;
    }
}

interface AbstractEnemies {
    generateEnemies(): Array<Object>;
}

class EasyEnemies implements AbstractEnemies {
    public generateEnemies(): Array<Object> {
        let Enemies = [];
        for(let i = 0; i < 19; i++)
            Enemies.push({
                title: `Enemy${i+1}`,
                speed: Math.floor(Math.random()*500*0.8)
            })
        return Enemies
    }
}

class MediumEnemies implements AbstractEnemies {
    public generateEnemies(): Array<Object> {
        let Enemies = [];
        for(let i = 0; i < 19; i++)
            Enemies.push({
                title: `Enemy${i+1}`,
                speed: Math.floor(Math.random()*500*1.1)
            })
        return Enemies
    }
}

interface AbstractPlaces {
    racePlaces(squad: Array<Object>): Array<Object>;
}

class Places implements AbstractPlaces {
    public racePlaces(squad: Array<Object>): Array<Object>{
        return squad.sort((a,b) => b["speed"] - a["speed"])
    }
} 


module.exports.RaceEngland = RaceEngland
module.exports.RaceSpain = RaceSpain