const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

const sendMail = async (req, res) => {
  console.log("=== Новая заявка ===");
  console.log("req.body:", req.body);
  console.log("req.files:", req.files);
  try {
    const {
      name = "",
      email = "",
      phone = "",
      comment = "",
      cart = "[]",
    } = req.body;
    const file = req.files?.file;

    console.log("📨 Новая заявка:");
    console.log("Имя:", name);
    console.log("Email:", email);
    console.log("Телефон:", phone);
    console.log("Комментарий:", comment);
    console.log("Корзина:", cart);
    console.log("Файл:", file ? file.name : "нет файла");

    const transporter = nodemailer.createTransport({
      service: "yandex",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Новая заявка с сайта",
      text: `
Заявка от: ${name}
Email: ${email}
Телефон: ${phone}
Комментарий: ${comment}
Корзина: ${cart}
      `,
      html: `
        <h3>Заявка от: ${name}</h3>
        <p>Email: ${email}</p>
        <p>Телефон: ${phone}</p>
        <p>Комментарий: ${comment}</p>
        <h4>Корзина</h4>
        <pre>${cart}</pre>
      `,
    };

    // Прикрепление файла — только если он реально есть
    if (file && file.tempFilePath) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const safeEmail = email.replace(/[^a-zA-Z0-9]/g, "_");
      const originalName = Buffer.from(file.name, "latin1").toString("utf8");
      const newFilename = `${safeEmail}_${timestamp}_${originalName}`;
      const newPath = path.join(__dirname, "..", "tmp", newFilename);

      fs.renameSync(file.tempFilePath, newPath);

      mailOptions.attachments = [
        {
          filename: newFilename,
          path: newPath,
        },
      ];
    }

    await transporter.sendMail(mailOptions);
    return res.status(200).send("Заявка отправлена!");
  } catch (error) {
    console.error("❌ Ошибка при отправке:", error);
    return res.status(500).send("Не удалось отправить заявку.");
  }
};

module.exports = { sendMail };
