import React from 'react'
import Hero from '@/components/hero'
import Lending from '@/components/lending-solution'
// import WhyChoose from '@/components/why-choose'
import Testimonial from '@/components/testimonial'
import Faq from '@/components/faq'
import Contact from '@/components/contact'


const page = () => {
  return (
    <div>
      <Hero/>
      <Lending/>
      {/* <WhyChoose/> */}
      <Testimonial/>
      <Faq/>
      <Contact/>
    </div>
  )
}

export default page