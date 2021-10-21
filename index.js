const express = require('express');
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash = require('express-flash');
const session = require('express-session');
const multer = require('multer');
const datastore = require('nedb');
const path = require('path');
const fs = require('fs');
// const pm2 = require('pm2');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);
const app = express();

// set up DB login
const loginDB = new datastore('./assets/DataBases/loginDB.db');
loginDB.loadDatabase()
// set up DB map
const mapDB = new datastore('./assets/DataBases/mapDB.db')
mapDB.loadDatabase()

// set up multer
const storage = multer.diskStorage({
    destination: function (_req, _res, cb){
        cb(null, './assets/img/')
    },
    filename: function (_req, file, cb){
        cb(null, `${file.originalname}`)
    }
})

const upload = multer({ storage: storage })


// declaration settings const
const initializePassport = require('./passport-config');
const { send } = require('process');
getUsers()
const PORT = 8080;


// settings
app.listen(PORT, () => console.log(`escuchando en puerto ${PORT}`));
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));
app.use(flash())
app.use(session({
    secret: 'supersecret',
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.static(path.join('assets')));
app.use(express.json({ limit: '1mb' }));


// routes call and redirections


app.get('/', (req, res) =>{
    res.render('front');
})

app.get('/login', checkNotAuthenticated, (req, res) =>{
    res.render('login');
})

app.get('/admin', checkAuthenticated, (req, res) =>{
    res.render('back')
})

app.get('/register',  checkAuthenticated,  (req, res) =>{ 
    res.render('register');
})

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/admin',
    failureRedirect: '/login',
    failureFlash: true
}))

app.get('/success', (req, res) =>{
    res.render('success');
})

app.post('/register', async (req, res) =>{
    try {
        const encryptpass = await bcrypt.hash(req.body.password, 10)
        const user = []
        user.push({
            id: Date.now().toString(),
            email: req.body.email,
            password: encryptpass
        })
        loginDB.insert(user);
        setTimeout(function(){
            res.redirect('/success')
        },2000)
    }catch {
        res.redirect('/register')
    }
})

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect('/login')
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
       return res.redirect('/admin')
    }
    next()
}


function getUsers(){
    loginDB.find({}, (err, data) =>{
       const users = data;
       initializePassport(
            passport, 
            email => users.find(user => user.email === email),
            id => users.find(user => user.id === id)
        );
    });
};

// conccion base de datos mapa

// post

app.post('/api', upload.single('image'), (req, res) =>{
    const params = req.body;
    params.icon_url = `/img/${req.file.originalname}`
    
    mapDB.insert(params);
})

app.post('/markers', (req, res) =>{
    var lat = req.body.lat;
    var lon = req.body.lon;
    var tipo = req.body.tipo;
    tipo = tipo.charAt(0).toUpperCase() + tipo.slice(1);

    mapDB.find({ lat: `${lat}`, lon: `${lon}`, Tipo: `${tipo}`}, (err, data) =>{
        if (!err) {
            res.send(data);
        }else{
            console.log(err);
        }
    })
})

app.post('/modify', (req, res) =>{
    console.log(req.body.id)
    mapDB.update({ _id: req.body.id }, { $set: { name: req.body.name } }, (err, numReplaced) =>{
        console.log("se modifico nombre de: " + numReplaced);
    })
    mapDB.update({ _id: req.body.id }, { $set: { popUpinfo: req.body.popUpinfo } }, (err, numReplaced) =>{
        console.log("se modifico popup de: " + numReplaced);
    })
})

app.post('/modifyImage', upload.single('image'), (req, res) =>{
    const params = req.body;
    params.icon_url = `/img/${req.file.originalname}`;
    mapDB.update({ _id: params.id }, { $set: { name: params.name } }, (err, numReplaced) =>{
        console.log("se modifico nombre de: " + numReplaced);
    })
    mapDB.update({ _id: params.id }, { $set: { popUpinfo: params.popUpinfo } }, (err, numReplaced) =>{
        console.log("se modifico popup de: " + numReplaced);
    })
    mapDB.update({ _id: params.id }, { $set: { icon_url: params.icon_url}}, (err, numReplaced) =>{
        console.log("se modifico icon url de: " + numReplaced);
    })
    unlinkAsync(path.resolve('./assets' + params.oldPath));
})

app.post('/delete', (req, res) =>{
    mapDB.remove({ _id: req.body[0]._id }, (err, numRemoved) =>{
        console.log("se removio: " + numRemoved);
    })
    unlinkAsync(path.resolve('./assets' + req.body[0].icon_url));
    /*
    pm2.connect(function(err){
        if (err) {
            console.log(err)
            process.exit(2)
        }

        pm2.restart('map', (err, proc) =>{
            pm2.disconnect();
        })
    })
    */
})

// get
app.get('/empresa', (req, res) =>{
    mapDB.find({ Tipo: 'Empresa Adheridas' }, (err, data) =>{
        if(!err) {
            res.send(data)
        }else {
            console.log(err)
        }
    })
})

app.get('/beneficio', (req, res) =>{
    mapDB.find({ Tipo: 'Empresas Responsables' }, (err, data) =>{
        if(!err) {
            res.send(data)
        }else {
            console.log(err)
        }
    })
})

app.get('/acopio', (req, res) =>{
    mapDB.find({ Tipo: 'Centros de Acopio' }, (err, data) =>{
        if(!err) {
            res.send(data)
        }else {
            console.log(err)
        }
    })
})

app.get('/mapDB', (req, res) =>{
    mapDB.find({}, (err, data) =>{
        if (!err) {
            res.send(data);
        }else{
            console.log(err);
        }
    })
})
