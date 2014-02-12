var secrets = require('../config/secrets');
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport('SMTP', {
//  service: 'Mailgun',
//  auth: {
//    user: secrets.mailgun.login,
//    pass: secrets.mailgun.password
//  }
  service: 'SendGrid',
  auth: {
       user: secrets.sendgrid.user,
       pass: secrets.sendgrid.password
  }
});

/**
 * GET /contact
 * Contact form page.
 */

exports.getContact = function(req, res) {
  res.render('contact', {
    title: req.i18n.t('common.contact')
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 * @param email
 * @param name
 * @param message
 */

exports.postContact = function(req, res) {
  req.assert('name', req.i18n.t('contact.nameBlank')).notEmpty();
  req.assert('email', req.i18n.t('contact.emailNotValid')).isEmail();
  req.assert('message', req.i18n.t('contact.messageBlank')).notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  var from = req.body.email;
  var name = req.body.name;
  var body = req.body.message;
  var to = 'you@email.com';
  var subject = req.i18n.t('contact.subject');

  var mailOptions = {
    to: to,
    from: from,
    subject: subject,
    text: body + '\n\n' + name
  };

  smtpTransport.sendMail(mailOptions, function(err) {
    if (err) {
      req.flash('errors', { msg: err.message });
      return res.redirect('/contact');
    }
    req.flash('success', { msg: req.i18n.t('contact.success') });
    res.redirect('/contact');
  });
};
