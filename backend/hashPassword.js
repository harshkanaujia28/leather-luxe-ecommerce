import bcrypt from "bcrypt"; // or "bcryptjs" if you installed bcryptjs

const password = "Harsh@123";

bcrypt.hash(password, 10)
  .then(hash => {
    console.log("Hashed password:", hash);
  })
  .catch(err => console.error(err));
