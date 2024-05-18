// const redis = require("redis");
// export const reddis = () =>{
//     client.on("connect", () => {
//         console.log("Connected to Redis Cloud");
//     });
//     const client =  redis.createClient({
//         url: "redis://redis-11788.c295.ap-southeast-1-1.ec2.redns.redis-cloud.com:0GmyooAjinX6jOm2Mh9ic7sVwriMo5KR@redislabs.com:11788",
//     });
      
//     client.on("error", (err) => {
//         console.error("Error connecting to Redis:", err);
//     });
      
   
      
//     // Lưu trữ OTP vào Redis Cloud
//     client.set("user:12345:otp", "123456", "EX", 600); // Lưu trữ OTP cho người dùng có ID 12345 trong 10 phút
      
//     // Lấy OTP từ Redis Cloud
//     client.get("user:12345:otp", (err, otp) => {
//         if (err) {
//             console.error("Error getting OTP from Redis:", err);
//             return;
//         }
      
//         console.log("OTP:", otp);
//     });
      
//     // Xóa OTP khỏi Redis Cloud
//     client.del("user:12345:otp");
      
// };
