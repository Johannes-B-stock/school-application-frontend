import ProfileCard from "./ProfileCard";

export default function UserCardModal({ user, show }) {
  return (
    <div className={`modal ${show ? "is-active" : ""}`}>
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">{user.username}</p>
        </header>
        <section className="modal-card-body">
          <ProfileCard user={user} />
        </section>
      </div>
    </div>
  );
}
