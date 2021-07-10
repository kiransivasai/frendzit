import React from "react";
import ClassroomMember from "./ClassroomMember";
import "./ClassroomMembers.css";

function ClassroomMembers({
  admins,
  members,
  user,
  isClassroomAdmin,
  classroomId,
}) {
  return (
    <div className="classroomMembers">
      {members.map((member) => (
        <div
          key={member}
          to={"/users/" + member}
          className="classroomMembers__link"
        >
          {admins.includes(member) ? (
            <ClassroomMember
              id={member}
              isAdmin={true}
              isClassroomAdmin={isClassroomAdmin}
              user={user}
              classroomId={classroomId}
            />
          ) : (
            <ClassroomMember
              id={member}
              isAdmin={false}
              isClassroomAdmin={isClassroomAdmin}
              user={user}
              classroomId={classroomId}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default ClassroomMembers;
