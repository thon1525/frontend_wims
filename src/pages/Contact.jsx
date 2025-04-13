import PagesTitle from "../components/PagesTitle";
import ContactPerson from "../components/cards/ContactPerson";

const contactData = [
  {
    image: 'https://i.pravatar.cc/500?img=68',
    name: 'Jason Price',
    email: 'kuhlman.jermey@yahoo.com',
  },
  {
    image: 'https://i.pravatar.cc/500?img=59',
    name: 'Duane Dean',
    email: 'rusty.botsford@wilfrid.io',
  },
  {
    image: 'https://i.pravatar.cc/500?img=57',
    name: 'Jonathan Barker',
    email: 'cora_haley@quinn.biz',
  },
  {
    image: 'https://i.pravatar.cc/500?img=33',
    name: 'Rosie Glover',
    email: 'lockman.marques@hotmail.com',
  },
  {
    image: 'https://i.pravatar.cc/500?img=12',
    name: 'Patrick Greer',
    email: 'pearlie.eichmann@trevion.net',
  },
  {
    image: 'https://i.pravatar.cc/500?img=8',
    name: 'Darrell Ortega',
    email: 'chaya.shields@ferry.info',
  },
]

const Contact = () => {
  return (
    <>
      <PagesTitle />

      <div className="mt-5 grid grid-cols-1 md:grid-cols-3 gap-5">
        {
          contactData.map((contact, index) => (
            <ContactPerson key={index} person={contact} />
          ))
        }
      </div>
    </>
  )
}

export default Contact