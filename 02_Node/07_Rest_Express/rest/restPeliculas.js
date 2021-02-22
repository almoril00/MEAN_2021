const express = require("express")
const negocioPeliculas = require("../negocio/negocioPeliculas")

let router = express.Router()

//API REST para las peliculas
/*
MÉTODO	URL			        BODY	FUNCIONALIDAD
-------------------------------------------------------------------
GET	    /peliculas		    -	    listar las películas
GET	    /peliculas/:id  	-	    buscar a una película por su id
POST	/peliculas		    {json}	insertar la película
PUT 	/peliculas/:id  	{json}  modificar la película
DELETE  /peliculas/:id  	-	    borrar una película
*/
router.get("/peliculas", listarPeliculas)
router.get("/peliculas/:id", buscarPelicula)
router.post("/peliculas", insertarPelicula)
router.put("/peliculas/:id", modificarPelicula)
router.delete("/peliculas/:id", borrarPelicula)

//EXPORTAMOS EL ROUTER
exports.router = router

//Tareas de la lógica de control de un api REST:
//---------------------------------------------------------------------
//1-extraer de la petición la información necesaria
//2-convertir esa información en algo que entienda la lógica de negocio
//3-invocar la función de la lógica de negocio
//4-si la lógica de negocio devuelve algo que le haga falta al cliente
//  transformarlo al formato adecuado y proporcionar la respuesta

function listarPeliculas(request, response){
    console.log("Listar películas")
    //Aqui haría falta un criterio de búsqueda (lo ignoramos)
    negocioPeliculas
        .listarPeliculas()
        .then(function(peliculas){
            response.json(peliculas)
        })
        .catch(function(err){
            response.statusCode = err.codigo
            response.json(err)
        })
}

//GET /peliculas/:id
function buscarPelicula(request, response){
    console.log("Buscar película")
    let id = request.params.id
    negocioPeliculas
        .buscarPelicula(id)
        .then(function(pelicula){
            response.json(pelicula)                     
        })
        .catch(function(err){
            response.statusCode = err.codigo
            response.json(err)
        })
}

//POST /peliculas
//CT: app/json
//-------------------------------
function insertarPelicula(request, response){
    console.log("Insertar película (LC)") 
    
    //Express solo leerá el body si hemos dado de alta el jsonBodyParser y además
    //en la petición viene el header 'Content-Type:application/json'
    let pelicula = request.body
    negocioPeliculas
        .insertarPelicula(pelicula)
        .then( function(result){
            //Esta línea la dejamos porque response.json por defecto deja el statusCode 200
            response.statusCode = 201
            response.json(result.ops[0])
        })
        .catch(function(err){
            console.log(err)
            restUtil.devolverError(response, 500, "Error al buscar la película")
        })
}

//PUT /peliculas/:id
//CT: app/json
function modificarPelicula(request, response){
    console.log("Modificar película (LC)")

    //aqui hace falta la peli y el id
    let id = request.params.id
    let pelicula = request.body
    //Nos aseguramos de que la película que venía en el body tenga el id 
    //que venía en la ruta
    pelicula._id = id
    
    negocioPeliculas
    .modificarPelicula(pelicula)
    .then(function(result){
            //if(result.value == null){
            if(!result.value){
                restUtil.devolverError(response,404,"No existe la película")
                return
            }
            response.json(result.value)
        })
    .catch(function(err){
        console.log(err)
        restUtil.devolverError(response, 500, "Error al modificar la película") 
    }) 
}

//DELETE /peliculas/:id
function borrarPelicula(request, response){
    console.log("Borrar película (LC)")
    //aqui hace falta el id de la pelicula
    let id = request.params.id
    negocioPeliculas
        .borrarPelicula(id) 
        .then(function(result){
            //if 404
            response.end("OK")
        })
        .catch(function(err){
            restUtil.devolverError(response, 500, "Error al borrar la película") 
        })
}









