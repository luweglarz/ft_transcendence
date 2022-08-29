// @brief sent when 1st step of 2FA sign-in successful
export interface SignInPartialDto {
  message: string;
  status: 'partial';
  token: string;
}
