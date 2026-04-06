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
            from: process.env.EMAIL_USER,
            to: 'sainiavinash1111@gmail.com',
            replyTo: email,
            subject: `New Contact Form Submission from ${name}`,
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                    <h2>New Contact Us Message</h2>
                    <p><strong>Name:</strong> ${name}</p>
                    <p><strong>Email:</strong> ${email}</p>
                    <p><strong>Message:</strong></p>
                    <p style="background: #f4f4f4; padding: 15px; border-radius: 5px;">${message}</p>
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
