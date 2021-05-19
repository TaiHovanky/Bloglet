import './App.css';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/client';

function App() {
  const { data, loading } = useQuery(gql`
    {
      hello
    }
  `);

  if (loading) {
    return (
      <div className="App">
        <header className="App-header">
          waiting...
        </header>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        {data.hello}
      </header>
    </div>
  );
}

export default App;
