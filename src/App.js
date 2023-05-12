import logo from './logo.svg';
import './App.css';
import DictionaryReact from './component/DictionaryReact';
import { Route, Router, BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Route path="/" component={DictionaryReact} />
      </BrowserRouter>
    </>
  );
}

export default App;
