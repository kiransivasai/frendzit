import React from "react";
import GroupMember from "./GroupMember";
import "./GroupMembers.css";

function GroupMembers({ admins, members, user, isGroupAdmin, groupId }) {
  return (
    <div className="groupMembers">
      {members.map((member) => (
        <div
          key={member}
          to={"/users/" + member}
          className="groupMembers__link"
        >
          {admins.includes(member) ? (
            <GroupMember
              id={member}
              isAdmin={true}
              isGroupAdmin={isGroupAdmin}
              user={user}
              groupId={groupId}
            />
          ) : (
            <GroupMember
              id={member}
              isAdmin={false}
              isGroupAdmin={isGroupAdmin}
              user={user}
              groupId={groupId}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default GroupMembers;
