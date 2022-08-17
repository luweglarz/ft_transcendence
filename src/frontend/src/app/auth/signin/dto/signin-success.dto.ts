/*
 * @brief received data on successful sign-in
 */
export interface SignInSuccessDto {
  message: string;
  tokens: {
    access: string;
    refresh: string;
  };
}
