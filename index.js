import 'dotenv/config'
import colors from 'colors'
import Busquedas from './models/busquedas.js'
import { inquirerMenu, pausa, leerInput, listarLugares } from './helpers/inquirer.js'

const main = async() => {
    const busquedas = new Busquedas()
    let opt

    do {
        opt = await inquirerMenu()

        switch (opt) {
            case 1:
                // Mostrar Mensaje
                const termino = await leerInput(`Cuidad: `)

                // Buscar los lugares
                const lugares = await busquedas.cuidad(termino)

                // Seleccionar el lugar
                const id = await listarLugares(lugares)
                if(id === '0') continue
                const lugarSel = lugares.find( l => l.id === id )

                // Guardar en DB
                busquedas.agregarHistorial(lugarSel.nombre)

                // Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)

                // Mostrar Resultados
                console.clear()
                console.log('\nInformación de la cuidad\n'.yellow)
                console.log(`Cuidad: ${lugarSel.nombre.yellow}`)
                console.log(`Lat: ${lugarSel.lat}`)
                console.log(`Lng: ${lugarSel.lng}`)
                console.log(`Temperatura: ${colors.green(clima.temp)}`)
                console.log(`Mínima: ${colors.green(clima.min)}`)
                console.log(`Máxima: ${colors.green(clima.max)}`)
                console.log(`El día estará: ${clima.desc.yellow}`)
                break;
            
            case 2:
                busquedas.historialCapitalizado.forEach((lugar, i) => {
                    const idx = `${i + 1}.`.yellow
                    console.log(`${idx} ${lugar}`)
                })
                break;
        }

        if(opt !== 0) await pausa()

    } while (opt !== 0);
}
main();