import nodemailer from "nodemailer";
import { config } from "dotenv";
import MJ from "node-mailjet";
import fs from "fs";
import { eventCalenderTemplate } from "../libs/email-templates";
config();

export async function sendEmailViaNodeMailer(data) {
  const mailOptions = {
    from: "support@thehillapp.com",
    to: data.email,
    subject: data.subject || "Hill App",
    html: data.template,
  };
  return await sendEmail(mailOptions);
  // transporter.sendMail(mailOptions, function (error, info) {
  //   if (error) {
  //     console.log("Sending email with attachments error", error);
  //   } else {
  //     console.log(
  //       `Email sent with attachments. ${info.response} => Subject: ${data.subject}`
  //     );
  //   }
  // });
}

export async function sendEventCalendarEmail(data) {
  const {
    id,
    event_name,
    event_image_link,
    event_location,
    start_date,
    end_date,
    event_description,
  } = data.eventDetail;
  const { email, full_name } = data.subscriberDetail;

  const icalFilePath = `public/${id}.ics`;
  const icalContent = fs.readFileSync(icalFilePath, "utf8");
  // Define attachment
  const attachment = {
    ContentType: "text/calendar",
    Filename: "calendar-event.ics",
    Base64Content: Buffer.from(icalContent).toString("base64"),
  };

  const calendarInviteTemp = await eventCalenderTemplate({
    event_image_link,
    event_name,
    full_name,
    event_location,
    calendar_link: `https://www.google.com/calendar/render?action=TEMPLATE&text=${event_name}&dates=${start_date}/${end_date}&details=${event_description}&location=${event_location}&sf=true&output=xml`,
  });
  return new Promise((res, rej) => {
    const mailjet = new MJ({
      apiKey: process.env.MJ_APIKEY_PUBLIC,
      apiSecret: process.env.MJ_APIKEY_PRIVATE,
    });

    mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: "support@thehillapp.com",
              Name: "Hill App Support",
            },
            To: [{ Email: "ghazanfarriphah1395@gmail.com" }],
            Subject: `Event Confirmation - ${event_name}`,
            HTMLPart: calendarInviteTemp,
            Attachments: [attachment],
          },
        ],
      })
      .then((r) => {
        console.log("Email successfully delivered");
        fs.unlinkSync(`public/${id}.ics`);
        res("Email successfully delivered");
      })
      .catch((err) => {
        console.log({ err });
        rej("Failed to send email");
      });
  });
}

export const sendEmail = async (mailOptions) => {
  return new Promise((res, rej) => {
    const mailjet = new MJ({
      apiKey: process.env.MJ_APIKEY_PUBLIC,
      apiSecret: process.env.MJ_APIKEY_PRIVATE,
    });

    mailjet
      .post("send", { version: "v3.1" })
      .request({
        Messages: [
          {
            From: {
              Email: "support@thehillapp.com",
              Name: "Hill App Support",
            },
            To: [{ Email: mailOptions.to }],
            Subject: mailOptions.subject,
            HTMLPart: mailOptions.html,
          },
        ],
      })
      .then((r) => {
        console.log("Email successfuly delieverd to: " + mailOptions.to);
        res("Email successfuly delieverd to" + mailOptions.to);
      })
      .catch((err) => {
        console.log({ err });
        rej("Failed to send email");
      });
  });
};
