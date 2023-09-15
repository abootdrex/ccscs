import { useEffect, useState } from "react";
import KeyboardDoubleArrowUpTwoToneIcon from '@mui/icons-material/KeyboardDoubleArrowUpTwoTone';


export default function Scroll () {
  const style={

    
backtotop :{
 
  position:' fixed',
  bottom: '20px',
  right: '10px',
  fontsize: '30px',
 
  color:' white',
  cursor: 'pointer',
  borderRedius: '100px',
  border:' none',
  background:'#000000' ,
  boxShadow: '0 5px 10px #585454',


}
  }

  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.pageYOffset > 300) {
        setShowButton(true);
      } else {
        setShowButton(false);
      }
    });
  }, []);

  // This function will scroll the window to the top 
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // for smoothly scrolling
    });
  };
  return (
    <>
      {showButton && (
       
        <button type="button" onClick={scrollToTop}color="secondary" style={style.backtotop}>        
        <KeyboardDoubleArrowUpTwoToneIcon />
      </button>
    
      )}
    
    </>
  );
}
