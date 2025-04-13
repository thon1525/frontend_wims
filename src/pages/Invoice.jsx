// eslint-disable-next-line no-unused-vars
import Card from "../ui/Card"
import PagesTitle from "../components/PagesTitle";
import InvoiceTable from "../components/InvoiceTable";

const invoiceData = [
  {
    persons: {
      sender: {
        name: 'Virginia Walker',
        address: '9694 Krajcik Locks Suite 635',
      },

      receiver: {
        name: 'Austin Miller',
        address: 'Brookview'
      },

      date: {
        dated: '12 Nov 2019',
        due: '25 Dec 2019'
      }
    }
  },
  {
    items: [
      {
        description: 'children toy',
        quantity: 2,
        cost: {
          base: 20,
          total: 40
        },
      },
      {
        description: 'makeup',
        quantity: 2,
        cost: {
          base: 50,
          total: 100
        },
      },
      {
        description: 'asus laptop',
        quantity: 5,
        cost: {
          base: 100,
          total: 500
        },
      },
      {
        description: 'iphone x',
        quantity: 4,
        cost: {
          base: 1000,
          total: 4000
        },
      },
    ]
  }
]

const Invoice = () => {
  return (
    <>
      <PagesTitle />

      <Card classNames={'px-4 py-5 sm:p-6'} style={{ backgroundColor: '#fff', marginTop: '20px' }}>
        <div className="grid grid-cols-1 md:grid-cols-3 mb-12 md:px-20">
          <div className="col-span-1">
            <p className="">Invoice From:</p>
            <p className="text-[#404040] font-medium">{invoiceData[0].persons.sender.name}</p>
            <p className="text-[#404040]">{invoiceData[0].persons.sender.address}</p>
          </div>
          <div className="col-span-1">
            <p className="">Invoice To:</p>
            <p className="text-[#404040] font-medium">{invoiceData[0].persons.receiver.name}</p>
            <p className="text-[#404040]">{invoiceData[0].persons.receiver.address}</p>
          </div>
          <div className="col-span-1">
            <p className="text-[#404040]">Invoice Date: {invoiceData[0].persons.date.dated}</p>
            <p className="text-[#404040]">Due Date: {invoiceData[0].persons.date.due}</p>
          </div>
        </div>
        <InvoiceTable header={['serial no', 'description', 'quantity', 'base cost', 'total cost']} data={invoiceData[1]?.items || []} />
      </Card>
    </>
  )
}

export default Invoice