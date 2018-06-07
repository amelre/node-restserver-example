const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');


let rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE'],
    message:'{VALUE} no es un rol válido'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre:{
        type: String,
        required:[true,'El nombre es necesario']
    },
    email:{
        type: String,
        unique: true,
        required:[true, 'El correo es necesario']
    },
    password:{
        type:String,
        required: [true, 'El password es obligatorio']
    },
    img:{
        type:String,
        required:false
    },
    role:{
        type:String,
        // required: true,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado:{
        type: Boolean,
        // required: true,
        default:true
    },
    google:{
        type: Boolean,
        // required: true,
        default:false
    }
});

usuarioSchema.methods.toJSON = function() { //aqui no se usa la funcion de flecha

    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;
}

usuarioSchema.plugin(uniqueValidator, {
    message:'{PATH} debe de ser unico'
});


module.exports = mongoose.model('Usuario', usuarioSchema);
