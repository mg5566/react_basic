const mongoose = require('mongoose');

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

const User = mongoose.model('User', userSchema)

// 다른 곳에서 해당 모듈을 사용해야하니까
module.exports = { User }
