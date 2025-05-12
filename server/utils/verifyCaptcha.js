const verifyCaptcha = async (token) => {
  if (!token) return false;

  try {
    const response = await axios.post(
      "https://www.google.com/recaptcha/api/siteverify",
      null,
      {
        params: {
          secret: process.env.RECAPTCHA_SECRET_KEY,
          response: token,
        },
      }
    );

    return response.data.success;
  } catch (err) {
    console.error("Ошибка проверки reCAPTCHA:", err);
    return false;
  }
};
