import React from "react";
// import Stories from "react-insta-stories";
import randomColor from "randomcolor";
import { FacebookShareButton } from "react-share";
import { Button } from "@material-ui/core";
import "./Test.css";

function Test({ user }) {
  const color = randomColor({
    luminosity: "dark",
    hue: "random",
  });
  console.log(color);
  // const stories = [
  //   {
  //     url:
  //       "https://scontent.fvtz3-1.fna.fbcdn.net/v/t1.0-9/120180527_2754070031530164_7724171226141157464_n.jpg?_nc_cat=105&_nc_sid=ca434c&_nc_ohc=JnJoOr8bozsAX8Diuwv&_nc_ht=scontent.fvtz3-1.fna&oh=4f8799d4098d0fe5ffd71a4ba97495ca&oe=5F97912A",
  //     duration: 5000,
  //     header: {
  //       heading: "Kiran siva sai",
  //       subheading: "Posted 50m ago",
  //       profileImage: user.photoURL,
  //       seeMore: ({ close }) => {
  //         return <div onClick={close}>Hello, click to close this.</div>;
  //       },
  //     },
  //   },
  //   {
  //     url:
  //       "https://scontent-maa2-1.xx.fbcdn.net/v/t1.0-9/s960x960/107801069_150161419975133_4842357787845787325_o.jpg?_nc_cat=110&_nc_sid=110474&_nc_ohc=IkVidAhNWPgAX9NNpru&_nc_ht=scontent-maa2-1.xx&tp=7&oh=8dbcb98a542a1fdf8aedd90dcb511bfd&oe=5F976175",
  //     duration: 6000,
  //     header: {
  //       heading: "Kiran siva sai",
  //       subheading: "Posted 20m ago",
  //       profileImage:
  //         "https://lh3.googleusercontent.com/a-/AOh14GhnUouszqxM_zhPwJaZPAhwA_zuwYwkyeCi_iT06g",
  //     },
  //   },
  // ];
  return (
    <div className="test">
      <div
        className="background__test"
        style={{ backgroundColor: color, width: "100px", height: "100px" }}
      ></div>
      {color}
      {/* <Stories
        stories={stories}
        defaultInterval={1500}
        width={"100%"}
        height={695}
      /> */}
      <FacebookShareButton
        url="facebook.com"
        children={<Button>Kiran</Button>}
      />
    </div>
  );
}

export default Test;
