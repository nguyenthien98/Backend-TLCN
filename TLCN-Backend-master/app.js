const createError = require('http-errors')
const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const cors = require('cors')
var sessions = require('express-session')

const mongo = require('./config/mongo')

// const swaggerUi = require('swagger-ui-express')
// const swaggerDocument = require('./swagger.json')

var corsOption = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['authorization']
}
app.use(cors(corsOption))

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const companyRouter = require('./routes/company')
const employeeRouter = require('./routes/employee')
const projectsRouter = require('./routes/projects')
const newsRouter = require('./routes/news')
const commentRouter = require('./routes/comment')
const transactionRouter = require('./routes/transaction/transaction')
const selldetailRouter = require('./routes/transaction/selldetail')
const rentdetailRouter = require('./routes/transaction/rentdetail')
const statisticRouter = require('./routes/statistic')

const adminRouter = require('./routes/admin/admin')
const manageAccountRouter = require('./routes/admin/manageAccount')
const manageProjectRouter = require('./routes/admin/manageProject')
const manageNewsRouter = require('./routes/admin/manageNews')
const manageCompanyRouter = require('./routes/admin/manageCompany')
const manageTransactionRouter = require('./routes/admin/manageTransaction')

app.use(sessions({
    secret: '(!)*#(!JE)WJEqw09ej12',
    resave: false,
    saveUninitialized: true
}))

const transactionProcess = require('./lib/transactionProcess')
transactionProcess.checkExpireTransaction()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))

app.use(cors())
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

mongoose.connect(mongo.url, mongo.options)
.then(success => {
    console.log('Connect Database Success')
})
.catch(err => {
    console.log('Connect Database Failed: ' + err)
    process.exit()
})

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.Promise = global.Promise

app.get('/favicon.ico', (req, res) => res.status(204));

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/company', companyRouter)
app.use('/employee', employeeRouter)
app.use('/projects', projectsRouter)
app.use('/news', newsRouter)
app.use('/comment', commentRouter)
app.use('/transaction', transactionRouter)
app.use('/selldetail', selldetailRouter)
app.use('/rentdetail', rentdetailRouter)
app.use('/statistic', statisticRouter)

app.use('/admin', adminRouter)
app.use('/manageAccount', manageAccountRouter)
app.use('/manageProject', manageProjectRouter)
app.use('/manageNews', manageNewsRouter)
app.use('/manageCompany', manageCompanyRouter)
app.use('/manageTransaction', manageTransactionRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

module.exports = app
