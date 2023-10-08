const fs = require('fs');
//App def
const express = require('express');
const request = require('request');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
const pythonURL = "https://apipython-wha3.onrender.com"

//File system
const fileSystem = require('./fileSystem.js');
var jsonFile = "";
const nombreArchivo = "preguntas.json";
const directorio = "assets";

//Express uses
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Requests
app.get("/getPreguntes", (req, res) => {
    fs.readFile("./assets/preguntas.json", 'utf8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'No se pudo leer el archivo de preguntas.' });
            return;
        }

        try {
            jsonFile = JSON.parse(data);
            res.json(jsonFile);
        } catch (parseError) {
            res.status(500).json({ error: 'Error al analizar el archivo JSON.' });
        }
    });
})
app.post("/afegirPregunta", (req, res) => {
    jsonFile.preguntes.push({
        id: (jsonFile.preguntes.length + 1),
        pregunta: req.body.nomPeli,
        respostes: [{
            id: 1,
            any: req.body.resposta1

        }, {
            id: 2,
            any: req.body.resposta2
        }, {
            id: 3,
            any: req.body.resposta3
        }, {
            id: 4,
            any: req.body.resposta4
        }
        ],
        resposta_correcta: req.body.check_resposta,
        imatge: req.body.addURLImage
    })
    fileSystem(directorio, nombreArchivo, jsonFile);
    res.status(200).send();
})
app.post("/postRespostes", (req, res) => {
    console.log(req.body);
    fs.readFile("./respondidas.json", 'utf-8', (err, data) => {
        if (err) {
            res.status(500).json({ error: 'No se pudo leer el json de respondidas' });
            return;
        } else {
            file = JSON.parse(data);
            file.push(req.body);
            fileSystem(directorio, "respondidas.json", file);
            res.status(200).send();
        }
    })

})
app.get("/getStats", (req, res) => {
    fs.readFile("./respondidas.json", 'utf-8', (err, data) => {
        if (err) {
            res.status(500).json({ error: err });
            return;
        } else {
            request(
                { url: pythonURL+"/create-stats", 
                method: "POST", 
                body: data, 
                headers: {
                    "Content-Type": "application/json",
                }, },
                (error, response, body) => {
                  if (error || response.statusCode !== 200) {
                    return res.status(500).json({ type: 'error', message: error.message });
                  }
                  res.json(JSON.parse(body));
                }
              )
            
            /*fetch(pythonURL+"/create-stats", {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                    "Content-Type": "application/json",
                },
                referrerPolicy: "no-referrer",
                body: data
            }).then((response) => response.json().then((data) => {
                console.log(data)
                res.status(200).json(data);
            }))*/
            
        }
    })
})
app.put("/update/:id", async (req, res) => {
    jsonFile.preguntes.forEach(element => {
        if (element.id == req.params.id) {
            element.pregunta = req.body.nom;
            element.respostes = [{
                id: 1,
                any: req.body.resposta1

            }, {
                id: 2,
                any: req.body.resposta2
            }, {
                id: 3,
                any: req.body.resposta3
            }, {
                id: 4,
                any: req.body.resposta4
            }];
            element.resposta_correcta = req.body.resposta_correcta;
            element.imatge = req.body.URLImage;
        }
    });
    fileSystem(directorio, nombreArchivo, jsonFile);
    res.status(200).send();
})
app.delete("/delete/:id", async (req, res) => {
    jsonFile.preguntes.forEach(element => {
        if (element.id == req.params.id) {
            jsonFile.preguntes = jsonFile.preguntes.filter(item => {
                return item != element
            })
        }
    });
    fileSystem(directorio, nombreArchivo, jsonFile);
    res.json(jsonFile);
})
app.post("/formatPreguntes", (req, res) => {
    var jsonBackup = require("./preguntas_backup.json");
    fs.writeFile("./assets/preguntas.json", JSON.stringify(jsonBackup), (err) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Texto escrito correctamente en el archivo.");
        }
    })
    res.status(200).send();
})

//Run server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})
