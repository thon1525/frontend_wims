/* eslint-disable react/prop-types */
import OrdersTable from "./OrdersTable";

const orderListsData = [
  {
    id: "00001",
    name: "christine brooks",
    address: "889 kutch green apt. 448",
    date: "04 Sep 2019",
    type: "electric",
    status: "completed",
  },
  {
    id: "00002",
    name: "rosie pearson",
    address: "979 immanuel ferry suite 526",
    date: "28 May 2019",
    type: "Book",
    status: "processing",
  },
  {
    id: "00003",
    name: "darrell caldwell",
    address: "8567 fride ports",
    date: "23 Nov 2019",
    type: "Medicine",
    status: "rejected",
  },
  {
    id: "00004",
    name: "gilbert johnston",
    address: "765 destiny lake suite 600",
    date: "05 Feb 2019",
    type: "Mobile",
    status: "completed",
  },
  {
    id: "00005",
    name: "alan cain",
    address: "042 mylene throughway",
    date: "29 Jul 2019",
    type: "watch",
    status: "processing",
  },
  {
    id: "00006",
    name: "Alfred Murray",
    address: "543 weinman mountain",
    date: "15 Aug 2019",
    type: "medicine",
    status: "completed",
  },
  {
    id: "00007",
    name: "maggie sullivan",
    address: "new scottsberg",
    date: "21 Dec 2019",
    type: "watch",
    status: "processing",
  },
  {
    id: "00008",
    name: "rosie todd",
    address: "new joh",
    date: "30 Apr 2019",
    type: "medicine",
    status: "hold",
  },
  {
    id: "00009",
    name: "Dottie Miles",
    address: "124 lyla forge suite 375",
    date: "09 Jan 2019",
    type: "book",
    status: "transit",
  },
  {
    id: "00010",
    name: "christine brooks",
    address: "889 kutch green apt. 448",
    date: "04 Sep 2019",
    type: "electric",
    status: "completed",
  },
  {
    id: "00011",
    name: "rosie pearson",
    address: "979 immanuel ferry suite 526",
    date: "28 May 2019",
    type: "Book",
    status: "processing",
  },
  {
    id: "00012",
    name: "darrell caldwell",
    address: "8567 fride ports",
    date: "23 Nov 2019",
    type: "medicine",
    status: "rejected",
  },
  {
    id: "00013",
    name: "gilbert johnston",
    address: "765 destiny lake suite 600",
    date: "05 Feb 2019",
    type: "mobile",
    status: "completed",
  },
  {
    id: "00014",
    name: "alan cain",
    address: "042 mylene throughway",
    date: "29 Jul 2019",
    type: "watch",
    status: "processing",
  },
  {
    id: "00015",
    name: "alfred murray",
    address: "543 weinman mountain",
    date: "15 Aug 2019",
    type: "medicine",
    status: "completed",
  },
  {
    id: "00016",
    name: "Maggie Sullivan",
    address: "new sottsberg",
    date: "21 Dec 2019",
    type: "Watch",
    status: "processing",
  },
  {
    id: "00017",
    name: "Rosie Todd",
    address: "new joh",
    date: "30 Apr 2019",
    type: "medicine",
    status: "hold",
  },
  {
    id: "00018",
    name: "dottie miles",
    address: "124 lyla forge suite 375",
    date: "09 Jan 2019",
    type: "book",
    status: "transit",
  },
];

const EmailList = () => {

  return (
    <>
      <div className="email-list-container flex-grow overflow-hidden">
        <div className="">
            <OrdersTable
              header={['id', 'name', 'address', 'date', 'type', 'status']}
              data={orderListsData}
            />
        </div>
      </div>
    </>
  );
};

export default EmailList;