import MySchoolItem from "@/components/MySchoolItem";
import NotAuthorized from "@/components/NotAuthorized";
import AuthContext from "@/context/AuthContext";
import { useContext } from "react";

export default function MySchools() {
  const { user } = useContext(AuthContext);

  if (!user) {
    return <NotAuthorized />;
  }
  return (
    <section className="section">
      <div className="level has-text-centered">
        <div className="level-item">
          <p className="title">My Schools</p>
        </div>
      </div>
      {user.schools.length === 0 ? (
        <p className="subtitle">You are not part of any school yet</p>
      ) : (
        user.schools.map((school) => (
          <MySchoolItem key={school.id} school={school} />
        ))
      )}
      <br />
    </section>
  );
}
