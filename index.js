import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

const app = express()

app.use(cors())
app.use(cookieParser())

app.get('/set-cookie', (req, res) => {
  res.cookie('token', 'Hello World', { httpOnly: true })
  res.sendStatus(200)
})

app.get('/clear-cookie', (req, res) => {
  res.clearCookie('token')
  res.sendStatus(200)
})

app.listen(8080, () => {
  console.log('Server listening on port 8080')
})