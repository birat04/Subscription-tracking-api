import { emailTemplates } from "./email-template.js";
import transporter,{ accountEmail } from  "../config/nodemailer.js";
 
export const sendReminderEmail = async (to, type, subscription) => { 
    if(!to || !type || !subscription){
        throw new Error('to, type and subscription are required');
    }
    const template = emailTemplates.find((t) => t.label === type);
    if(!template){
        throw new Error('Invalid email template type');
    }
    const mailInfo = {
        userName : subscription.user.name,
        subscriptionName : subscription.name,
        renewalDate : dayjs(subscription.renewalDate).format('MMMM DD, YYYY'),
        daysLeft : subscription.daysLeft,
        planName : subscription.name,
        price : `${subscription.currency} ${subscription.price} (${subscription.frequency})`,
        paymentMethod : subscription.paymentMethod,
        accountSettingsLink : 'https://subdub.com/account',
    }
    const message = template.generateBody(mailInfo);
    const subject = template.generateSubject(mailInfo);
    const mailOptions = {
        from : accountEmail,
        to: to,
        subject: subject,
        html: message,

    }
    transporter.sendMail(mailOptions, (error, info) => {
        if(error){
            console.log('Error sending email', error);
        }else{
            console.log('Email sent: ' + info.response);
        }
    }
    );
}
