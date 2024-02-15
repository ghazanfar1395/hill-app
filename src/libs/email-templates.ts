export function forgotPasswordTemplate(data) {
  return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>The Hill App</title>
        <meta name="description" content="This is an email template">
        <meta name="keywords" content="HTML,CSS,XML,JavaScript">
        <meta name="author" content="Ovais Butt">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
    </head>
    <body>
    <table style="background: #F8FEFF; width: 100%; margin: 0 auto;padding-top: 40px; font-family: 'Poppins', sans-serif;">
        <tbody>
        <tr>
            <td>
                <table style="
    margin: 0 auto;
    width: 620px;
    background: linear-gradient(to bottom, #6D5AAE, #9A67BA);
    border-radius: 10px;
    box-shadow: 0px -4px 150px rgba(35, 56, 65, 0.05), 0px 45px 250px rgba(17, 33, 39, 0.1);
    ">
                    <tbody>
                    <tr>
                        <td style="vertical-align: top; width: 50%; padding-left: 40px;">
                        <a href="https://www.thehillapp.com/"><img style="height: 150px; width: 150px;" src="https://hill-app.s3.eu-west-2.amazonaws.com/open/logo-white.png" alt="img"  style="padding-top: 50px;"></a>
                            <h1 style="
                                margin-top: 40px;
                                font-weight: 600;
                                font-size: 24px;
                                line-height: 34px;
                                text-transform: uppercase;
                                color: #fff;
                                "
                            >Welcome to <br>
                                The Hill App</h1>
                        </td>
                        <td style="text-align: right; width: 50%;">
                            <img src="http://hcms.ai/wp-content/uploads/2022/07/email_banner_img.png" alt="img" style="padding-top: 10px; max-width: 100%">
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding-left: 40px;">
                            <h2 style="
                    font-weight: 600;
                    font-size: 20px;
                    line-height: 22px;
                    letter-spacing: 0.02em;
                    color: #fff;
                    text-align: left"
                            >Hi ${data.full_name},</h2>
                            <div style="display: block">
                                <p style="font-style: normal;
                        margin-top: 0;
                        font-weight: 400;
                        font-size: 16px;
                        line-height: 23px;
                        color: #fff;
                        margin-bottom: 20px"
                            >Your 4-digit reset-password code is: <span style="font-weight: bold">${data.password_reset_token}</span> </p>
  
                            <p style="color: #fff;" >Proceed back to the app and enter this OTP</p>
                            <p style="
                              font-weight: 100;
                              font-size: 14px;
                              font-style: italic;
                              color: #fff;
                              " >Please don't share your OTP with anyone.</p>
                                <!-- <a href="${data.domain}#/reset-password/${data.password_reset_token}" style="
                        width: 310px;
                        height: 55px;
                        line-height: 55px;
                        background: #329DFF;
                        margin-top: 32px;
                        margin-bottom: 65px;
                        display: block;
                        color: #fff;
                        text-decoration: none;
                        text-underline: none;
                        text-align: center;
                        border-radius: 6px;"
                                >Reset Password</a> -->
                                <p style="font-style: normal;
                            margin-top: 0;
                            font-weight: 400;
                            font-size: 16px;
                            line-height: 23px;
                            color: #fff;
                            margin-bottom: 25px;"
                                >Sincerely,<br>The Hill App Team</p>
                            </div>
    
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2">
                            <ul style="padding-left: 0; margin-top: 90px;margin-bottom: 30px; list-style: none; text-align: center">
                                <!-- <li style="margin-right: 22px; display: inline-block; vertical-align: middle;">
                                    <a href=""><img src="http://hcms.ai/wp-content/uploads/2022/07/email_linkdin.png" alt="img"></a>
                                </li>
                                <li style="margin-right: 22px; display: inline-block; vertical-align: middle;">
                                    <a href=""><img src="http://hcms.ai/wp-content/uploads/2022/07/email_insta.png" alt="img"></a>
                                </li>
                                <li style=" display: inline-block; vertical-align: middle;">
                                    <a href="https://www.youtube.com/channel/UCABnPt1Bv5bVt1DFsKEwoWQ"><img src="http://hcms.ai/wp-content/uploads/2022/07/email_utube.png" alt="img"></a>
                                </li> -->
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <td colspan="2" style="padding-left: 40px">
                            <p style="
                    font-weight: 400;
                    font-size: 13px;
                    line-height: 18px;
                    color: #ffff;
                    "
                            >Please visit us on <a href="https://www.thehillapp.com/" target="_blank" style="color: #fff; text-underline: none; text-decoration: none; font-weight: 600;">The Hill App</a> <br>
                            </p>
                        </td>
                    </tr>
                    </tbody>
                </table>
            </td>
        </tr>
        </tbody>
    </table>
    </body>
    </html>`;
}

export function createCompanyTemplate(data) {
  return `<!DOCTYPE html>
      <html>
      <head>
          <meta charset="UTF-8">
          <title>The Hill App</title>
          <meta name="description" content="This is an email template">
          <meta name="keywords" content="HTML,CSS,XML,JavaScript">
          <meta name="author" content="Ovais Butt">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
      </head>
      <body>
      <table style="background: #F8FEFF; width: 100%; margin: 0 auto;padding-top: 40px; font-family: 'Poppins', sans-serif;">
          <tbody>
          <tr>
              <td>
                  <table style="
      margin: 0 auto;
      width: 620px;
      background: linear-gradient(to bottom, #6D5AAE, #9A67BA);
      border-radius: 10px;
      box-shadow: 0px -4px 150px rgba(35, 56, 65, 0.05), 0px 45px 250px rgba(17, 33, 39, 0.1);
      ">
                      <tbody>
                      <tr>
                          <td style="vertical-align: top; width: 50%; padding-left: 40px;">
                            <a href="https://www.thehillapp.com/"><img style="height: 150px; width: 150px;" src="https://hill-app.s3.eu-west-2.amazonaws.com/open/logo-white.png" alt="img"  style="padding-top: 50px;"></a>
                            <h1 style="
                                  margin-top: 40px;
                                  font-weight: 600;
                                  font-size: 24px;
                                  line-height: 34px;
                                  text-transform: uppercase;
                                  color: #fff;
                                  "
                              >Welcome to <br>
                                  The Hill App</h1>
                          </td>
                          <td style="text-align: right; width: 50%;">
                              <img src="http://hcms.ai/wp-content/uploads/2022/07/email_banner_img.png" alt="img" style="padding-top: 10px; max-width: 100%">
                          </td>
                      </tr>
                      <tr>
                          <td colspan="2" style="padding-left: 40px;">
                              <h2 style="
                      font-weight: 600;
                      font-size: 20px;
                      line-height: 22px;
                      letter-spacing: 0.02em;
                      color: #fff;
                      text-align: left"
                              >Hi ${data.full_name},</h2>
                              <div style="display: block">
                                  <p style="font-style: normal;
                          margin-top: 0;
                          font-weight: 400;
                          font-size: 16px;
                          line-height: 23px;
                          color: #fff;
                          margin-bottom: 20px"
                              >We have created company profile for your company<span style="font-weight: bold"> ${data.company_name}</span>. Kindly visit The Hill App to setup your password. </p>
  
                              <h2 style="
                              font-weight: 600;
                              font-size: 20px;
                              line-height: 22px;
                              letter-spacing: 0.02em;
                              color: #fff;
                              text-align: left"
                                      >Email: ${data.email}</h2>
                              <h2 style="
                              font-weight: 600;
                              font-size: 20px;
                              line-height: 22px;
                              letter-spacing: 0.02em;
                              color: #fff;
                              text-align: left"
                                      >Password: ${data.password}</h2>
                              <!-- <p style="color: #fff;" >Proceed back to the app and enter this OTP</p> -->
                              <!-- <p style="
                                font-weight: 100;
                                font-size: 14px;
                                font-style: italic;
                                color: #fff;
                                " >Please don't share your OTP with anyone.</p> -->
                                  <!-- <a href="${data.domain}#/reset-password/${data.password_reset_token}" style="
                          width: 310px;
                          height: 55px;
                          line-height: 55px;
                          background: #329DFF;
                          margin-top: 32px;
                          margin-bottom: 65px;
                          display: block;
                          color: #fff;
                          text-decoration: none;
                          text-underline: none;
                          text-align: center;
                          border-radius: 6px;"
                                  >Set Company Profile</a> -->
                                  <p style="font-style: normal;
                              margin-top: 0;
                              font-weight: 400;
                              font-size: 16px;
                              line-height: 23px;
                              color: #fff;
                              margin-bottom: 25px;"
                                  >Sincerely,<br>The Hill App Team</p>
                              </div>
      
                          </td>
                      </tr>
                      <tr>
                          <td colspan="2">
                              <ul style="padding-left: 0; margin-top: 90px;margin-bottom: 30px; list-style: none; text-align: center">
                                  <!-- <li style="margin-right: 22px; display: inline-block; vertical-align: middle;">
                                      <a href="https://www.linkedin.com/company/hcms-ai/"><img src="http://hcms.ai/wp-content/uploads/2022/07/email_linkdin.png" alt="img"></a>
                                  </li>
                                  <li style="margin-right: 22px; display: inline-block; vertical-align: middle;">
                                      <a href="https://www.instagram.com/hcms.ai/"><img src="http://hcms.ai/wp-content/uploads/2022/07/email_insta.png" alt="img"></a>
                                  </li>
                                  <li style=" display: inline-block; vertical-align: middle;">
                                      <a href="https://www.youtube.com/channel/UCABnPt1Bv5bVt1DFsKEwoWQ"><img src="http://hcms.ai/wp-content/uploads/2022/07/email_utube.png" alt="img"></a>
                                  </li> -->
                              </ul>
                          </td>
                      </tr>
                      <tr>
                          <td colspan="2" style="padding-left: 40px">
                              <p style="
                      font-weight: 400;
                      font-size: 13px;
                      line-height: 18px;
                      color: #ffff;
                      "
                              >Please visit us on <a href="https://www.thehillapp.com/" target="_blank" style="color: #fff; text-underline: none; text-decoration: none; font-weight: 600;">The Hill App</a> <br>
                              </p>
                          </td>
                      </tr>
                      </tbody>
                  </table>
              </td>
          </tr>
          </tbody>
      </table>
      </body>
      </html>`;
}

export function createUserTemplate(data) {
  return `<!DOCTYPE html>
  <html>
  <head>
      <meta charset="UTF-8">
      <title>The Hill App</title>
      <meta name="description" content="This is an email template">
      <meta name="keywords" content="HTML,CSS,XML,JavaScript">
      <meta name="author" content="Ovais Butt">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="preconnect" href="https://fonts.googleapis.com">
      <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;600;700&display=swap" rel="stylesheet">
  </head>
  <body>
  <table style="background: #F8FEFF; width: 100%; margin: 0 auto;padding-top: 40px; font-family: 'Poppins', sans-serif;">
      <tbody>
      <tr>
          <td>
              <table style="
  margin: 0 auto;
  width: 620px;
  background: linear-gradient(to bottom, #6D5AAE, #9A67BA);
  border-radius: 10px;
  box-shadow: 0px -4px 150px rgba(35, 56, 65, 0.05), 0px 45px 250px rgba(17, 33, 39, 0.1);
  ">
                  <tbody>
                  <tr>
                      <td style="vertical-align: top; width: 50%; padding-left: 40px;">
                        <a href="https://www.thehillapp.com/"><img style="height: 150px; width: 150px;" src="https://hill-app.s3.eu-west-2.amazonaws.com/open/logo-white.png" alt="img"  style="padding-top: 50px;"></a>
                        <h1 style="
                              margin-top: 40px;
                              font-weight: 600;
                              font-size: 24px;
                              line-height: 34px;
                              text-transform: uppercase;
                              color: #fff;
                              "
                          >Welcome to <br>
                              The Hill App</h1>
                      </td>
                      <td style="text-align: right; width: 50%;">
                          <img src="http://hcms.ai/wp-content/uploads/2022/07/email_banner_img.png" alt="img" style="padding-top: 10px; max-width: 100%">
                      </td>
                  </tr>
                  <tr>
                      <td colspan="2" style="padding-left: 40px;">
                          <h2 style="
                  font-weight: 600;
                  font-size: 20px;
                  line-height: 22px;
                  letter-spacing: 0.02em;
                  color: #fff;
                  text-align: left"
                          >Hi ${data.full_name},</h2>
                          <div style="display: block">
                              <p style="font-style: normal;
                      margin-top: 0;
                      font-weight: 400;
                      font-size: 16px;
                      line-height: 23px;
                      color: #fff;
                      margin-bottom: 20px;
                      max-width: 95%;
                      "
                          >In case you missed the memo, the Hill App is now live! After months and months of development, we’re slowly but surely rolling out new features and getting our valued partners live. We have created a free user account for you with the details below. </p>
                          <h2 style="
                          font-weight: 600;
                          font-size: 20px;
                          line-height: 22px;
                          letter-spacing: 0.02em;
                          color: #fff;
                          text-align: left"
                                  >Email: ${data.email}</h2>
                          <h2 style="
                          font-weight: 600;
                          font-size: 20px;
                          line-height: 22px;
                          letter-spacing: 0.02em;
                          color: #fff;
                          text-align: left"
                                  >Password: ${data.password}</h2>
                                  <p style="font-style: normal;
                                  margin-top: 0;
                                  font-weight: 400;
                                  font-size: 16px;
                                  line-height: 23px;
                                  color: #fff;
                                  margin-bottom: 20px;
                                  max-width: 95%;
                                  "
                                      >You can download the app from the App Store or Google Play Store and explore its features today and connect with our valued partners, including Visa, Amazon, Zalando, Palantir Technologies, BT, Virgin Media O2, Vodafone and Snap Inc.</p>

                                      <a target="_blank" href="https://apps.apple.com/us/app/the-hill-app/id6471598746?ign-itscg=30200&ign-itsct=apps_box_badge" style="font-style: normal;
                                      font-weight: 400;
                                      font-size: 16px;
                                      line-height: 23px;
                                      color: #fff;
                                      " >Download on Apple Store</a>
                                      <br>
                                      <a target="_blank" style="font-style: normal;
                                      font-weight: 400;
                                      font-size: 16px;
                                      line-height: 23px;
                                      color: #fff;
                                      " href="https://play.google.com/store/apps/details?id=com.thehillapp.android&pcampaignid=pcampaignidMKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1&pli=1" >Download on Play Store</a>
                                      
                              <p style="font-style: normal;
                          margin-top: 20;
                          font-weight: 400;
                          font-size: 16px;
                          line-height: 23px;
                          color: #fff;
                          margin-bottom: 25px;"
                              >Your Sincerely,<br>The Hill App Team</p>
                          </div>
  
                      </td>
                  </tr>
                  <tr>
                      <td colspan="2">
                          <ul style="padding-left: 0; margin-top: 90px;margin-bottom: 30px; list-style: none; text-align: center">
                              <!-- <li style="margin-right: 22px; display: inline-block; vertical-align: middle;">
                                  <a href="https://www.linkedin.com/company/hcms-ai/"><img src="http://hcms.ai/wp-content/uploads/2022/07/email_linkdin.png" alt="img"></a>
                              </li>
                              <li style="margin-right: 22px; display: inline-block; vertical-align: middle;">
                                  <a href="https://www.instagram.com/hcms.ai/"><img src="http://hcms.ai/wp-content/uploads/2022/07/email_insta.png" alt="img"></a>
                              </li>
                              <li style=" display: inline-block; vertical-align: middle;">
                                  <a href="https://www.youtube.com/channel/UCABnPt1Bv5bVt1DFsKEwoWQ"><img src="http://hcms.ai/wp-content/uploads/2022/07/email_utube.png" alt="img"></a>
                              </li> -->
                          </ul>
                      </td>
                  </tr>
                  <tr>
                      <td colspan="2" style="padding-left: 40px">
                          <p style="
                  font-weight: 400;
                  font-size: 13px;
                  line-height: 18px;
                  color: #ffff;
                  "
                          >Please visit us on <a href="https://www.thehillapp.com/" target="_blank" style="color: #fff; text-underline: none; text-decoration: none; font-weight: 600;">The Hill App</a> <br>
                          </p>
                      </td>
                  </tr>
                  </tbody>
              </table>
          </td>
      </tr>
      </tbody>
  </table>
  </body>
  </html>`;
}

export function eventCalenderTemplate(data) {
  return `
    <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<style>
body {
margin: 0;
padding: 0;
font-family: Arial, sans-serif;
}

.header {
background: linear-gradient(to bottom, #6D5AAE, #9A67BA);
color: white;
text-align: center;
padding: 20px;
display: flex;
align-items: center;
justify-content: center;
}

.logo {
max-width: 100px;
max-height: 100px;
display: block;
margin: 0 auto;
}

.title {
margin-top: 10px;
font-size: 24px;
}

.content {
padding: 20px;
}

.event {
margin-bottom: 20px;
}

.event-img {
width: 100%;
max-width: 100%;
height: 350px;
object-fit: cover;
object-position: center top;
margin-bottom: 20px;
}

.event-subscriber {
font-size: 20px;
font-weight: bold;
/* margin-bottom: 5px; */
}

.event-para {
margin-top: 5px;
margin-bottom: 20px;
}

.event-title {
font-size: 18px;
font-weight: bold;
margin-bottom: 5px;
}

.event-details {
font-size: 16px;
}

.event-location {
flex-direction: row;
display: flex;
align-items: center;
}

.icon {
width: 25px; /* Adjust the width as needed */
height: 25px; /* Adjust the height as needed */
margin-right: 10px;
margin-top: 5px;
}

</style>
</head>
<body>

<div class="header">
<a href="https://www.thehillapp.com/"><img class="logo" src="https://hill-app.s3.eu-west-2.amazonaws.com/open/logo-white.png" alt="img"  ></a>
<div class="title">The Hill App</div>
</div>

<div class="content">
<div class="event">
<img src="${data.event_image_link}" alt="Event Image" class="event-img">
<div class="event-subscriber">Hey, ${data.full_name}</div>
<p class="event-para">Below are the details for your event:</p>
<div class="event-title">${data.event_name}</div>
<div class="event-details">
<div class="event-location" >
  <img src="https://hill-app.s3.eu-west-2.amazonaws.com/open/location.png" alt="Event Image" class="icon">
  <p><strong>Location:</strong> ${data.event_location}</p>
</div>
<div class="event-location" >
  <img src="https://hill-app.s3.eu-west-2.amazonaws.com/open/link.png" alt="Event Image" class="icon">
<p><strong>Link:</strong> <a href="event-link-url">Event Link</a></p>
</div>
<div class="event-location">
<img src="https://hill-app.s3.eu-west-2.amazonaws.com/open/calendar.png" alt="Calendar Icon" class="icon">
<p><strong>Add to Calendar:</strong> <a href=${data.calendar_link}>Google Calendar</a></p>
</div>
</div>
</div>
</div>
</body>
</html>

      `;
}
