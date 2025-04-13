/* eslint-disable react/prop-types */
import EmailItem from "./EmailItem";
// import Chat from "./Chat";

const initialEmailData = [
  {
    id: 1,
    sender: "Jullu Jalal",
    subject: "Our Bachelor of Commerce program is ACBSP-accredited.",
    time: "8:38 AM",
    label: "Primary",
    starred: false,
    folder: "inbox",
  },
  {
    id: 2,
    sender: "Minerva Barnett",
    subject: "Get Best Advertiser In Your Side Pocket",
    time: "8:13 AM",
    label: "Work",
    starred: false,
    folder: "inbox",
  },
  {
    id: 3,
    sender: "Peter Lewis",
    subject: "Vacation Home Rental Success",
    time: "7:52 PM",
    label: "Friends",
    starred: false,
    folder: "inbox",
  },
  {
    id: 4,
    sender: "Anthony Briggs",
    subject: "Free Classifieds Using Them To Promote Your Stuff Online",
    time: "7:52 PM",
    label: "",
    starred: true,
    folder: "inbox",
  },
  {
    id: 5,
    sender: "Clifford Morgan",
    subject: "Enhance Your Brand Potential With Giant Advertising Blimps",
    time: "4:13 PM",
    label: "Social",
    starred: false,
    folder: "inbox",
  },
  {
    id: 6,
    sender: "Lora Houston",
    subject: "Vacation Home Rental Success",
    time: "7:52 PM",
    label: "Friends",
    starred: false,
    folder: "inbox",
  },
  {
    id: 7,
    sender: "Olga Hogan",
    subject: "Enhance Your Brand Potential With Giant Advertising Blimps",
    time: "4:13 PM",
    label: "Social",
    starred: false,
    folder: "inbox",
  },
  {
    id: 8,
    sender: "Fanny Weaver",
    subject: "Free Classifieds Using Them To Promote Your Stuff Online",
    time: "7:52 PM",
    label: "",
    starred: true,
    folder: "inbox",
  },
  {
    id: 9,
    sender: "Jared Dunn",
    subject: "Project Update: Q2 Goals",
    time: "2:30 PM",
    label: "Work",
    starred: false,
    folder: "inbox",
  },
  {
    id: 10,
    sender: "Monica Hall",
    subject: "Team Building Event Next Month",
    time: "11:15 AM",
    label: "Social",
    starred: false,
    folder: "inbox",
  },
  {
    id: 11,
    sender: "Richard Hendricks",
    subject: "New Algorithm Breakthrough",
    time: "9:45 AM",
    label: "Work",
    starred: true,
    folder: "inbox",
  },
  {
    id: 12,
    sender: "Erlich Bachman",
    subject: "Pitch Deck for Investors",
    time: "3:20 PM",
    label: "Work",
    starred: false,
    folder: "inbox",
  },
];

const EmailList = () => {

  return (
    <>
      <div className="email-list-container flex-grow overflow-hidden">
        <div className="space-y-2">
          {initialEmailData.map((email) => (
            <EmailItem
              key={email.id}
              email={email}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default EmailList;