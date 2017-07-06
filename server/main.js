// 외부 라이브러리
import express from 'express';
import path from 'path';
import WebpackDevServer from 'webpack-dev-server';
import webpack from 'webpack';
import morgan from 'morgan'; // HTTP REQUEST LOGGER
import bodyParser from 'body-parser'; // PARSE HTML BODY
import mongoose from 'mongoose';
import session from 'express-session';

// api
import api from './routes';

const app = express();
const port = 3000;
const devPort = 4000;

//Express
app.use('/', express.static(path.join(__dirname, './../public')));
app.use('/api', api);
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(session({
  secret:'rhkdgur1@#',
  resave:false,
  saveUnitialized:true
}));
/* handle error */
app.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, './../public/index.html'));
});

app.get('/hello', (req, res) => {
    return res.send('Hello CodeLab');
});

app.listen(port, () => {
    console.log('Express is listening on port', port); // App Listen port ㄴ
});

//DB
const db = mongoose.connection;
db.on('error',console.error);
db.once('open', ()=>{console.log('Connected to mongodb server');});
mongoose.connect('mongodb://localhost/hyuk');

// 개발용 서버
if(process.env.NODE_ENV == 'development') {
    console.log('Server is running on development mode');
    const config = require('../webpack.dev.config');
    const compiler = webpack(config);
    const devServer = new WebpackDevServer(compiler, config.devServer);
    devServer.listen(
        devPort, () => {
            console.log('webpack-dev-server is listening on port', devPort);
        }
    );
}
