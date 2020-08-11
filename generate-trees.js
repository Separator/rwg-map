const fs = require('fs');

let result = {
    meta: {
        author: "Separator",
        name: "Test name",
        scheme: "summer",
        size: 128,
        version: "0.0.0"
    },
    objects: {
        trees: [],
        crates: []
    }
};

const getRandomArbitrary = (min, max) =>
    Math.floor(Math.random() * (max - min + 1)) + min;

for (let i = 0; i < 2000; i++) {
    result.objects.trees.push({
        x: getRandomArbitrary(0, 127) * 32,
        y: getRandomArbitrary(0, 127) * 32,
        damage: getRandomArbitrary(0, 3),
        id: getRandomArbitrary(0, 127)
    });
}

for (let i = 0; i < 2000; i++) {
    result.objects.crates.push({
        x: getRandomArbitrary(0, 127) * 32,
        y: getRandomArbitrary(0, 127) * 32,
        damage: getRandomArbitrary(0, 3),
        id: getRandomArbitrary(0, 117)
    });
}

fs.writeFileSync('my-map.json', JSON.stringify(result, null, 4), 'utf8');
