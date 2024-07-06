import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import jwt from 'jsonwebtoken'

const app = express()

const getUser = async (username) => {
  return { userId: 123, password: "12345678", username } // Simulate a call to the database where the user credentials are stored.
}

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())


app.get("/", (req, res, next) => {
  const { token } = req.cookies

  try {
    jwt.verify(token, process.env.TOKEN_SECRET)
    res.redirect('/welcome')
  } catch {
    next()
  }
}, (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "/public/index.html"));
})

app.get("/welcome", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "/public/welcome.html"));
})

app.post("/add", (req, res, next) => {
  const { token } = req.cookies

  try {
    const user = jwt.verify(token, process.env.TOKEN_SECRET)
    req.user = user
    next()
  } catch {
    res.redirect('/')
  }
}, (req, res) => {
  console.log(req.user);
  res.redirect("/welcome");
})

app.post('/login', async (req, res) => {
  const { username, password } = req.body

  const user = await getUser(username)

  if (user.password !== password) {
    return res.status(403).send('Invalid login details')
  }

  const token = jwt.sign(user, process.env.TOKEN_SECRET)

  res.cookie('token', token)
  res.redirect('/welcome')
})

app.listen(8080, () => {
  console.log('Server listening on port 8080')
})