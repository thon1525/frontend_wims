/* eslint-disable react/prop-types */
import { capitalizeWords } from '../../utils/capitalize'
import Card from '../../ui/Card'
import Pattern2 from '../../assets/images/pattern_2.png'

const TeamMember = ({ member }) => {
    return (
        <Card classNames={'px-4 py-5 sm:p-6'} style={{ backgroundImage: `url(${Pattern2})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundColor: '#FFF' }}>
            <img src={member.image} alt='member image' className="mb-5 mx-auto sm:h-22 sm:w-20 md:h-20 md:w-20 rounded-full" />
            <span className="text-center">
                <p className="text-brand-primary-black font-medium">{member.name}</p>
                <p className="text-brand-primary-black text-opacity-50 text-[.875rem]">{member.position?.length > 3 ? capitalizeWords(member.position) : member.position?.toUpperCase()}</p>
                <p className="text-brand-primary-black text-opacity-50 text-[.875rem]">{member.email}</p>
            </span>
        </Card>
    )
}

export default TeamMember
