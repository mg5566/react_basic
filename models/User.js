const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken')

const userSchema = mongoose.Schema({
	name: {
		type: String,
		maxlength: 50,
		minlength: 1,
	},
	email: {
		type: String,
		trim: true,
		unique: 1,
	},
	password: {
		type: String,
		minlength: 1
	},
	role: {
		type: Number,  // 1 은 관리자 2는 일반유저
		default: 2
	},
	image: String,
	token: {
		type: String,
	},
	tokenExp: {
		type: Number,
	}
})

// 유저모델에 유저정보를 저장하기 전에 함수를 동작시킨다는 의미입니다.
userSchema.pre('save', function (next) {
	// 비밀번호를 암호화합니다.

	// 모델로 생성된 schema 를 가져옵니다.
	var user = this;

	// 비밀번호만 변경될때, 동작하도록 합니다.
	if (user.isModified('password')) {
		// salt 를 생성
		bcrypt.genSalt(saltRounds, function (err, salt) {
			if (err) return next(err);
			// schema 에서 password 를 가져옵니다.
			bcrypt.hash(user.password, salt, function (err, hash) {
				if (err) return next(err);
				// Store hash in your password DB.
				// hash 된 비밀번호로 저장합니다.
				user.password = hash;
				next();
			});
		});
	} else {
		next();
	}
})

// comparePassword method 작성하기
userSchema.methods.comparePassword = function (plainPassword, callback) {
	// plain password     hash 된 비밀번호 를 비교해야합니다.
	// 0. plain password 를 hash 합니다. (hash 는 oneway 라서 plain으로 못만들어요.)
	bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
		if (err) return callback(err);
		callback(null, isMatch);
	})
}

// token 생성 Method 작성하기
userSchema.methods.generateToken = function (callback) {
	var user = this

	// jsonwebtoken 을 사용하여 token 생성하기
	var token = jwt.sign(user._id.toHexString(), 'secretToken')
	/*
	_id + 'secretToken' => token

	token 에 'secretToken' 을 넣으면 => _id 가 나옵니다.
	우리는 _id 를 통해서 이친구가 접속한 기록이 있는지 알 수 있습니다.
	*/
	user.token = token;
	// 여기서 save 를 호출할 수 있는 이유는 model 이 generateToken() 을 호출하기 때문입니다.
	user.save(function (err, user) {
		// console.log("error:", err);
		// console.log("user:", user);
		if (err) return callback(err);
		callback(null, user);
	})
}

const User = mongoose.model('User', userSchema)

// 다른 곳에서 해당 모듈을 사용해야하니까
module.exports = { User }
