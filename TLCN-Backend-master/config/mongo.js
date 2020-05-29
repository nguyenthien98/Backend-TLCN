// const  url = 'mongodb+srv://@cluster0-mmyqj.mongodb.net/realestate?retryWrites=true'
// const options = {
//     user: "tuan",
//     pass: "tuan123",
//     auth: {
//         authdb: 'admin'
//     },
//     useNewUrlParser: true,
// }

const url = 'mongodb://127.0.0.1:27017/realestate?retryWrites=true'
const options = {
    // user: "root",
    // pass: "root_password",
    // auth: {
    //     authdb: 'admin'
    // },
    useNewUrlParser: true,
}
// const url = 'mongodb+srv://cluster0-20pci.mongodb.net/realestate?retryWrites=true&w=majority'
// const options = {
//     user: "thien",
//     pass: "thien",
//     auth: {
//         authdb: 'admin'
//     },
//     useNewUrlParser: true,
// }


// const url = 'mongodb://127.0.0.1:27017/realestate?retryWrites=true'
// const options = {
//     // user: "root",
//     // pass: "root_password",
//     // auth: {
//     //     authdb: 'admin'
//     // },
//     useNewUrlParser: true,
// }

module.exports.url = url
module.exports.options = options
