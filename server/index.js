const express = require('express')
const app = express()
const port = 4000

const mongoose = require("mongoose")

const config = require('./config/key')

const bodyParser = require('body-parser')
// User model 을 import 합니다.
const { User } = require("./models/User")
const cookieParser = require("cookie-parser")

const { auth } = require('./middleware/auth')

// bodyParser 옵션 설정
// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));
// application/json
app.use(bodyParser.json());
// cookie parser
app.use(cookieParser());

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

// LandinPage get method
app.get('/api/hello', (req, res) => {
	res.send("Hello~!")
})

// post method
app.post('/api/users/register', (req, res) => {
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

// loging router
app.post('/api/users/login', (req, res) => {
	// 요청한 email 을 DB에 있는지 찾아본다.
	// console.log("email:", req.body.email);
	User.findOne({ email: req.body.email }, (err, user) => {
		// 없다면
		if (!user) {
			return res.json({
				loginSuccess: false,
				message: "제공된 이메일에 해당하는 유저가 없습니다.",
			})
		}
		// 있다면
		// PW 가 DB에 있는지 찾아본다.
		// console.log("user:", user);  // 잘 찍힘
		// console.log("password:", req.body.password);  // 잘 찍힘
		user.comparePassword(req.body.password, (error, isMatch) => {
			if (!isMatch)
				return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다." })

			// 비밀번호가 맞다면 token 을 생성합니다.
			user.generateToken((err, userInfo) => {
				if (err) return res.status(400).send(err)
				// token 저장하기 어디에?! cookie, local storage, session storage
				// 어디에 해야하는지는 알아서 하세요 논란이 너무 많아, 여러방법이 있고 각 장단점이 다르다
				// cookie 저장해보겠습니다.
				res.cookie("x_auth", userInfo.token)
					.status(200)
					.json({ loginSuccess: true, userId: user._id })
			})
		})
	})
})

// auth
// 향후 express router 기능 사용을 위해서 api/users 로 정리합니다.
// auth 라는 미들웨어를 추가할 예정입니다.
app.get('/api/users/auth', auth, (req, res) => {
	// 이게 실행되면 authentication 이 성공햇다는 말 (true)
	// auth 미들웨어에서 req.token 과 req.user._id 을 추가했습니다.
	res.status(200).json({
		_id: req.user._id,
		isAdmin: req.user.role === 0 ? false : true,  // role 이 0이 아니면 admin
		isAuth: true,
		email: req.user.email,
		name: req.user.name,
		lastname: req.user.lastname,
		role: req.user.role,
		image: req.user.image,
	})
})

app.get('/api/users/logout', auth, (req, res) => {
	User.findOneAndUpdate({ _id: req.user._id }, { token: "" }, (err, user) => {
		if (err) return res.json({ success: false, err })
		return res.status(200).send({ success: true })
	})
})

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`)
})
