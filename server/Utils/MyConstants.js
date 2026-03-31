// const MyConstants = {
//     DB_SERVER: 'cluster0.cgrzzwu.mongodb.net',
//     DB_USER: 'koale',
//     DB_PASS: 'koakoa',
//     DB_DATABASE: 'WEBNC',
//     EMAIL_USER: 'koale041@gmail.com', // Microsoft mail service
//     EMAIL_PASS: 'vkjd uyrx inve qzbt',
//     JWT_SECRET: 'b88953d90316533457629e2792203f08df417f09ef6bec5aab976300d82392019a117e8aa973db5d21c389cae447ed8e66fc4f3fb2c90d4dfc3c90f20a43d8a3',
//     JWT_EXPIRES: '3600000', // in milliseconds
// };
// module.exports = MyConstants;
const MyConstants = {
  DB_SERVER: 'ktkmotor.n4bzfni.mongodb.net',
  DB_USER: 'khoanguyen_db_user',
  DB_PASS: 'khoa1',
  DB_DATABASE: 'WEBNC',
  // Email service (Gmail với App Password)
  EMAIL_USER: 'koale041@gmail.com',
  EMAIL_PASS: 'vkjd uyrx inve qzbt', // Mã 16 ký tự bạn đã tạo
  // JSON Web Token configuration
  JWT_SECRET: 'b88953d90316533457629e2792203f08df417f09ef6bec5aab976300d82392019a117e8aa973db5d21c389cae447ed8e66fc4f3fb2c90d4dfc3c90f20a43d8a3',
  JWT_EXPIRES: '3600000', // 1 giờ (tính bằng milliseconds)
};
module.exports = MyConstants;

//Sửa DB_SV, DB_USER, DB_PASS, DB_DATABASE cho phù hợp với MongoDB Atlas của bạn
