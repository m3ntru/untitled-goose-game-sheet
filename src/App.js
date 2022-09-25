import "./App.css";
import imgList from "./img.json";
import {useState, useEffect} from "react";
import tmi from "tmi.js";

const paramsId = new URLSearchParams(window.location.search).get("id");
const paramsToken = new URLSearchParams(window.location.search).get("token");
const client = new tmi.Client({
  options: {debug: false, messagesLogLevel: "info"},
  connection: {
    reconnect: true,
    secure: true,
  },
  identity: {
    username: paramsId ? paramsId : "justinfan123456",
    password: paramsToken ? paramsToken : "",
  },
  channels: [paramsId],
});

const CenterTableBlock = (props) => {
  return (
    <div
      className={`flex justify-center items-center col-span-1 overflow-hidden text-white border border-gray-800 ${props.className}`}
    >
      {props.children}
    </div>
  );
};

const LeftImgBlock = (props) => {
  const imgUrl = require(`./img/location/${props.index}.png`);
  return (
    <div className="absolute h-9 item w-full">
      <img alt="img" src={imgUrl}></img>
    </div>
  );
};

const CenterImgBlock = (props) => {
  const imgUrl = require(`./img/location/${props.index}.png`);
  return <img className="h-12 my-0.5" alt="img" src={imgUrl}></img>;
};

const ModalImgBlock = (props) => {
  const imgUrl = require(`./img/location/${props.index}.png`);
  return <img className="" alt="img" src={imgUrl}></img>;
};

