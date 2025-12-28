import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import Mail from 'nodemailer/lib/mailer';


// Nodemailer
// // Create the transport method and pass the option
// // Pass the host -  store in the envniroment
const transport = nodemailer.createTransport({
 host: process.env.MAIL_HOST,
 port: process.env.MAIL_PORT,
 secure:true, //true for port 465, false for other ports - see the hostering mail connection setting
 auth:{
   user: process.env.MAIL_USER,
   pass: process.env.MAIL_PASSWORD,
 }
} as SMTPTransport.Options) // for type scipt add this "as SMTPTransport.Options"


// // create the function to sending email
// // Parameter that we need to send
// // Define the type of the nessage that we are sending
type sendEmailto={
 sender: Mail.Address,
 receipients:Mail.Address[],  // Multiple
 subject: string,
 message: string,
}


export const sendEmail = async (sendto:sendEmailto) =>{
 const {sender,receipients,subject,message} = sendto;
  // make use of the transport object to send an email
 return await transport.sendMail({
      from: sender,
      to: receipients,
      subject,
      html: message,   // message
      text:message,    // Plain text message of the html message
 })
}
