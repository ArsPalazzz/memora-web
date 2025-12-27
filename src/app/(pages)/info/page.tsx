// app/profile/page.tsx
export const revalidate = false; // страница генерируется один раз

export default function ProfilePage() {
  return (
    <div>
      <h1>Профиль пользователя</h1>
      <div id="profile-content"></div>
    </div>
  );
}
