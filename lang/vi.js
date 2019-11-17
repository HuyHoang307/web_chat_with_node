export const transValidation = {
  email_incorrect: "Email phải có dạng example@gmail.com",
  gender_incorrect: "Ủa có gì đó sai sai với giới tính!",
  password_incorrect: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ khoa, chữ thường, chứ số và ký tự đặc biệt",
  password_confirmation_incorrect: "Nhập lại mất khảu chưa chính xác!"
};

export const transErrors = {
  account_in_use: "Email này đã được sử dụng. ",
  account_removed: "Tài khoản đã bị gỡ hỏi hệ thống, liên hệ với bộ phận hỗ trợ để được giúp đỡ",
  account_not_active: "Email đã được đăng ký nhưng chưa active, vui lòng kiểm tra email của bạn"
}

export const transSuccess = {
  userCreate: (userEmail) => {
    return `Tài khoản <strong>${userEmail}</strong> đã được tạo, vui lòng kiểm tra email để active tài khoản`
  }
}