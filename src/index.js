const express = require("express")
const path = require("path")
const app = express()
const LogInCollection = require("./mongo")
const port = process.env.PORT || 8080
app.use(express.json())

app.use(express.urlencoded({ extended: false }))

const tempelatePath = path.join(__dirname, '../tempelates')
const publicPath = path.join(__dirname, '../public')
console.log(publicPath);

app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use(express.static(publicPath))




app.get('/signup', (req, res) => {
    res.render('signup')
})
app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/signup', async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            password: req.body.password
        }

        const checking = await LogInCollection.findOne({ name: req.body.name })

        if (checking) {
            res.send("user details already exist")
        } else {
            // const redirectDelay = 3000;

        res.status(201).send(`
            <script>
                alert("Successfully Signed up !!!  now please Log In");
                setTimeout(function() {
                    window.location.href = "login"; // Redirect after delay
                },);
            </script>
        `);
        }
    } catch (error) {
        res.send("wrong inputs")
    }
})

app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check && check.password === req.body.password) {
            res.status(201).redirect("/index.html");
        } else {
            res.send("incorrect password")
        }
    } catch (error) {
        res.send("wrong details")
    }
})




app.listen(port, () => {
    console.log('port connected');
})