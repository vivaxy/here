/**
 * @since 2016-03-02 18:05
 * @author vivaxy
 */

'use strict';

let db = {
    tobi: {
        name: 'tobi',
        age: 21
    },
    loki: {
        name: 'loki',
        age: 26
    },
    jane: {
        name: 'jane',
        age: 18
    }
};

module.exports = [
    {
        method: 'get',
        path: '/pets',
        data () {
            let names = Object.keys(db);
            return names.map((name) => {
                return db[name];
            });
        }
    },
    {
        method: 'get',
        path: '/pets/:name',
        data () {
            let name = this.params.name;
            let pet = db[name];
            if (!pet) {
                return {
                    error: `cannot find pet ${name}`
                };
            } else {
                return pet;
            }
        }
    }
];
