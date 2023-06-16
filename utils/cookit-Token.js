exports.cookieToken = async (user, res) => {
  try {
    const token = await user.getJwtToken();

    const options = {
      expires: new Date(Date.now() + 1 * 60 * 60 * 1000),
      //   secure: true,
    };
    return res.status(200).cookie("token", token, options).json({
      status: "SUCCESS",
    });
  } catch (error) {
    const err = new Error("Could not generate Cookie Token");
    err.httpStatusCode = 500;
    return next(error);
  }
};
