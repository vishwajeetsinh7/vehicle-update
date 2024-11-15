import "../../../src/App.css";
import '../Footer/Footer.css';
import { FaFacebook } from 'react-icons/fa';
import { FaTwitter } from 'react-icons/fa';
import { FaInstagram } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';


const Footer = () => {
  return (
    <div className="footer">
      <div  className="footer coll_footer footer-padding">
        <div  className="footer-links">
          <div className="footerlinksdiv">
              <h4>Business</h4>
              <a  href="#"> <p>Owner</p></a>
              <a  href="#"> <p>Management</p></a>
              <a  href="#"> <p>Individual</p></a>
          </div>
          <div className="footerlinksdiv">
              <h4>Resources</h4>
              <a  href="#"><p>Call Center</p> </a>
              <a  href="#"><p>Testimonials</p> </a>
              <a  href="#"> <p>TV</p></a>
          </div>
          <div className="footerlinksdiv">
              <h4>Partners</h4>
              <a  href="#"> <p>Details</p> </a>
          </div>

          <div className="footerlinksdiv">
              <h4>Company</h4>
              <a  href="#"><div><p>About</p></div></a>
              <a  href="#"><div><p>Vechicle</p></div></a>
              <a  href="#"><div><p>Services</p></div></a>
              <a  href="#"> <div><p>Contact</p></div> </a>
          </div>

          <div className="footerlinksdiv">
              <h4>Follow us</h4>
              <div className="socialmedia">
                  <FaFacebook size={30} color='#0f4b9b' />
                  <FaTwitter  size={30} color='#0f4b9b'  style={{ marginLeft: 10 }}/>
                  <FaLinkedin  size={30} color='#0f4b9b'  style={{ marginLeft: 10 }}/>
                  <FaInstagram size={30} color='#0f4b9b' style={{ marginLeft: 10 }} />
              </div>
          </div>
        </div>
        <hr />

{/** Em  {(new Date().getFullYear())}   (Ano Capturado dinâmicamente ) */}

      <div className="footer-below">
        <div className="footer-copyright">
          <p>
              {(new Date().getFullYear())} All right reserved. 
          </p>
        </div>
      <div className="footer-below-links">
          <a href="/terms"><div><p>Terms & Conditions</p></div></a>
          <a href="/privacy"><div><p>Privacy</p></div></a>
          <a href="/security"><div><p>security</p></div></a>
          <a href="/cookie"><div><p>Cookie Declaration</p></div></a>
      </div>
      </div>
      </div>
    </div>
  );
};

export default Footer;