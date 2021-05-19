import './App.css';
import { useHelloQuery } from './generated/graphql';

function App() {
  const { data, loading } = useHelloQuery();

  if (loading || !data) {
    return (
      <div className="App">
        <header className="App-header">
          loading...
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
