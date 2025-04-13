/* eslint-disable react/prop-types */
import { MdMailOutline } from 'react-icons/md'
import Button from '../../ui/Button'
import Card from '../../ui/Card'

const ContactPerson = ({ person }) => {
    return (
        <Card style={{ backgroundColor: '#fff', display: 'relative', padding: 'none' }}>
            <img src={person.image} alt='person image' className="mb-5 w-full" />
            <span className="text-center">
                <p className="text-brand-primary-black font-medium">{person.name}</p>
                <p className="text-brand-primary-black text-opacity-50 text-[.875rem]">{person.email}</p>
                <Button classNames={'my-5 mx-auto px-4 py-2 flex items-center gap-2 border border-[#979797] text-[#979797] hover:bg-brand-primary-blue hover:text-white hover:border-brand-primary-blue'}><MdMailOutline /> Message</Button>
            </span>
        </Card>
    )
}

export default ContactPerson