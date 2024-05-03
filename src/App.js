import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
//import Header from './Header';
// import Login from './Login';
//import Footer from './Footer';
// import HomePage from './HomePage';
// import Apply from './UserAuth/Apply'; // Import the Apply component
// import RegisterForm from './UserAuth/Register';
import Register from './UserAuth/Register';

// const App = () => {
//   return (
//     <Router>
//       <div className="App">
        
//         <Routes>
//           {/* <Route path="/" element={<HomePage />} />
//           <Route path="/login" element={<Login />} />
//           <Route path="/apply" element={<Apply />} /> */}
//         </Routes>
//       </div>
//     </Router>
//   );
// };

// export default App;

const App=() =>{
  return(
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Register/>}/>
        </Routes>
      </div>
    </Router>
  )
}
export default App;
