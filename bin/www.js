const server = require('../App')
const config = require('../config.json')
const port = process.env.PORT || config.PORT

server.listen(port, ()=>{
    console.log(`Server's Listening on *:${port}`)
})