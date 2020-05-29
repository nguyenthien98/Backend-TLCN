const moment = require('moment')

// thiết lập đối tượng, nội dung gửi mail
var mailOption = {
  from: 'myreales.company@gmail.com',
  to: '',
  subject: '',
  rejectUnauthorized: false,
  text: '',
}
module.exports = function EmailAdminModel() {
  this.mail = mailOption
  this.verifyMail = (receiver, link, password) => {
    const now = moment()
    this.mail.to = receiver
    this.mail.subject = '[RealState Admin] - Verify Account'
    this.mail.text = 'You recieved message from RealState. Here is you link for verifying your account, your default password is: '+ password + '. Please click it to login! \n Link: ' + link + '\nTime: ' + moment(now).format('DD/MM/YYYY, h:mm A')
  }

  this.resetMail = (receiver, password) => {
    const now = moment()
    this.mail.to = receiver
    this.mail.subject = '[RealState Admin] - Reset Password Account'
    this.mail.text = 'You recieved message from RealState . Your new password to login our web site is: '+ password + '. Thank you for using our service ! '  + '\nTime: ' + moment(now).format('DD/MM/YYYY, h:mm A')
  }
}
