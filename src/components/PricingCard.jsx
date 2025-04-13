/* eslint-disable react/prop-types */
import { capitalizeWords } from '../utils/capitalize'
import Button from '../ui/Button'
import Card from '../ui/Card'
import Divider from '../ui/Divider'

const PricingCard = ({ pricing }) => {

    return (
        <Card classNames={'px-4 py-5 sm:p-6'} style={{ backgroundColor: '#fff', borderRadius: '30px' }}>
            <div className='flex flex-col gap-5'>
                {/* top section */}
                {/* //fixme - use items-center text-center in the parent folder */}
                <div className='items-center text-center'>
                    <h5 className='text-brand-primary-black font-semibold'>{capitalizeWords(pricing.top.package)}</h5>
                    <p className='text-brand-primary-black text-opacity-80 text-[.75rem] mt-1'>{capitalizeWords(pricing.top.charge)} Charge</p>
                    <h1 className='text-brand-primary-blue text-[1.75rem] font-bold mt-4'>${pricing.top.price}</h1>
                </div>
                <Divider />
                {/* center section */}
                <div className='items-center text-center flex flex-col gap-3 text-brand-primary-black text-[.875rem] font-normal'>
                    <p>{pricing.center.freeSetup === true ? 'Free' : 'Paid'} Setup</p>
                    <p>Bandwidth Limit {pricing.center.bandwidth} GB</p>
                    <p>{pricing.center.connection} User Connection</p>
                    <p className={`${!pricing.center.analytics && 'text-brand-primary-black text-opacity-50'}`}>Analytics Report</p>
                    <p className={`${!pricing.center.publicApi && 'text-brand-primary-black text-opacity-50'}`}>Public API Access</p>
                    <p className={`${!pricing.center.plugins && 'text-brand-primary-black text-opacity-50'}`}>Plugins Integration</p>
                    <p className={`${!pricing.center.customContent && 'text-brand-primary-black text-opacity-50'}`}>Custom Content Management</p>
                </div>
                <Divider />
                {/* bottom section */}
                <div className='items-center text-center'>
                    <Button classNames={`${pricing.top.package === 'premium' ? 'bg-brand-primary-blue text-white hover:bg-white hover:text-brand-primary-blue' : 'text-brand-primary-blue'} hover:bg-brand-primary-blue hover:text-[#fff]`} style={{ padding: '10px 20px', borderRadius: '30px', border: '2px solid #4880FF' }} >{capitalizeWords(pricing.bottom.button)}</Button>
                    <p className='text-brand-primary-black text-[.875rem] font-normal mt-5'>Start Your {pricing.bottom.trialDays} Day Free Trial</p>
                </div>
            </div>
        </Card>
    )
}

export default PricingCard