// MODÜL 5 · Federated Remote modülleri TypeScript'in bilmediği runtime
// import'lardır (webpack tarafından çözülür). Derleme zamanı hatası
// almamak için burada gevşek tip beyanları tanımlanır.

declare module "checkout/CheckoutWidget" {
  const CheckoutWidget: React.ComponentType<{ itemCount?: number }>;
  export default CheckoutWidget;
}

declare module "profile/ProfileWidget" {
  const ProfileWidget: React.ComponentType<{ userName?: string }>;
  export default ProfileWidget;
}
