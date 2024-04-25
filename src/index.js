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
app.get('/', (req, res) => {
    res.render('login')
})
app.get('/home', (req, res) => {
    res.render('home')
})

app.post('/signup', async (req, res) => {

    try {
        const data = {
            name: req.body.name,
            password: req.body.password
        }
        
        const checking = await LogInCollection.findOne({ name: req.body.name })

        if (checking) {
            res.send(`
            <script>
                alert("Given Username already exist.Please enter a different username.");
                setTimeout(function() {
                    window.location.href = "/signup";
                }, );
            </script>
        `);
        } else {
            await LogInCollection.insertMany([data]);
            res.status(201).send(`
                <script>
                    alert("Successfully Signed up !!! Now please Log In");
                    setTimeout(function() {
                        window.location.href = "/"; 
                    }, );
                </script>
            `);
        }
        }
     catch (error) {
        res.send(`
            <script>
                alert("wrong input type !!! Please enter correct details");
                setTimeout(function() {
                    window.location.href = "/signup";
                }, );
            </script>
        `);
    }
})

app.post('/login', async (req, res) => {
    try {
        const check = await LogInCollection.findOne({ name: req.body.name })

        if (check.password === req.body.password) {
            res.status(201).render("home", { naming: `${req.body.name}` })
        }
         else {
            res.send(`
            <script>
                alert("incorrect password !!! Please enter correct password");
                setTimeout(function() {
                    window.location.href = "/";
                }, );
            </script>
        `);
        }
    } catch (error) {
        res.send(`
            <script>
                alert("Provided Username doesnot exist !! ");
                setTimeout(function() {
                    window.location.href = "/";
                }, );
            </script>
        `);
    }
})




app.listen(port, () => {
    console.log('port connected');
})