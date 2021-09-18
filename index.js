const express = require('express')
const app = express()
const port = 3000

const mongoose = require("mongoose")

const config = require('./config/key')

const bodyParser = require('body-parser')
// User model 을 import 합니다.
const { User } = require("./models/User")

// bodyParser 옵션 설정
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());

// mongoose.connect("mongodb+srv://test:test@fuckingdb.rufm6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority")
mongoose.connect(config.mongoURI)
	.then(() => {
		console.log('MongoDB Connected...')
	})
	.catch((err) => {
		console.log(err)
	})

app.get('/', (req, res) => {
	res.send('Hello World!')
})

// post method
app.post('/register', (req, res) => {
	// 회원가입할때 필요한 정보들을 client 에서 가져오면 DB에 추가하기
	// req.body 에 아래와 같은 형식으로 읽을 수 있도록 위에서 옵션을 추가했습니다.
	/* bodyparser 좋네요
	{
	  id: "test"
	  pw: "test"
	}
	*/
	const user = new User(req.body)
	user.save((err, userInfo) => {
		if (err) return res.json({ success: false, err })
		return res.status(200).json({ success: true })
	})
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