const ImgModal = (props) => {
  return (
    <div
      onClick={props.close}
      id="defaultModal"
      tabIndex="-1"
      aria-hidden="true"
      className={
        props.status
          ? "h-full flex justify-center items-center overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 w-screen md:inset-0 h-modal  bg-gray-900/75"
          : "hidden"
      }
    >
      <div className="max-w-md m-auto">
        <div className="relative p-2 w-auto  bg-white rounded-lg shadow dark:bg-gray-700">
          <ModalImgBlock index={props.id} />
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [statusList, setStatusList] = useState([...imgList]);
  const [modal, setModal] = useState({status: false, id: 1});
  const [reset, setReset] = useState(false);
  const [tmiClient, setTmiClient] = useState(false);

  const tmiInit = () => {
    if (paramsId) {
      client
        .connect()
        .then((data) => {})
        .catch((err) => {
          console.log(err);
        });
      client.on("message", (target, context, msg, self) => {
        // console.log(msg);
        const isMod = context.username === paramsId || context.mod;
        if (isMod && msg.split(" ")[0].toLowerCase() == "!status") {
          const split = msg.split(" ");
          const newList = [...statusList];
          // console.log(parseInt(split[1]) - 1);
          // console.log(split[2] === "true");
          newList[parseInt(split[1]) - 1].status = split[2] === "true";
          setStatusList(newList);
          setStatusList(newList);
        }
      });
      return true;
    } else return false;
  };

  useEffect(() => {
    const result = tmiInit();
    setTmiClient(result);
    if (result) {
      console.log(client);
    }
  }, []);

  const resetStatus = () => {
    const newList = [...imgList];
    imgList.forEach((data, index) => {
      newList[index].status = false;
    });
    setStatusList(newList);
  };
  const switchStatus = (id, status) => {
    const newList = [...statusList];
    const result = status ? status === 2 : !newList[id - 1].status;
    if (tmiClient) client.say(paramsId, `!status ${id} ${result}`);
    else {
      console.log("not connect");
      newList[id - 1].status = result;
      setStatusList(newList);
    }
  };

  return (
    <div>
      <div className="w-screen h-screen flex overflow-auto bg-gray-900">
        <div className="h-screen pr-2 bg-gray-900 w-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-800">
          <div className="grid grid-cols-8 gap-0">
            <div className="select-none col-span-1 relative h-10 border bg-gray-700 border-gray-800 flex items-center justify-center">
              <div className="text-xl text-center overflow-hidden text-white font-bold ">
                Honk?
              </div>
            </div>
            {statusList.map((data, index) => {
              return (
                <div
                  key={data.id}
                  onClick={() => switchStatus(data.id)}
                  className="relative select-none col-span-1 h-10 border border-gray-800 bg-gray-700 flex items-center justify-center"
                >
                  <div className="text-xs leading-3 text-center overflow-hidden text-white font-bold ">
                    {data.item}
                  </div>
                  {data.status ? <LeftImgBlock index={data.id} /> : ""}
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex">
          <div className="pr-2 bg-gray-900 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-800">
            <div className="grid grid-cols-5 w-full shadow h-12 bg-gray-800">
              <CenterTableBlock className="text-lg font-bold">
                Item
              </CenterTableBlock>
              <CenterTableBlock className="text-lg font-bold">
                Location
              </CenterTableBlock>
              <CenterTableBlock className="text-lg font-bold">
                Image
              </CenterTableBlock>
              <CenterTableBlock className="text-lg font-bold">
                Status
              </CenterTableBlock>
              <CenterTableBlock className="text-lg font-bold">
                Action
              </CenterTableBlock>
            </div>
            {statusList.map((data, index) => {
              return (
                <div
                  key={data.id}
                  className="grid grid-cols-5 w-full shadow h-12 bg-gray-700"
                >
                  <CenterTableBlock>{data.item}</CenterTableBlock>
                  <CenterTableBlock>{data.area}</CenterTableBlock>
                  <CenterTableBlock className="reative">
                    {/* <img className="h-10 my-0.5" alt="img" src={textImg}></img> */}
                    <button
                      onClick={() => {
                        setModal({status: true, id: data.id});
                        console.log(data.id);
                      }}
                    >
                      <CenterImgBlock index={data.id} />
                    </button>
                  </CenterTableBlock>
                  <CenterTableBlock className="px-2">
                    <div
                      onClick={() => switchStatus(data.id, 1)}
                      disabled={!data.status}
                      className={`font-bold py-0.5 px-4 m-1 rounded ${
                        data.status
                          ? "text-white bg-green-500"
                          : "text-white bg-red-500"
                      }`}
                    >
                      {data.status ? "True" : "False"}
                    </div>
                  </CenterTableBlock>
                  <CenterTableBlock className="px-2">
                    <button
                      onClick={() => switchStatus(data.id, 1)}
                      disabled={!data.status}
                      className={`font-bold py-1 px-2 m-1 rounded ${
                        data.status
                          ? "text-white bg-gray-400 hover:bg-gray-600"
                          : "text-gray-200 bg-gray-500 opacity-20"
                      }`}
                    >
                      False
                    </button>
                    <button
                      onClick={() => switchStatus(data.id, 2)}
                      disabled={data.status}
                      className={`font-bold py-1 px-2 m-1 rounded ${
                        data.status
                          ? "text-gray-200 bg-gray-500 opacity-20"
                          : "text-white bg-gray-400 hover:bg-gray-600"
                      }`}
                    >
                      True
                    </button>
                  </CenterTableBlock>
                </div>
              );
            })}
          </div>
          <div className="block px-1 py-2 bg-gray-700">
            <div className="flex my-2 w-full justify-center">
              <div
                className={`w-10 h-6 flex items-center rounded-full p-0.5 duration-300 cursor-pointer ${
                  reset
                    ? "bg-green-500 border-2 border-green-500"
                    : "bg-gray-500 border-2 border-gray-500 "
                }`}
                onClick={() => {
                  setReset(!reset);
                }}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform duration-300${
                    reset ? "bg-white translate-x-4" : "'bg-gray-900"
                  }`}
                ></div>
              </div>
            </div>
            <button
              disabled={!reset}
              onClick={() => resetStatus()}
              className={`block font-bold py-1 h-10 w-64 px-2 m-1 rounded text-white ${
                reset
                  ? "text-white bg-red-500 hover:bg-red-700"
                  : "text-gray-200 bg-gray-500 opacity-20"
              }`}
            >
              All false
            </button>
          </div>
        </div>
      </div>
      <ImgModal
        status={modal.status}
        id={modal.id}
        close={() => setModal({status: false, id: 1})}
      />
    </div>
  );
};

export default App;
