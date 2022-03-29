import convert from './controllers/main.js';

import 'dotenv/config';

import express from 'express';
import { engine } from 'express-handlebars';
import bodyParser from "body-parser";
import { body, validationResult } from 'express-validator';

const app = express();
const port = process.env.PORT || 3000

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');
app.use(express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', (req, res) => {
    res.render('home');
});

app.post('/', body('content').not().isEmpty().trim().escape(), async (req, res) => {
	convert(req.body.content)
		.then(data => {
			res.render('home', {
				data: decodeURI(data)
			})
		})
		.catch(err => {
			res.render('home', {
				error: 'lol u done goofed'
			})
		})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
