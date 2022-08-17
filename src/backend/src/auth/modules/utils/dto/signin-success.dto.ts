// @brief sent when sign-in successful
export interface SignInSuccessDto {
  message: string;
  tokens: {
    access: string;
    refresh: string;
  };
}
