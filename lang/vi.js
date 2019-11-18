export const transValidation = {
  email_incorrect: "Email phải có dạng example@gmail.com",
  gender_incorrect: "Ủa có gì đó sai sai với giới tính!",
  password_incorrect: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ khoa, chữ thường, chứ số và ký tự đặc biệt",
  password_confirmation_incorrect: "Nhập lại mất khảu chưa chính xác!"
};

export const transErrors = {
  account_in_use: "Email này đã được sử dụng. ",
  account_removed: "Tài khoản đã bị gỡ hỏi hệ thống, liên hệ với bộ phận hỗ trợ để được giúp đỡ",
  account_not_active: "Email đã được đăng ký nhưng chưa active, vui lòng kiểm tra email của bạn",
  token_undefined: "Token không tồn tại.",
  login_failed: "Sai tải khoản hoặc mật khẩu!",
  server_error: "Có lỗi ở phía server. Làm ơn báo cáo bộ phận hỗ trợ. Xin cảm ơn!"
};

export const transSuccess = {
  userCreate: (userEmail) => {
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra email để active tài khoản`
  },
  account_actived: "Kích hoạt tài khoản thành công! Bạn đã có thể đăng nhập vào ứng dụng.",
  loginSuccess: (username) => {
    return `Xin chao ${username}, chúc bạn một ngày tốt lành.`;
  },
  logout_success: "Đăng xuất tài khoản thành công!"
};

export const transMail = {
  subject: "Xác nhận tài khoản chat",
  template: (linkVerify) => {
    return`
      <h2>Bạn nhân được Email này vì đã đăng ký tài khoản chat trên ứng dụng web chat with node</h2>
      <h3>Vui lòng click vào link bên dưới để xác nhận kích hoạt tài khoản</h3>
      <h3><a href = "${linkVerify}" target="blank">${linkVerify}</a></h3>
      <h4>Nếu tin rằng đây là nhầm lẫn xin hãy bỏ qua. Trân trọng.</h4>
    `;
  },
  send_failed: "Có lỗi trong quá trình gưi email."
};
