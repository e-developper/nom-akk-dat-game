import {HashRouter, Route, Routes } from 'react-router';
import { useState } from 'react';
import SimpleGame from './page/simpleGame';
import Home from './page/home';

import './App.css'




const App = () => {
  const [showTable, setShowTable] = useState(false)

  return (
    <HashRouter>
      <div className="game">
        <h1 className="title">Die Artikel Spiele - 1</h1>
        <div className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simple" element={<SimpleGame />} />
            <Route path="/complete" element={<span>complete</span>} />
          </Routes>
          <div>
            {/* <button onClick={handleShuffle}>SHUFFLE</button> */}
            {/* <button onClick={() => setShowTable(!showTable)}>TOGGLE RESULT TABLE</button> */}
            {showTable && (
              <table>
                <thead>
                  <tr>
                    <th></th>
                    <th>Nom.</th>
                    <th>Akk.</th>
                    <th>Dat.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td><b>Mask.</b></td>
                    <td>der</td>
                    <td>de<b>n</b></td>
                    <td><b>dem</b></td>
                  </tr>
                  <tr>
                    <td><b>Fem.</b></td>
                    <td>die</td>
                    <td>die</td>
                    <td>de<b>r</b></td>
                  </tr>
                  <tr>
                    <td><b>Neutr.</b></td>
                    <td>das</td>
                    <td>das</td>
                    <td>da<b>m</b></td>
                  </tr>
                  <tr>
                    <td><b>Plural</b></td>
                    <td>die</td>
                    <td>die</td>
                    <td>de<b>n + n</b></td>
                  </tr>
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </HashRouter>
  )

}

export default App