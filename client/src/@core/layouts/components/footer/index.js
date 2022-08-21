// ** Icons Import
import { Heart } from 'react-feather'

const Footer = () => {
  return (
    <p className='clearfix mb-0'>
      <span className='float-md-start d-block d-md-inline-block mt-25'>
        A project by
          <a href='https://1.envato.market/pixinvent_portfolio' target='_blank' rel='noopener noreferrer'> Anshul Paliwal
          </a> , <a  href='https://1.envato.market/pixinvent_portfolio' target='_blank' rel='noopener noreferrer'> Naveet Agrawal
          </a> for the completion of MCA at <a  className="text-danger" href="https://jecrcuniversity.edu.in/" target='_blank' rel='noopener noreferrer'>JECRC</a>
      </span>
      <span className='float-md-end d-none d-md-block'>
        Hand-crafted & Made with
        <Heart size={14} />
      </span>
    </p>
  )
}

export default Footer
