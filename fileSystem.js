const fs = require('fs');
const path = require('path');

function escribirJSON(directorio,title,json){

    const directorioPath = path.join(__dirname, directorio); // Ruta completa del directorio

    if (!fs.existsSync(directorioPath)) {
        fs.mkdirSync(directorioPath);
    }

    const archivoPath = path.join(directorioPath, title);

    fs.writeFile(archivoPath, JSON.stringify(json), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Texto escrito correctamente en el archivo.");
        }
    });
}
module.exports = escribirJSON;