import nodemailer from 'nodemailer';

export const submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.json({ success: false, message: 'Required all fields' });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `${name} <${email}>`,
            to: process.env.EMAIL_USER,
            replyTo: email,
            subject: `New Inquiry: ${name} is interested in Banaras Tour`,
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background-color: #f9f9f9; border-radius: 12px; overflow: hidden; border: 1px solid #eee; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
                    <!-- Header with Profile Theme Gradient -->
                    <div style="background: linear-gradient(to right, #f97316, #dc2626); padding: 35px 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 30px; font-weight: 800; letter-spacing: -0.5px;">BANARAS TOUR</h1>
                        <p style="color: rgba(255,255,255,0.8); margin: 8px 0 0; font-size: 14px; font-weight: 500;">New Inquiry Received</p>
                    </div>
                    
                    <!-- Content Area -->
                    <div style="padding: 40px; background-color: #ffffff;">
                        <div style="margin-bottom: 30px;">
                            <h3 style="color: #f97316; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Customer Details</h3>
                            <div style="background-color: #fff7ed; padding: 20px; border-radius: 10px; border: 1px solid #ffedd5;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 5px 0; color: #7c2d12; font-weight: 600; width: 80px;">Name:</td>
                                        <td style="padding: 5px 0; color: #431407;">${name}</td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 5px 0; color: #7c2d12; font-weight: 600;">Email:</td>
                                        <td style="padding: 5px 0; color: #431407;">${email}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>

                        <div style="margin-bottom: 35px;">
                            <h3 style="color: #f97316; margin-bottom: 12px; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700;">Message From Customer</h3>
                            <div style="background-color: #ffffff; border-left: 4px solid #f97316; padding: 20px; font-style: italic; color: #444; line-height: 1.6; background-color: #fafafa; border-radius: 0 8px 8px 0;">
                                "${message}"
                            </div>
                        </div>
                        
                        <div style="text-align: center;">
                            <a href="mailto:${email}" style="display: inline-block; background: linear-gradient(to right, #f97316, #dc2626); color: #ffffff; padding: 14px 35px; text-decoration: none; border-radius: 50px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 10px rgba(249, 115, 22, 0.3);">Reply Now</a>
                        </div>
                    </div>

                    <!-- Footer -->
                    <div style="background-color: #f8fafc; padding: 25px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #f1f5f9;">
                        <p style="margin: 0; text-transform: uppercase; letter-spacing: 0.5px;">Banaras Tour & Travels</p>
                        <p style="margin: 6px 0 0;">Received on: ${new Date().toLocaleString()}</p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        
        return res.json({ success: true, message: 'Your message has been sent successfully!' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
