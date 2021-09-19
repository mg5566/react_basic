const { User } = require('../models/User')

let auth = (req, res, next) => {
	// middleware 를 작성하세요
	// 인증처리하는 곳

	// client cookie 에서 token 을 가져옵니다.
	let token = req.cookies.x_auth;
	// token 복호화하여 user 를 찾는다.
	User.findByToken(token, (err, user) => {
		if (err) throw err;
		if (!user) return res.json({ isAuth: false, error: true })

		req.token = token;
		req.user = user;
		next();  // auth 미들웨어 뒤 동작을 가능하도록 한다.
	})
	// user 가 있으면 ok
	// 없으면 인증 no
}

module.exports = { auth }
