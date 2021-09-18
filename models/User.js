const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;

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
		maxlength: 50,
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
	}
})

const User = mongoose.model('User', userSchema)

// 다른 곳에서 해당 모듈을 사용해야하니까
module.exports = { User }
