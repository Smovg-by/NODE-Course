const { parse } = require('csv-parse');
const fs = require('fs')

const habitablePlanets = []

function isHabitablePlanets(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
        && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
        && planet['koi_prad'] < 1.6
}

fs.createReadStream('kepler_data.csv') 
    .pipe(parse({  // подключение парсера к стриму
        comment: '#',
        columns: true,
    }))
    .on('data', (planet) => { // обработчик события 'data'
        if (isHabitablePlanets(planet)) { habitablePlanets.push(planet) }

    })
    .on('error', (error) => {
        console.log(error); // обработчик события 'error'
    })
    .on('end', () => { // обработчик события 'end'
        console.log(habitablePlanets.map((planet)=>{
            return planet['kepler_name'] 
        }));
        console.log(`=${habitablePlanets.length} habitable planets found!`);
        console.log('done');
    })


