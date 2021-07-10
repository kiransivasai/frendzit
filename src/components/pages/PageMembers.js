import React from "react";
import PageMember from "./PageMember";
import "./PageMembers.css";

function PageMembers({ admins, members, user, isPageAdmin, pageId }) {
  return (
    <div className="pageMembers">
      {members.map((member) => (
        <div key={member} to={"/users/" + member} className="pageMembers__link">
          {admins === member ? (
            <PageMember
              id={member}
              isAdmin={true}
              isPageAdmin={isPageAdmin}
              user={user}
              pageId={pageId}
            />
          ) : (
            <PageMember
              id={member}
              isAdmin={false}
              isPageAdmin={isPageAdmin}
              user={user}
              pageId={pageId}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default PageMembers;
