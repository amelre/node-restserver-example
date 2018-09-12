const express = require('express');
const { verificaToken , verificaAdmin_Role} = require('../middlewares/authentication');

let app = express();

let Categoria = require('../models/categoria');

//============================
// Mostrar todas las categorias
//=============================
app.get('/categoria', verificaToken, (req, res)=>{
  Categoria.find({})
    .sort('descripcion')
    .populate('usuario','nombre email')
    .exec( (err, categorias) => {

    if(err){
        return res.status(400).json({
            ok:false,
            err
        })
    }


      res.json({
        ok: true,
        categorias
      })



  })
});

//============================
// Mostrar una categoria por ID
//=============================
app.get('/categoria/:id', (req, res)=>{
  let id = req.params.id;

  Categoria.findById(id, (err, categoriaDB) => {

    if(err){
        return res.status(400).json({
            ok:false,
            err
        })
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    })

  })

});

//============================
// Crear nueva Categoría
//=============================
app.post('/categoria/', [verificaToken], (req, res)=>{

  let body = req.body;


  let categoria = new Categoria({
      descripcion : body.description,
      usuario: req.usuario._id
  });

  categoria.save( (err, categoriaDB) =>{
    if(err){
      return res.status(500).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    });

  });

});

//============================
// Actualizar la  Categoría
//=============================
app.put('/categoria/:id',[verificaToken], (req, res)=>{

  let id = req.params.id;

  let body = req.body;

  Categoria.findByIdAndUpdate(id, body, {new: true, runValidators: true}, (err, categoriaDB) => {
    if(err){
      return res.status(400).json({
        ok: false,
        err
      })
    }

    res.json({
      ok: true,
      categoria: categoriaDB
    });

  });

});

//============================
// Borrar  Categoría
//=============================
app.delete('/categoria/:id', [verificaToken, verificaAdmin_Role],(req, res)=>{

  let id = req.params.id;

  Categoria.findByIdAndRemove(id, (err, categoriaBorrada) =>{

    if(err){
      return res.status(400).json({
        ok: false,
        err
      })
    }

    if(!categoriaBorrada){
      return res.status(400).json({
        ok: false,
        err:{
          message:'Categoria no encontrada'
        }
      })
    }

    res.json({
      ok: true,
      categoria: categoriaBorrada
    })

  });


});




module.exports = app;
