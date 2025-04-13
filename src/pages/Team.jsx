import PagesTitle from "../components/PagesTitle";
import Button from "../ui/Button";
import TeamMember from "../components/cards/TeamMember";

const teamData = [
  {
    image: 'https://i.pravatar.cc/500?img=68',
    name: 'Jason Price',
    position: 'admin',
    email: 'kuhlman.jermey@yahoo.com',
  },
  {
    image: 'https://i.pravatar.cc/500?img=59',
    name: 'Duane Dean',
    position: 'ceo',
    email: 'rusty.botsford@wilfrid.io',
  },
  {
    image: 'https://i.pravatar.cc/500?img=57',
    name: 'Jonathan Barker',
    position: 'cto',
    email: 'cora_haley@quinn.biz',
  },
  {
    image: 'https://i.pravatar.cc/500?img=33',
    name: 'Rosie Glover',
    position: 'strategist',
    email: 'lockman.marques@hotmail.com',
  },
  {
    image: 'https://i.pravatar.cc/500?img=12',
    name: 'Patrick Greer',
    position: 'ceo',
    email: 'pearlie.eichmann@trevion.net',
  },
  {
    image: 'https://i.pravatar.cc/500?img=8',
    name: 'Darrell Ortega',
    position: 'digital marketer',
    email: 'chaya.shields@ferry.info',
  },
  {
    image: 'https://i.pravatar.cc/500?img=26',
    name: 'Lily French',
    position: 'strategist',
    email: 'lucienne.herman@hotmail.com',
  },
  {
    image: 'https://i.pravatar.cc/500?img=51',
    name: 'Howard Adkins',
    position: 'ceo',
    email: 'pearlie.eichmann@trevion.net',
  },
  {
    image: 'https://i.pravatar.cc/500?img=52',
    name: 'Earl Bowman',
    position: 'digital marketer',
    email: 'chaya.shields@ferry.info',
  },
  {
    image: 'https://i.pravatar.cc/500?img=54',
    name: 'Lenora Benson',
    position: 'lead',
    email: 'feil.wallace@kunde.us',
  },
  {
    image: 'https://i.pravatar.cc/500?img=47',
    name: 'George Bryant',
    position: 'social media',
    email: 'delmer.kling@gmail.com',
  },
  {
    image: 'https://i.pravatar.cc/500?img=11',
    name: 'Patrick Padilla',
    position: 'social media',
    email: 'octavia.nienow@gleichner.net',
  },
]

const Team = () => {

  return (
    <>
      <div className="flex items-center justify-between">
        <PagesTitle />
        <Button classNames={'bg-brand-primary-blue text-white px-3 py-3'}>Add New Member</Button>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-4 gap-5">
        {
          teamData.map((member, index) => (
            <TeamMember key={index} member={member} />
          ))
        }
      </div>
    </>
  )
}

export default Team